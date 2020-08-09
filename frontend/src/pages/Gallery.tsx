/** @jsx jsx */
import React from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {Heading} from '../components/Heading';
import {theme} from '../utils/theme';

export interface GalleryProps {}

export const Gallery: React.FC<GalleryProps> = () => {
  //todo: DRY --  this is from FAQ, and im kinda ehhh about that??
  // The custom styles needed for this page
  const wrapperStyle: SxStyleProp = {
    // the main page div
    width: '100%',
    minHeight: '100vh',
    backgroundColor: theme.colors.background.light,
    // border: '5px solid', //todo
    // borderColor: 'green',
  };
  const innerWrapperStyle: SxStyleProp = {
    // the div that contains everything
    top: '20vh',
    position: 'relative',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    // border: '5px solid', //todo
    // borderColor: 'red',
  };
  const headingWrapperStyle: SxStyleProp = {
    // the header div
    left: '5%',
    maxWidth: '90%', // to make sure the page doesn't scroll to the right
    position: 'relative',
    // border: '5px solid', //todo
    // borderColor: 'pink',
  };

  return (
    <div sx={wrapperStyle}>
      <div sx={innerWrapperStyle}>
        <div sx={headingWrapperStyle}>
          <Heading text="Gallery" alignment="left" />
        </div>
      </div>
    </div>
  );
};
