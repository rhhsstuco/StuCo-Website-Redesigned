/** @jsx jsx */
import React, {useState, useEffect, useRef} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';

import {theme} from '../../utils/theme';

interface Props {
  date: Date;
}

interface FormattedTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface ITimeUnit {
  number: number;
  text: string;
}

export const CountDownTimer: React.FC<Props> = ({date}) => {
  const [timer, setTimer] = useState<number>();
  const [formattedTime, setFormattedTime] = useState<FormattedTime>();
  const [timerWidth, setTimerWidth] = useState<number>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!timer) {
      setTimer(
        date.getTime() -
          new Date().getTime() +
          date.getTimezoneOffset() * 60 * 1000,
      );
      return;
    }
    setFormattedTime(getFormattedTime(timer));
    const id = window.setTimeout(() => {
      setTimer(timer - 1000);
    }, 1000);
    return () => window.clearTimeout(id);
  }, [timer, date]);

  useEffect(() => {
    if (!wrapperRef.current) return;
    setTimerWidth(wrapperRef.current.getBoundingClientRect().width);
  }, [wrapperRef.current]);

  const getFormattedTime = (timeInMilli: number) => {
    const days = Math.floor(timeInMilli / (24 * 60 * 60 * 1000));
    timeInMilli = timeInMilli % (24 * 60 * 60 * 1000);
    const hours = Math.floor(timeInMilli / (60 * 60 * 1000));
    timeInMilli = timeInMilli % (60 * 60 * 1000);
    const minutes = Math.floor(timeInMilli / (60 * 1000));
    timeInMilli = timeInMilli % (60 * 1000);
    const seconds = Math.floor(timeInMilli / 1000);

    return {
      days: days >= 0 ? days : 0,
      hours: hours >= 0 ? hours : 0,
      minutes: minutes >= 0 ? minutes : 0,
      seconds: seconds >= 0 ? seconds : 0,
    };
  };

  if (!formattedTime) {
    return <div />;
  }

  const style: SxStyleProp = {
    top: '40%',
    left: '7%',
    position: ['static', 'absolute'],
    borderColor: theme.colors.text.darkGray,
    borderWidth: [0, 2],
    borderStyle: 'solid',
    color: theme.colors.text.darkGray,
    textAlign: 'center',
    fontFamily: theme.fonts.heading,
    fontSize: 20,
    '&:hover': {
      textDecoration: 'none',
      color: theme.colors.text.darkGray,
    },
    px: 20,
    py: [1, 2],
    width: ['auto', 'auto', timerWidth],

    //mobile
    display: ['flex', 'inline'],
    flexDirection: 'column',
    flexWrap: 'wrap',
    order: 0,
    mt: ['20%', 0],
  };

  const TimeUnit: React.FC<ITimeUnit> = ({number, text}) => {
    const seconds = 'sec';
    const numDigit = number < 100 ? 2 : 3;
    const textSize = text === seconds ? 15 : 20;
    const numSize = text === seconds ? 50 : 80;
    return (
      <span sx={{mx: 20}}>
        <span sx={{fontSize: numSize}}>
          {number.toString().padStart(numDigit, '0')}
        </span>
        <span sx={{fontSize: textSize}}>{text}</span>
      </span>
    );
  };

  return (
    <div sx={style} ref={wrapperRef}>
      <TimeUnit number={formattedTime.days} text="days" />
      <TimeUnit number={formattedTime.hours} text="hrs" />
      <TimeUnit number={formattedTime.minutes} text="mins" />
      <TimeUnit number={formattedTime.seconds} text="sec" />
    </div>
  );
};

export default CountDownTimer;
