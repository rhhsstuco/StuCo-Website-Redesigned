/** @jsx jsx */
import React from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {FaGithub} from 'react-icons/fa';

import {theme} from '../../utils/theme';

/** The props for a `CopyrightItem`. */
export interface CopyrightItemProps {
  /** Extra css for the text. */
  textStyle: SxStyleProp;
}

/**
 * Constructs a `CopyrightItem`, a section of text to deal with the
 * copyright sign, date, and info, as well a link to this repo.
 *
 * @param props the props for this component.
 * @returns     a `CopyrightItem` component.
 */
export const CopyrightItem: React.FC<CopyrightItemProps> = ({textStyle}) => {
  const linkStyle: SxStyleProp = {
    color: theme.colors.text.light,
    mb: '0.25em',

    '&:hover': {
      // color: theme.colors.primary,
      textDecoration: 'none',
    },
  };

  const copyrightTextStyle: SxStyleProp = {
    ...textStyle,
    my: 'auto',
    // Add space above copyright if rearranged
    mt: ['1em', 0],
  };
  const imageStyle: SxStyleProp = {mr: '0.5em', mb: '0.25em'};

  return (
    <p sx={copyrightTextStyle}>
      &copy; RHHS Student Council {new Date().getFullYear()}
      &nbsp; |&nbsp;
      <a
        href="https://github.com/shari09/StuCo-Website-Redesigned"
        sx={linkStyle}
      >
        <FaGithub sx={imageStyle} size={20} />
        Source
      </a>
    </p>
  );
};
