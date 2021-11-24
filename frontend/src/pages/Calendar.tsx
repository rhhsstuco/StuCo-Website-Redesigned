/** @jsx jsx */
import React, {useState, useContext, useEffect} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
// while it's under construction
import {FaWrench} from 'react-icons/fa';

import {spin} from '../utils/animation';
import {theme} from '../utils/theme';
import { ISetTransparentCtx, SetTransparentCtx } from '../utils/contexts';
import { useToggleNavColour } from '../utils/hooks';

// import { Calendar } from '@fullcalendar/core';
// import googleCalendarPlugin from '@fullcalendar/google-calendar';

export interface CalendarProps {}

export const CCalendar: React.FC<CalendarProps> = () => {
  const [spinAmount, setSpinAmount] = useState(1);
  
  const {setTransparent} = useContext<ISetTransparentCtx>(SetTransparentCtx);
  const toggleNavUnsub = useToggleNavColour(window.innerHeight/5);

  useEffect(() => {
    setTransparent(true);
    return toggleNavUnsub;
  }, [setTransparent, toggleNavUnsub]);
  // Styles for the page
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
    pb: '14em',

    textAlign: 'center',
  };
  const iframeContainerStyle: SxStyleProp = {
    width: '100%',
    textAlign: 'center',
  };

  const handleClick = () => {
    if (spinAmount < 9) {
      setSpinAmount(spinAmount + 1);
    }
  };


  const renderSpannerImage = () => {
    return (
      <FaWrench
        size={50}
        sx={{
          position: 'relative',
          maxWidth: [25, 50],
          mb: '2%',
          color: theme.colors.text.light,
          '@keyframes spin': spin,

          animation:
            spinAmount === 0
              ? 'none'
              : 'spin ' +
                (2.2 - 0.2 * spinAmount).toString() +
                's linear infinite',
        }}
        onClick={handleClick}
      />
    );
  };

  return (
    <div sx={wrapperStyle}>
      <div sx={innerWrapperStyle}>
        <div sx={iframeContainerStyle}>
          <iframe
            title="RHHS School Calendar"
            src="https://calendar.google.com/calendar/embed?height=600&wkst=1&bgcolor=%23FFFFFF&src=gapps.yrdsb.ca_3kml71rdv1af34phpclvo9ps50%40group.calendar.google.com&color=%23333333&ctz=America%2FToronto"
            width="80%"
            height="600px"
          ></iframe>
          {/* <div
            sx={{
              mt: '5%',
              mx: 'auto',
              width: '90%',
            }}
          >
            {renderSpannerImage()}
          </div>
          <p
            sx={{
              fontFamily: theme.fonts.body,
              fontSize: theme.fontSizes.body,
              color: theme.colors.text.light,
            }}
          >
            A more lively calendar is under development! For now, though, enjoy
            this embedded one!
          </p> */}
        </div>
      </div>
    </div>
  );
};
