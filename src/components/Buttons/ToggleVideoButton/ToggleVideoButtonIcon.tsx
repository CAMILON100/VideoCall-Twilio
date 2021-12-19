import React, { useCallback, useRef } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import VideoOffIcon from '../../../icons/VideoOffIcon';
import VideoOnIcon from '../../../icons/VideoOnIcon';

import useDevices from '../../../hooks/useDevices/useDevices';
import useLocalVideoToggle from '../../../hooks/useLocalVideoToggle/useLocalVideoToggle';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    btn: {
      backgroundColor: 'white',
      minWidth: '0',
      padding: '0',
      borderRadius: '50%',
      margin: '5px',
      bottom: '35px',
      zIndex: 9999,
      '&:hover': {
        background: 'white',
      },
      '& > .MuiButton-label': {
        width: '40px',
        height: '40px',
      },
      '& span.MuiButton-startIcon': {
        margin: '0',
        width: '30px',
        height: '30px',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
  })
);

export default function ToggleVideoButton(props: { disabled?: boolean; className?: string }) {
  const [isVideoEnabled, toggleVideoEnabled] = useLocalVideoToggle();
  const lastClickTimeRef = useRef(0);
  const { hasVideoInputDevices } = useDevices();
  const classes = useStyles();

  const toggleVideo = useCallback(() => {
    if (Date.now() - lastClickTimeRef.current > 500) {
      lastClickTimeRef.current = Date.now();
      toggleVideoEnabled();
    }
  }, [toggleVideoEnabled]);

  return (
    <Button
      className={classes.btn}
      onClick={toggleVideo}
      disabled={!hasVideoInputDevices || props.disabled}
      startIcon={isVideoEnabled ? <VideoOnIcon /> : <VideoOffIcon />}
    ></Button>
  );
}
