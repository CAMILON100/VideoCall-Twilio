import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { Button } from '@material-ui/core';

import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    btn: {
      backgroundColor: theme.brand,
      minWidth: '0',
      padding: '0',
      borderRadius: '50%',
      margin: '5px',
      zIndex: 9999,
      '&:hover': {
        background: '#600101',
      },
      '& > .MuiButton-label': {
        width: '40px',
        height: '40px',
      },
    },
    icon: {
      width: '25px',
    },
    button: {
      background: theme.brand,
      color: 'white',
      '&:hover': {
        background: '#600101',
      },
    },
  })
);

export default function EndCallButtonIcon(props: { className?: string }) {
  const classes = useStyles();
  const { room } = useVideoContext();

  return (
    <Button onClick={() => room!.disconnect()} className={clsx(classes.btn, props.className)} data-cy-disconnect>
      <svg width="25" height="25" x="0" y="0" className={classes.icon} viewBox="0 0 6.3499999 6.3500002">
        <g>
          <g transform="translate(0 -290.65)">
            <path
              id="path52"
              d="m3.1721577 291.17917a.26463566.26580324 0 0 0 -.262025.26889v2.12674a.26486756.26603617 0 0 0 .5297351 0v-2.12674a.26463566.26580324 0 0 0 -.2677101-.26889zm1.5437259.53311a.26463566.26580324 0 0 0 -.025842.00052.26463566.26580324 0 0 0 -.1467753.46926c.4583643.39096.7483457.97287.7483479 1.62632.0000018 1.17989-.9432648 2.13089-2.1153231 2.13089-1.1720581 0-2.1173921-.951-2.1173901-2.13089.000002-.64967.2862991-1.22762.7400788-1.61853a.26467261.26584036 0 1 0 -.343681-.40438c-.5664588.48798-.92612958 1.21533-.92613207 2.02291-.00000238 1.46669 1.18858337 2.66244 2.64712517 2.66244 1.4585422 0 2.6445438-1.19575 2.6445414-2.66244-.0000027-.81229-.3632264-1.54263-.9354347-2.03069a.26463566.26580324 0 0 0 -.1695153-.0654z"
              font-variant-ligatures="normal"
              font-variant-position="normal"
              font-variant-caps="normal"
              font-variant-numeric="normal"
              font-variant-alternates="normal"
              font-feature-settings="normal"
              text-indent="0"
              text-align="start"
              text-decoration-line="none"
              text-decoration-style="solid"
              text-decoration-color="rgb(0,0,0)"
              text-transform="none"
              text-orientation="mixed"
              white-space="normal"
              shape-padding="0"
              mix-blend-mode="normal"
              solid-color="rgb(0,0,0)"
              solid-opacity="1"
              vector-effect="none"
              fill="#ffffff"
              data-original="#000000"
            ></path>
          </g>
        </g>
      </svg>
    </Button>
  );
}
