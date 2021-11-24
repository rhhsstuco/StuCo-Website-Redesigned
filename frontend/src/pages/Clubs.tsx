/** @jsx jsx */
import React, {useContext, useRef, useEffect, useState} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {BsThreeDots, BsSearch} from 'react-icons/bs';
import {FaTimes} from 'react-icons/fa';

import {Heading} from '../components/Heading';
import {Collapsable} from '../components/Collapsable';

import {theme, FIRST_BREAKPOINT} from '../utils/theme';
import {
  IInfoContext,
  InfoContext,
  ISetTransparentCtx,
  SetTransparentCtx,
} from '../utils/contexts';
import {
  getImageUrl,
  disallowScrolling,
  randNum,
  randInt,
} from '../utils/functions';
import {Club} from '../utils/interfaces';

import clubBackground from '../assets/clubBackground.png';
import ResizeObserver from 'resize-observer-polyfill';
import {ClubPopup} from '../components/club-popup/ClubPopup';

//x1, y1 - top middle
//x2, y2 - bottom left
//x3, y3 - bottom right
class BgTriangleProp {
  private x1: string;
  private y1: string;
  private x2: string;
  private y2: string;
  private x3: string;
  private y3: string;
  private style: SxStyleProp = {};

  constructor(x1, y1, x2, y2, x3, y3, style: SxStyleProp) {
    this.x1 = x1;
    this.x2 = x2;
    this.x3 = x3;
    this.y1 = y1;
    this.y2 = y2;
    this.y3 = y3;
    this.style = style;
  }

  public getStyle = () => this.style;

  public getClipPath = () => {
    return `polygon(${this.x1} ${this.y1}, ${this.x2} ${this.y2}, ${this.x3} ${this.y3})`;
  };
}

export const Clubs: React.FC = () => {
  const {clubs, clubHighlights} = useContext<IInfoContext>(InfoContext);
  const [height, setHeight] = useState<number>(0);
  const [query, setQuery] = useState<string>('');
  const [isPopup, setIsPopup] = useState<boolean>(false);
  const [popupClub, setPopupClub] = useState<Club>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const bgRectWidth = useRef<number[]>([]);
  const bgTriangleProp = useRef<BgTriangleProp[]>([]);

  const {setTransparent} = useContext<ISetTransparentCtx>(SetTransparentCtx);
  useEffect(() => setTransparent(false), []);

  useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setHeight(entry.target.clientHeight);
      });
    });
    ro.observe(pageRef.current);
    return () => ro.disconnect();
  }, []);

  if (!clubs || !clubHighlights) {
    return <React.Fragment />;
  }

  /**
   * Gets the list of clubs
   */
  const getClubList = () => {
    const categories = {};
    clubs.forEach((club) => {
      if (categories[club.category]) {
        categories[club.category].push(club);
      } else {
        categories[club.category] = [club];
      }
    });

    const getClubs = (category) => {
      return categories[category].map((club) => {
        return (
          <div
            onClick={() => {
              setPopupClub(club);
              setIsPopup(true);
            }}
          >
            {club.name}
          </div>
        );
      });
    };

    //remember to change this if you rename
    const other = 'Other';

    return Object.keys(categories)
      .sort((a, b) => (a === other ? 1 : (b === other ? -1 : a.localeCompare(b)))) 
      .map((category, index) => {
        const titleStyle: SxStyleProp = {
          color: theme.colors.text.darkGray,
          borderColor: theme.colors.text.darkGray,
          fontSize: theme.fontSizes.bodyLarge,
          fontFamily: theme.fonts.body,
          '&:hover': {
            color: theme.colors.text.darkGray,
            cursor: 'pointer',
          },
        };
        const childrenStyle: SxStyleProp = {
          color: theme.colors.text.darkSlate,
          borderColor: theme.colors.text.darkSlate,
          ml: '80%',
          pl: '1em',
          fontSize: theme.fontSizes.bodySmall,
          width: '100%',
          '&:hover': {
            cursor: 'pointer',
          },
        };
        const titleWrapper: SxStyleProp = {
          textAlign: 'right',
        };
        const titleComponent = (
          <div sx={titleWrapper}>
            {category} <BsThreeDots />
          </div>
        );

        return (
          <Collapsable
            title={titleComponent}
            titleStyle={titleStyle}
            childrenStyle={childrenStyle}
            collapsed={true}
            collapseTime={0.002}
          >
            {getClubs(category)}
          </Collapsable>
        );
      });
  };

  //=================================================
  //querying
  const getSearchResult = (searchStr: string) => {
    return clubs.filter((club) => {
      if (!club.name) return false;
      return club.name.toLowerCase().includes(searchStr.toLowerCase());
    });
  };

  const displaySearchResults = () => {
    const wrapperStyle: SxStyleProp = {
      display: 'flex',
      flexDirection: 'column',
      mx: 'auto',
    };
    const style: SxStyleProp = {
      color: theme.colors.text.darkGray,
      borderColor: theme.colors.text.darkGray,
      fontSize: theme.fontSizes.bodyLarge,
      fontFamily: theme.fonts.body,
      padding: '0.3em',
      zIndex: 2,
      display: 'block',
      margin: 'auto',
      '&:hover': {
        cursor: 'pointer',
      },
    };
    const results = getSearchResult(query).map((club) => {
      return (
        <div
          sx={style}
          onClick={() => {
            setPopupClub(club);
            setIsPopup(true);
          }}
        >
          {club.name}
        </div>
      );
    });

    return <div sx={wrapperStyle}>{results}</div>;
  };

  //=================================================
  //background decorations
  const getTransluteRects = () => {
    const getStyle = (i) => {
      const style: SxStyleProp = {
        position: 'absolute',
        height: ['50%', '20%'],
        top: (i + 1) * 200,
        width: ['90%', '70%', `${bgRectWidth.current[i]}%`],
        backgroundColor: theme.colors.background.overlay,
        right: `${0}%`,
        zIndex: 0,
      };
      return style;
    };

    return Array.from(new Array(Math.floor(height / 250)).keys()).map((i) => {
      if (!bgRectWidth.current[i]) bgRectWidth.current.push(randNum(5, 55));
      return <div sx={getStyle(i)} />;
    });
  };

  const getTriangleImages = () => {
    const getStyle = (i: number) => {
      const imageUrl = getImageUrl(
        clubHighlights[i % clubHighlights.length].photoId,
        400,
        400,
      );
      const style: SxStyleProp = {
        zIndex: 0,
        backgroundColor: theme.colors.secondary,
        backgroundImage: `url(${imageUrl})`,
        clipPath: bgTriangleProp.current[i].getClipPath(),
        ml: 'auto',
        ...bgTriangleProp.current[i].getStyle(),
        backgroundSize: 'cover',
      };
      return style;
    };

    const triangles = Array.from(new Array(Math.floor(height / 250)).keys()).map((i) => {
      if (!bgTriangleProp.current[i]) {
        bgTriangleProp.current.push(
          new BgTriangleProp(
            `${randInt(40, 55)}%`,
            0,
            0,
            `${randInt(60, 100)}%`,
            '100%',
            `${randInt(30, 100)}%`,
            {
              width: `${randInt(7, 15)}vmax`,
              height: `${randInt(7, 15)}vmax`,
              mr: `${randInt(20, 50)}%`,
              my: `${randInt(2, 7)}%`,
            },
          ),
        );
      }
      return <div sx={getStyle(i)} />;
    });

    const wrapper: SxStyleProp = {
      width: ['30%', '40%'],
      top: '40%',
      right: 0,
      position: 'absolute',
      zIndex: 0,
    };

    //return <div sx={wrapper}>{triangles}</div>;
  };

  const renderClubPopup = () => {
    if (isPopup && popupClub) {
      disallowScrolling(window.scrollY);
      return (
        <ClubPopup
        clubInfo={popupClub}
        closeHandler={() => setIsPopup(false)}
        />
      );
    }
  };

  //=================================================
  //styles

  const wrapperStyle: SxStyleProp = {
    minHeight: '100vh',
    backgroundColor: theme.colors.beige,
    display: 'flex',
    flexWrap: 'wrap',
    ...theme.bodyPadding,
    pb: '20vh',
    overflow: 'hidden',
    flexDirection: ['column', 'row'],
    position: 'relative',
  };

  const clubListWrapper: SxStyleProp = {
    display: 'block',
    ml: [0, '10%', '30%'],
    zIndex: 2,
    mr: ['50%', 0],
  };
  const lineStyle: SxStyleProp = {
    backgroundColor: theme.colors.secondary,
    height: 2,
    width: '100%',
    borderRadius: 2,
    my: '0.5em',
  };

  const backgroundImgStyle: SxStyleProp = {
    position: 'absolute',
    top: height * 0.4,
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: height * 0.6,
    zIndex: 1,
  };

  const searchBoxStyle: SxStyleProp = {
    height: '1.3em',
    borderRadius: 15,
    borderColor: theme.colors.navbar,
    borderWidth: 1,
    width: '100%',
    py: '1em',
    px: '0.5em',
    fontSize: theme.fontSizes.bodySmall.map((n) => n + 5),
    fontFamily: theme.fonts.body,
    '&:focus': {
      borderWidth: 1.5,
      outline: 'none',
    },
    bg: theme.colors.background.light,
  };

  const searchBoxWrapperStyle: SxStyleProp = {
    position: 'relative',
    width: ['100%', '40%', '20%'],
    ml: 'auto', //change to 0 if there's club app button
    mt: ['2em', 'auto'],
    mb: ['1em', 'auto'],
    fontSize: theme.fontSizes.bodySmall.map((n) => n + 5),
  };
  const iconStyle: SxStyleProp = {
    position: 'absolute',
    right: '0.5em',
    top: '0.5em',
    '&:hover': {
      cursor: 'pointer',
    },
  };

  const headingStyle: SxStyleProp = {
    display: 'inline',
    mt: ['20%', 'auto'],
    mb: [0, 'auto'],
  };

  const clubAppButton: SxStyleProp = {
    color: theme.colors.primary,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.colors.primary,
    fontFamily: theme.fonts.body,
    fontSize: [16, 20],
    textAlign: 'center',
    my: 'auto',
    ml: [0, 'auto'],
    mr: [0, '2em'],
    px: '1em',
    py: '0.3em',
    '&:hover': {
      textDecoration: 'none',
      cursor: 'pointer',
      borderColor: theme.colors.navbar,
      color: theme.colors.navbar,
    },
  };

  //==============================================================
  //render

  const isFirstBreakpoint = window.innerWidth > FIRST_BREAKPOINT;

  return (
    <div sx={wrapperStyle} ref={pageRef}>
      <img src={clubBackground} sx={backgroundImgStyle} />
      {getTransluteRects()}

      <Heading
        text="2021-2022 Clubs"
        alignment={isFirstBreakpoint ? 'left' : 'center'}
        underline={false}
        extraStyling={headingStyle}
      />
      {/* a rare hard-coded club app cuz i dont feel like making it not hardcoded for now */}
      {/* <a sx={clubAppButton} href="https://forms.gle/65KmNA17PayScrqH6">
        Club application
      </a> */}

      <div sx={searchBoxWrapperStyle}>
        <input
          sx={searchBoxStyle}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Club name"
        />
        {query === '' ? (
          <BsSearch sx={iconStyle} />
        ) : (
          <FaTimes sx={iconStyle} onClick={() => setQuery('')} />
        )}
      </div>

      <div sx={lineStyle} />
      {query === '' ? (
        <div sx={clubListWrapper}>{getClubList()}</div>
      ) : (
        displaySearchResults()
      )}

      {isFirstBreakpoint ? getTriangleImages() : undefined}

      {renderClubPopup()}
    </div>
  );
};