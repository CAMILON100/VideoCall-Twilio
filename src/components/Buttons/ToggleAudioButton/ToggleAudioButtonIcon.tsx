import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import MicIcon from '../../../icons/MicIcon';
import MicOffIcon from '../../../icons/MicOffIcon';

import useLocalAudioToggle from '../../../hooks/useLocalAudioToggle/useLocalAudioToggle';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    btn: {
      backgroundColor: 'white',
      minWidth: '0',
      padding: '0',
      borderRadius: '50%',
      margin: '5px',
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

export default function ToggleAudioButtonIcon(props: { disabled?: boolean; className?: string }) {
  const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();
  const { localTracks } = useVideoContext();
  const hasAudioTrack = localTracks.some(track => track.kind === 'audio');
  const classes = useStyles();

  return (
    <Button
      className={classes.btn}
      onClick={toggleAudioEnabled}
      disabled={!hasAudioTrack || props.disabled}
      startIcon={isAudioEnabled ? <MicIcon /> : <MicOffIcon />}
      data-cy-audio-toggle
    ></Button>
  );
}
