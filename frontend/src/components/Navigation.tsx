/** @jsx jsx */
import React, {useState, useEffect, useRef, useContext} from 'react';
import {Link} from 'react-router-dom';
import {jsx, SxStyleProp} from 'theme-ui';
import {theme} from '../utils/theme';
import {FaBars, FaTimes} from 'react-icons/fa';
import logo from '../assets/logo.svg';
import ResizeObserver from 'resize-observer-polyfill';
import { TransparentCtx, ITransparentCtx } from '../utils/contexts';

//TODO: mmmake diferent colorus
interface LinkProps {
  route: string;
  text: string;
  extraStyling?: SxStyleProp;
}

export const NavItem: React.FC<LinkProps> = ({
  route,
  text,
  extraStyling,
  children,
}) => {
  const style: SxStyleProp = {
    color: theme.colors.text.light,
    fontFamily: theme.fonts.body,
    display: 'block',
    '&:hover': {
      textDecoration: 'none',
      background: theme.colors.footer,
      color: theme.colors.text.light,
    },
    order: 2,
    px: 20,
    py: [2, 2, 3],
    width: ['100%', '100%', 'auto'],
    textAlign: 'center',
  };

  return (
    <Link to={'/' + route} sx={{...style, ...extraStyling}}>
      {text}
      {children}
    </Link>
  );
};

interface ToggleProps {
  toggle: boolean;
  onClick: () => void;
}

const Toggle: React.FC<ToggleProps> = ({toggle, onClick}) => {
  const toggleStyle: SxStyleProp = {
    order: 1,
    display: ['block', 'block', 'none'],
    fontSize: '1.3em',
    color: theme.colors.text.light,
    mr: '5%',
  };

  if (toggle) {
    return <FaTimes sx={toggleStyle} onClick={onClick} />;
  }
  return <FaBars sx={toggleStyle} onClick={onClick} />;
};

// Moving routes out of Navigation so Footer can access them
export interface NavRoutes {
  events: string;
  clubs: string;
  calendar: string;
  map: string;
  gallery: string;
  media: string;
  // faq: string;
  //about: string;
}

export const routes = {
  //key is the route name, value is displayed text
  events: 'Events',
  clubs: 'Clubs',
  calendar: 'Calendar',
  map: 'Map',
  gallery: 'Gallery',
  media: 'Media',
  // faq: 'FAQ',
  // about: 'About Us',
};

export const Navigation: React.FC = () => {
  const [toggle, setToggle] = useState<boolean>(false);
  const [navItemsHeight, setNavItemsHeight] = useState<number>(null);

  const navItemsRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const {transparent} = useContext<ITransparentCtx>(TransparentCtx);

  useEffect(() => {
    const scrollEvent = () => setToggle(false);
    const clickEvent = (e) => {
      if (toggle && e.target !== navRef.current) {
        setToggle(false);
      }
    };
    window.addEventListener('scroll', scrollEvent);
    window.addEventListener('click', clickEvent);
    return () => {
      window.removeEventListener('scroll', scrollEvent);
      window.removeEventListener('click', clickEvent);
    };
  }, [toggle]);

  useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const {height} = entry.contentRect;
        // console.log(height);
        setNavItemsHeight(height);
      });
    });
    ro.observe(navItemsRef.current);
    return () => ro.disconnect();
  }, []);

  const getNavItems = () => {
    const outlineWidth = 1.5;
    const navItemsStyle: SxStyleProp = {
      '&:hover': {
        cursor: 'pointer',
        textDecoration: 'none',
        color: theme.colors.text.light,
        backgroundColor: "#709C74",
        outlineOffset: -outlineWidth,
        outlineWidth: transparent ? outlineWidth : 0,
        outlineColor: theme.colors.footer,
        outlineStyle: 'solid',
      },
    };

    return Object.keys(routes).map((route) => {
      return (
        <NavItem
          route={route}
          text={routes[route].toUpperCase()}
          key={routes[route]}
          extraStyling={navItemsStyle}
        />
      );
    });
  };

  const transparentStyle: SxStyleProp = {
    backgroundColor: [theme.colors.navbar],
    backdropFilter: ['blur(4px)', undefined],
  };

  const wrapperStyle: SxStyleProp = {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row' as 'row',
    background: transparent ? 'transparent' : theme.colors.navbar,
    transition: 'background-color .5s ease',
    alignItems: 'center',
    position: 'fixed',
    zIndex: 10,
    boxShadow: '0 1px 5px ' + theme.colors.footer,
    flexWrap: 'wrap',
  };

  const navItemsWrapper: SxStyleProp = {
    display: 'flex',
    flexWrap: 'wrap',
    order: 2,
    transform: [
      toggle ? 'translateY(0)' : 'translateY(-100%)',
      toggle ? 'translateY(0)' : 'translateY(-100%)',
      'translateY(0)',
    ],
    transition: '.7s',
    overflow: 'hidden',
    height: [toggle ? navItemsHeight : 0, toggle ? navItemsHeight : 0, 'auto'],
    zIndex: 0,
    width: ['100%', '100%', 'auto'],
  };

  const logoStyle: SxStyleProp = {
    order: 0,
    justifySelf: 'flex-start',
    marginRight: 'auto',
    marginLeft: ['5%', '10%'],
    '&:hover': {
      cursor: 'pointer',
    },
    height: '3.5rem',
    zIndex: 1,
  };

  return (
    <div
      sx={transparent ? {...wrapperStyle, ...transparentStyle} : wrapperStyle}
      ref={navRef}
    >
      <Link to="/" sx={logoStyle}>
        <img src={logo} alt="" sx={logoStyle} />
      </Link>
      <Toggle toggle={toggle} onClick={() => setToggle((toggle) => !toggle)} />
      <div sx={navItemsWrapper}>
        <div
          ref={navItemsRef}
          children={getNavItems()}
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            width: ['100%', '100%', 'auto'],
          }}
        />
      </div>
    </div>
  );
};

export default Navigation;
