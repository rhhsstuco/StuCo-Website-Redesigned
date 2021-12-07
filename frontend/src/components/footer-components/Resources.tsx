/** @jsx jsx */
import React, {useContext} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';

import {theme} from '../../utils/theme';
import {IInfoContext, InfoContext} from '../../utils/contexts';
import {Resources as ResourcesInterface} from '../../utils/interfaces';

/** The props for the `Resources` component. */
export interface ResourcesProps {
  /** Extra css for the text in each resource. */
  textStyling: SxStyleProp;
}

/**
 * Constructs a `Resources` component For all the resources present
 * in the website.
 *
 * @returns a div containing all the resources, formatted.
 */
export const Resources: React.FC<ResourcesProps> = ({textStyling}) => {
  const allResources: ResourcesInterface[] = useContext<IInfoContext>(
    InfoContext,
  ).resources;

  // Styles ---------------------------------------------------------
  // TOOD: this is basically the same as FooterRoutes
  // -- do smth about this? or is this good repeat/abstraction?
  const mainWrapperStyle: SxStyleProp = {
    px: '5%',
  };
  const headerWrapperStyle: SxStyleProp = {
    width: '100%',
    textAlign: 'left',
    mb: '1.3em',
  };
  const headerTextStyle: SxStyleProp = {
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSizes.footerBig,
    color: theme.colors.text.light,
  };
  const resourceStyle: SxStyleProp = {
    ...textStyling,

    width: '50%',
    ml: 0,
    mr: 'auto',
    my: 0,
  };
  const resourceContainerStyle: SxStyleProp = {
    width: '100%',
    margin: 'auto',

    display: 'flex',
    flexDirection: ['column', 'row'],
  };
  const listStyle: SxStyleProp = {
    listStyleType: 'none',
    pl: 0,
    pr: '10%',
    ml: 0,
    my: 0,
  };

  // Functions -- ---------------------------------------------------
  /**
   * Retrieves all the resources and splits them, then formats them
   * and returns the formatted ReactElement.
   * @returns the formatted resource list.
   */
  const getAllResources = () => {
    // Split the routes in half to format links correctly
    const leftResources = allResources.slice(
      0,
      Math.ceil(allResources.length / 2),
    );
    const rightResources = allResources.slice(
      Math.ceil(allResources.length / 2),
    );

    return (
      <div className="row" sx={resourceContainerStyle}>
        <div sx={resourceStyle}>
          {/* first column of links goes here */}
          <ul sx={listStyle}>{getResourceColumn(leftResources)}</ul>
        </div>
        <div sx={resourceStyle}>
          {/* second column of links goes here */}
          <ul sx={listStyle}>{getResourceColumn(rightResources)}</ul>
        </div>
      </div>
    );
  };

  /**
   * Renders/returns a group of resources as a column.
   * @param resources - A column of resources to be rendered.
   * @returns the column of formatted resource elements.
   */
  const getResourceColumn = (resources: ResourcesInterface[]) => {
    const linkStyle: SxStyleProp = {
      px: 0,
      py: '2px',
      mx: 0,
      color: theme.colors.text.light,

      display: 'inline',
      '&:hover': {
        // color: theme.colors.primary,
        textDecoration: 'none',
      },
    };

    return resources.map((resource) => {
      return (
        <li key={resource.resourceName}>
          <a href={resource.resourceLink} sx={linkStyle}>
            {resource.resourceName}
          </a>
        </li>
      );
    });
  };

  return (
    <div sx={mainWrapperStyle}>
      {/* the header*/}
      <div sx={headerWrapperStyle}>
        <h2 sx={headerTextStyle}>Resources</h2>
      </div>
      {getAllResources()}
    </div>
  );
};
