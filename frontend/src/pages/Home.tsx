/** @jsx jsx */
import React, {useContext, useState, useRef, useEffect} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {Link} from 'react-router-dom';
import {MdControlPoint} from 'react-icons/md';
import ResizeObserver from 'resize-observer-polyfill';

import {CountDownTimer} from '../components/home-components/CountDownTimer';
import {Heading} from '../components/Heading';
import {Collapsable} from '../components/Collapsable';
import {
  PhotoSlideDeck,
  Photo,
} from '../components/home-components/PhotoSlideDeck';

import {theme, FIRST_BREAKPOINT} from '../utils/theme';
import {
  InfoContext,
  IInfoContext,
  ITransparentCtx,
  TransparentCtx,
  ISetTransparentCtx,
  SetTransparentCtx,
} from '../utils/contexts';
import {getImageUrl, hexToRgbArr} from '../utils/functions';
import {RandomDot} from '../utils/RandomDot';
import {useToggleNavColour} from '../utils/hooks';



/**
 * The home screen, big parallax background plus the timer
 */
const Main: React.FC = () => {
  const countdownEvent = useContext<IInfoContext>(InfoContext).countdown[0];

  if (!countdownEvent) {
    return <div />;
  }

  const style: SxStyleProp = {
    width: '100%',
    height: '100vh',
    backgroundColor: "#F3EACC",
    display: 'flex',
    flexDirection: 'column', 
  };

  const buttonStyle: SxStyleProp = {
    top: '62%',
    left: '7%',
    width: 'fit-content',
    mx: 'auto',
    mt: '1em',
    position: ['static', 'absolute'],
    // backgroundColor: ['transparent', theme.colors.background.accent],
    color: theme.colors.text.darkGray,
    textAlign: 'center',
    fontFamily: theme.fonts.heading,
    fontSize: [20, 30],
    '&:hover': {
      textDecoration: 'none',
      color: theme.colors.background.black,
      backgroundColor: theme.colors.background.overlay,
    },
    fontVariantCaps: 'titling-caps',
    px: 4,
    order: 1,

    //mobile
    borderColor: theme.colors.background.black,
    borderWidth: [1, 2],
    borderStyle: 'solid',
  };

  return (
    <div sx={style}>
      <CountDownTimer date={new Date(countdownEvent.date)} />
      <Link to="events" sx={buttonStyle}>
        <div sx={{my: 2}}>{countdownEvent.eventName.toUpperCase()}</div>
      </Link>
    </div>
  );
};

//=============================================================

/**
 * The green board that has dots in the background
 * 
 */
const BackgroundWithDots: React.FC = (props) => {
  const [randomDots, setRandomDots] = useState<RandomDot[]>([]);
  const [numDots, setNumDots] = useState<number>(null);

  //for getting the width
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    //used to re-render the dots upon resizing, because it may be a long list
    const ro = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const height = entry.contentRect.height;
        generateRandomDots(height);
      });
    });
    ro.observe(componentRef.current);
    return () => ro.disconnect();
  }, [randomDots]);

  /**
   * Gets random dots for the background at
   * *x ∈ [0, 1/3(width)] ∪ [2/3(width), width], y ∈ [0, height]*
   */
  const generateRandomDots = (height: number) => {
    const width = componentRef.current.getBoundingClientRect().width;
    const dotsPerSideHeightInterval = 40;
    setNumDots((height / dotsPerSideHeightInterval) * 2);
    const numNewDots =
      height / dotsPerSideHeightInterval - randomDots.length / 2;

    for (let i = 0; i < numNewDots; i++) {
      setRandomDots((oldArr) => {
        const clone = [...oldArr];
        clone.push(
          new RandomDot(
            width - width / 3,
            height / 20,
            width / 3,
            height - height / 10,
          ),
        );
        clone.push(
          new RandomDot(0, height / 20, width / 3, height - height / 10),
        );
        return clone;
      });
    }
  };

  const style: SxStyleProp = {
    backgroundColor: theme.colors.secondary,
    borderRadius: 30,
    mt: 30,
    position: 'relative',
    pb: 60,
    pt: 20,
    display: 'flex',
  };

  return (
    <div sx={style} ref={componentRef}>
      {window.innerWidth > FIRST_BREAKPOINT
        ? randomDots.map((dot) => dot.getComponent()).slice(0, numDots)
        : undefined}
      {props.children}
    </div>
  );
};

//=============================================================

const UpcomingBoard: React.FC = () => {
  const {upcomingMiniEvents} = useContext<IInfoContext>(InfoContext);

  const style: SxStyleProp = {
    pt: theme.bodyPadding.pt,
    pb: theme.bodyPadding.pb,
    px: theme.bodyPadding.px,
  };

  /**
   * Gets the collapsable list for all upcoming events
   */
  const getEventsList = () => {
    const style: SxStyleProp = {
      fontSize: theme.fontSizes.bodyLarge,
      fontFamily: theme.fonts.body,
      ml: '5vw',
      display: 'flex', 
      flexDirection: 'row',
    };

    const descriptionStyle: SxStyleProp = {
      textAlign: 'left',
      pl: '1em',
      fontSize: theme.fontSizes.body.map((n) => n + 2),
      py: '0.5em',
    };

    return upcomingMiniEvents.map((event) => {
      const iconStyle: SxStyleProp = {
        color: theme.colors.footer,
        ml: '0.5em',
        // '&:hover': {
        //   color: theme.colors.footer,
        // },
      };

      const linkStyle: SxStyleProp = {
        color: theme.colors.text.light,
        maxWidth: '100%',
        textOverflow: 'wrap',
        '&:hover': {
          textDecoration: 'none',
          color: theme.colors.footer,
        },
      };

      const title = (
        <React.Fragment>
          <MdControlPoint sx={{mr: '1em',}} />
          {event.link ? (
            <a href={event.link} sx={linkStyle}>
              <p sx={{whiteSpace: 'initial'}}>{event.name}</p>
              {/* <GiClick sx={iconStyle} /> */}
            </a>
          ) : (
            <p sx={{whiteSpace: 'initial', display: 'inline'}}>{event.name}</p>
          )}
        </React.Fragment>
      );

      if (!event.description)
        return <Collapsable title={title} titleStyle={style} />;
      return (
        <Collapsable
          title={title}
          titleStyle={style}
          childrenStyle={{ml: ['20%', '15em']}}
        >
          <div sx={descriptionStyle}>{event.description}</div>
        </Collapsable>
      );
    });
  };

  /**
   * The placeholder value for if there are no upcoming events
   */
  const getPlaceHolder = () => {
    const style: SxStyleProp = {
      fontSize: theme.fontSizes.bodyLarge,
      textAlign: 'center',
      color: theme.colors.text.light,
      py: 5,
    };

    return <div sx={style}>Nothing Yet!</div>;
  };

  const eventListWrapper: SxStyleProp = {
    margin: 'auto',
  };

  if (!upcomingMiniEvents) {
    return <div />;
  }

  return (
    <div sx={style}>
      <Heading alignment="center" text="Upcoming" />
      <BackgroundWithDots>
        {upcomingMiniEvents.length > 0 ? (
          <div sx={eventListWrapper}>{getEventsList()}</div>
        ) : (
          getPlaceHolder()
        )}
      </BackgroundWithDots>
    </div>
  );
};

//=============================================================

/**
 * The recents gallery
 */
const Recent: React.FC = () => {
  const {recents} = useContext<IInfoContext>(InfoContext);
  const [width, setWidth] = useState<number>(0);
  const thisComponentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!thisComponentRef.current) return;
    setWidth(thisComponentRef.current.getBoundingClientRect().width);
  }, []);

  if (!recents) {
    return <div></div>;
  }

  const style: SxStyleProp = {
    backgroundColor: theme.colors.background.overlay,
    px: theme.bodyPadding.px,
    pt: theme.bodyPadding.pt,
    pb: theme.bodyPadding.pb,
  };

  //scale in relation to viewport width
  const scale = width > FIRST_BREAKPOINT ? 0.38 : 0.75;

  const photos: Photo[] = recents.map((event) => {
    return {
      url: getImageUrl(event.photoId, Math.round(width / scale), 1000),
      description: event.description,
    };
  });

  //target photo dimension
  //photos are 1.5:1 aspect ratio
  const photoDimension = {
    width: width * scale,
    height: (width * scale) / 1.5,
  };

  const line: SxStyleProp = {
    backgroundColor: theme.colors.primary,
    height: '0.2em',
    width: ['80%', '20%'],
    borderRadius: 3,
    mt: ['1em', '1.5em'],
    mx: 'auto',
  };
  return (
    <div sx={style} ref={thisComponentRef}>
      <Heading text="Recents" alignment="center" />
      <PhotoSlideDeck photos={photos} photoDimension={photoDimension} />
      <div sx={line} />
    </div>
  );
};

//=============================================================

export const Home: React.FC = () => {
  const {setTransparent} = useContext<ISetTransparentCtx>(SetTransparentCtx);
  const toggleNavUnsub = useToggleNavColour(window.innerHeight);
  console.log('mount');
  useEffect(() => {
    return toggleNavUnsub;
  }, []);

  return (
    <div>
      <Main />
      {/* <UpcomingBoard />
      <Recent /> */}
    </div>
  );
};

export default Home;
