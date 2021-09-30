/** @jsx jsx */
import React, {
  useContext,
  useRef,
  useEffect,
  useState,
  ReactElement,
  useMemo,
} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';

import {Heading} from '../components/Heading';
import PhotoViewer, {Photo} from '../components/gallery-viewer/PhotoViewer';
import {CircleLoader} from '../components/loading-components/CircleLoader';

import {theme} from '../utils/theme';
import {
  IInfoContext,
  InfoContext,
  ISetTransparentCtx,
  SetTransparentCtx,
} from '../utils/contexts';
import {getImageUrl, disallowScrolling} from '../utils/functions';
// todo: minor, but make naming consistant i guess
import {Photo as PhotoInfo} from '../utils/interfaces';
import ResizeObserver from 'resize-observer-polyfill';


//the max width will be < 700 cuz this tries to fit as many images as possible
//while still maintaining a min width of whatever imgMinWidth is
const imgMinWidth = 350; 
//scaled in relation to width
const portraitHeightScale = 1.5;
const landscapeHeightScale = 0.65;


export interface GalleryPhotoProps {
  photo: Photo;
  initializeDisplay: (index: number) => void;
  extraPhotoStyle?: SxStyleProp;
}

//=====================================================================
/**
 * GalleryPhoto element handles the actual img element.
 * 
 * This assumes that each img will be placed in an appropriately sized
 * div or element.
 */
export const GalleryPhoto: React.FC<GalleryPhotoProps> = ({
  photo,
  initializeDisplay,
  extraPhotoStyle,
}): ReactElement => {
  const [loading, setLoading] = useState<boolean>(true);

  const photoStyle: SxStyleProp = {
    width: '100%',
    height: '100%',
    margin: 0,
    objectFit: 'cover',

    display: loading ? 'none' : 'block',

    '&:hover': {
      cursor: 'pointer',
    },
  };

  /**
   * Displays the photo viewer.
   * 
   * Locking of the screen and scroll will be done on
   * mount in PhotoViewer.
   */
  const displayViewer = () => {
    initializeDisplay(photo.photoNum);
  };

  const getSpinner = (): JSX.Element => {
    return (
      <div sx={{display: 'inline-block', my: '50%'}}>
        <CircleLoader />
      </div>
    );
  };

  return (
    <React.Fragment>
      {loading ? getSpinner() : undefined}
      <img
        src={photo.photoUrl}
        alt=""
        onClick={displayViewer}
        onLoad={() => setLoading(false)}
        sx={{...photoStyle, ...extraPhotoStyle}}
      />
    </React.Fragment>
  );
};

//==============================================================================
export const Gallery: React.FC = (): ReactElement => {
  const galleryPhotos: PhotoInfo[] = useContext<IInfoContext>(InfoContext)
    .gallery;

  const [viewIndex, setViewIndex] = useState<number>(0);
  const [showViewer, setShowViewer] = useState<boolean>(false);
  const [numColumns, setNumColumns] = useState<number>(
    Math.floor(window.innerWidth / imgMinWidth),
  );
  //the image width as it changes based on window resize
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const [imageWidth, setImageWidth] = useState<number>(imgMinWidth);

  //navbar transparency
  const {setTransparent} = useContext<ISetTransparentCtx>(SetTransparentCtx);
  useEffect(() => setTransparent(false), []);

  //calculate the number of columns that can be displayed based on
  //the window width
  useEffect(() => {
    const calculateNumCols = () => {
      if (Math.floor(window.innerWidth / imgMinWidth) === numColumns) return;
      setNumColumns(Math.floor(window.innerWidth / imgMinWidth));
    };
    window.addEventListener('resize', calculateNumCols);
    return () => window.removeEventListener('resize', calculateNumCols);
  }, [window.innerWidth]);

  //to handle the image resizing as the window resizes
  useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      const {width} = entries[0].contentRect;
      setImageWidth(width);
    });
    ro.observe(imageWrapperRef.current);
    return () => ro.disconnect();
  }, []);

  //the number of columns are controlled via the flex box max-height property
  //they are forced to wrap around once the max height is reached
  const galleryHeight = useMemo(() => {
    //buffer out in case one image doesn't fit after dividing
    const heightBuffer = imageWidth * portraitHeightScale;
    const totalHeight = galleryPhotos.reduce((acc, cur) => {
      const height =
        cur.orientation === 'portrait'
          ? imageWidth * portraitHeightScale
          : imageWidth * landscapeHeightScale;
      return height + acc;
    }, 0);
    return Math.ceil(totalHeight / numColumns) + heightBuffer;
  }, [numColumns, imageWidth]);

  //get all the photo preview displays
  const getGalleryPhotos = () => {
    return galleryPhotos.map((photo, curIdx) => {
      const photoData: Photo = {
        photoUrl: getImageUrl(photo.photoId, imgMinWidth * 2, 1000),
        photoNum: curIdx,
      };

      const photoContainerStyle: SxStyleProp = {
        margin: '2px',
        width: Math.floor(100 / numColumns).toString() + '%', //width based on window width
        //height based on width
        height:
          photo.orientation === 'portrait'
            ? imageWidth * portraitHeightScale
            : imageWidth * landscapeHeightScale,
        transition: '.2s',
        '&:hover': {
          opacity: 0.6,
          cursor: 'pointer',
        },
      };

      return (
        <div
          sx={photoContainerStyle}
          key={photoData.photoNum}
          ref={imageWrapperRef}
        >
          <GalleryPhoto
            photo={photoData}
            initializeDisplay={initializeDisplay}
          />
        </div>
      );
    });
  };

  // Functions regarding the displaying of the photo viewer --
  /**
   * Initializes the photo viewer.
   * @param startIndex - the photo index which the viewer should begin at.
   */
  const initializeDisplay = (startIndex: number) => {
    setViewIndex(startIndex);
    setShowViewer(true);
  };

  /**
   * Actually displays the photo viewer, if it should be shown.
   * @returns the photo viewer at the right image
   */
  const getViewer = (): ReactElement | void => {
    return (
      <PhotoViewer
        photos={galleryPhotos}
        startIndex={viewIndex}
        closeHandler={() => setShowViewer(false)}
      />
    );
  };

  //-----------------------------------------------------
  // Styles

  const wrapperStyle: SxStyleProp = {
    width: '100%',
    maxWidth: '100%',
    minHeight: '100vh',
    backgroundColor: theme.colors.beige,
  };

  const innerWrapperStyle: SxStyleProp = {
    top: '20vh',
    width: '100%',
    maxWidth: '100%',
    px: '5%',
    mb: '14em', // pushing away the footer
    display: 'flex',
    flexDirection: 'column',
  };

  const headingWrapperStyle: SxStyleProp = {
    mt: '13vh',
    maxWidth: '90%', // to make sure the page doesn't scroll to the right
    mb: '8em',
  };

  const photoColumnContainerStyle: SxStyleProp = {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    alignItems: 'center',
    alignContent: 'center',
    flexWrap: 'wrap',
    maxHeight: galleryHeight,
    overflow: 'hidden', //just in case something goes wrong
  };

  return (
    <div sx={wrapperStyle}>
      {showViewer ? getViewer() : undefined}
      <div sx={innerWrapperStyle}>
        <div sx={headingWrapperStyle}>
          <Heading text="Gallery" alignment="left" />
        </div>
        <div className="row" sx={photoColumnContainerStyle}>
          {/* Reverse the gallery because I THINK the photos are sorted
          from oldest to newest, and we want the newest at the top */}
          {getGalleryPhotos().reverse()}
        </div>
      </div>
    </div>
  );
};
