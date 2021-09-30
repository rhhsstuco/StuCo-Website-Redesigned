/** @jsx jsx */
import {useContext, useEffect} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';

import {Heading} from '../components/Heading';
import {ScrollToTopButton} from '../components/ScrollToTopButton';
import {VideoItem} from '../components/media-components/VideoItem';

import {
  IInfoContext,
  InfoContext,
  ISetTransparentCtx,
  SetTransparentCtx,
} from '../utils/contexts';
import {theme} from '../utils/theme';
import {Media as MediaInterface} from '../utils/interfaces';

//=====================================================================

export const Media = ({}) => {
  const allMedia: MediaInterface[] = useContext<IInfoContext>(InfoContext)
    .media;

  const {setTransparent} = useContext<ISetTransparentCtx>(SetTransparentCtx);
  useEffect(() => setTransparent(false), []);

  const wrapperStyle: SxStyleProp = {
    // the main page div

    width: '100%',
    minHeight: '100vh',
    backgroundColor: theme.colors.beige,
  };
  const innerWrapperStyle: SxStyleProp = {
    // the div that contains everything
    top: '20vh',
    position: 'relative',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    mb: '6em', // push away footer
  };
  const headerWrapperStyle: SxStyleProp = {
    // the header div

    left: '5%',
    mb: '4em',
    maxWidth: '90%', // to make sure the page doesn't scroll to the right

    position: 'relative',
    display: 'flex',
    flexDirection: ['column', 'row'],
  };
  const headingStyle: SxStyleProp = {
    width: ['100%', '50%'],
    mb: ['1em', 0],
  };

  /**
   * Retrieves all the video links in the supplied context
   * and creates a list of `VideoItem`s with title and
   * description for each of them.
   */
  const getAllVideoItems = () => {
    const videoDivStyle: SxStyleProp = {
      width: ['95%', '80%', '60%'],
      mx: 'auto',
    };
    const titleStyle: SxStyleProp = {
      textAlign: 'center',
      py: '0.5em',

      fontFamily: theme.fonts.heading,
      fontSize: theme.fontSizes.heading.primary,
      color: theme.colors.text.darkSlate,
    };
    const descriptionDivStyle: SxStyleProp = {
      width: '90%',
      mx: 'auto',
      py: '0.5em',
      textAlign: 'center',

      fontFamily: theme.fonts.body,
      fontSize: theme.fontSizes.body,
      color: theme.colors.navbar,
    };

    return allMedia.map((mediaItem) => {
      console.log(mediaItem.mediaLink);
      return (
        <div key={mediaItem.title} sx={{mb: ['6em', '8em']}}>
          <h2 sx={titleStyle}>{mediaItem.title}</h2>

          <div sx={videoDivStyle}>
            <VideoItem src={mediaItem.mediaLink} />
          </div>

          <div sx={descriptionDivStyle}>
            <p> {mediaItem.description} </p>
          </div>
        </div>
      );
    });
  };

  return (
    <div sx={wrapperStyle}>
      <ScrollToTopButton />

      <div sx={innerWrapperStyle}>
        <div sx={headerWrapperStyle}>
          <div sx={headingStyle}>
            <Heading
              text="Media"
              alignment="left"
              extraStyling={{width: ['100%', '200%']}}
            />
          </div>
        </div>
        {/* Reverse the videos to get the most recent at the top */}
        {getAllVideoItems().reverse()}
      </div>
    </div>
  );
};
