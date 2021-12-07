/** @jsx jsx */
import React, {ReactElement} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';

import {NavItem, NavRoutes} from '../Navigation';

import {theme} from '../../utils/theme';

/** Props for a `FooterRoutes` component. */
export interface FooterRoutesProps {
  /** Routes to all the other locations. */
  routes: NavRoutes;
  /** Extra css for the text. */
  textStyle?: SxStyleProp;
}

/**
 * Constructs a `FooterRoutes` component, which gets all footer routes,
 * splits them in half, and renders the routes in a formatted style.
 *
 * @example
 * <FooterRoutes
 *   routes={routes}
 *   textStyle={textStyle}
 * />
 * @param props The props for this component
 * @return      all routes in a container element.
 */
export const FooterRoutes: React.FC<FooterRoutesProps> = ({
  routes,
  textStyle,
}): ReactElement => {
  // Split the routes in half to format links correctly
  const half: number = Math.ceil(Object.keys(routes).length / 2);
  const leftRoutes: string[][] = Object.entries(routes).slice(
    0,
    half,
  ) as string[][];
  const rightRoutes: string[][] = Object.entries(routes).slice(
    half,
  ) as string[][];

  // Styles ---------------------------------------------------------
  const mainWrapperStyle: SxStyleProp = {
    px: '5%',
  };
  const headerWrapperStyle: SxStyleProp = {
    width: '100%',
    textAlign: 'right',
    mb: '1.3em',
  };
  const headerTextStyle: SxStyleProp = {
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSizes.footerBig,
    color: theme.colors.text.light,
  };

  const routesStyle: SxStyleProp = {
    ...textStyle,

    // Push to the right or left depending on mobile or not
    ml: 'auto',
    mr: 0,
    width: '50%',
  };
  const routeContainerStyle: SxStyleProp = {
    width: '100%',
    margin: 'auto',

    display: 'flex',
    flexDirection: ['column', 'row'],
  };
  const listStyle: SxStyleProp = {
    textAlign: 'right',

    listStyleType: 'none',
    pl: '10%',
    pr: 0,
    mr: 0,
    my: 0,
  };
  // Functions -- ---------------------------------------------------
  /**
   * Convert a list of routes to a list of actual NavItem elements.
   * @param routes - All the routes in this list of links.
   * @returns a list of NavItem elements to the desired route.
   */
  const getRouteItems = (routes: string[][]): ReactElement[] => {
    const navStyle: SxStyleProp = {
      px: 0,
      py: '2px',
      mx: 0,

      display: 'inline',
      '&:hover': {
        // color: theme.colors.primary,
        textDecoration: 'none',
      },
    };

    return routes.map((route) => {
      return (
        <li key={route[1]}>
          <NavItem route={route[0]} text={route[1]} extraStyling={navStyle} />
        </li>
      );
    });
  };

  return (
    <div sx={mainWrapperStyle}>
      <div sx={headerWrapperStyle}>
        <h2 sx={headerTextStyle}>Navigation</h2>
      </div>

      <div className="row" sx={routeContainerStyle}>
        <div sx={routesStyle}>
          <ul sx={listStyle}>{getRouteItems(leftRoutes)}</ul>
        </div>
        <div sx={routesStyle}>
          <ul sx={listStyle}>{getRouteItems(rightRoutes)}</ul>
        </div>
      </div>
    </div>
  );
};
