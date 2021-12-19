import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AvatarIcon from '../../icons/AvatarIcon';

import Button from '@material-ui/core/Button';
import EndCallButtonIcon from '../Buttons/EndCallButton/EndCallButtonIcon';
import { isMobile } from '../../utils';
import Menu from './Menu/Menu';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { Typography, Grid, Hidden } from '@material-ui/core';
import ToggleAudioButtonIcon from '../Buttons/ToggleAudioButton/ToggleAudioButtonIcon';
import ToggleChatButtonIcon from '../Buttons/ToggleChatButton/ToggleChatButtonIcon';
import ToggleVideoButtonIcon from '../Buttons/ToggleVideoButton/ToggleVideoButtonIcon';
import ToggleParticipantsButtonIcon from '../Buttons/ToggleParticipantsButton/ToggleParticipantsButtonIcon';
import ToggleScreenShareButton from '../Buttons/ToogleScreenShareButton/ToggleScreenShareButton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: 'transparent',
      bottom: 0,
      left: 0,
      right: 0,
      height: `${theme.footerHeight}px`,
      position: 'fixed',
      display: 'flex',
      padding: '0 1.43em',
      zIndex: 10,
      [theme.breakpoints.down('sm')]: {
        height: `${theme.mobileFooterHeight}px`,
        padding: 0,
      },
    },
    border: {
      background: 'transparent',
      width: '200px',
      position: 'absolute',
      height: '160px',
      border: 'solid 1px white',
      borderRadius: '50%',
      bottom: '-110px',
    },
    screenShareBanner: {
      position: 'fixed',
      zIndex: 8,
      bottom: `${theme.footerHeight}px`,
      left: 0,
      right: 0,
      height: '104px',
      background: 'rgba(0, 0, 0, 0.5)',
      '& h6': {
        color: 'white',
      },
      '& button': {
        background: 'white',
        color: theme.brand,
        border: `2px solid ${theme.brand}`,
        margin: '0 2em',
        '&:hover': {
          color: '#600101',
          border: `2px solid #600101`,
          background: '#FFE9E7',
        },
      },
    },
    hideMobile: {
      display: 'initial',
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
  })
);

export default function MenuBar() {
  const classes = useStyles();
  const { isSharingScreen, toggleScreenShare } = useVideoContext();
  const roomState = useRoomState();
  const isReconnecting = roomState === 'reconnecting';
  const { room } = useVideoContext();

  return (
    <>
      {isSharingScreen && (
        <Grid container justifyContent="center" alignItems="center" className={classes.screenShareBanner}>
          <Typography variant="h6">You are sharing your screen</Typography>
          <Button onClick={() => toggleScreenShare()}>Stop Sharing</Button>
        </Grid>
      )}
      <footer className={classes.container}>
        <Grid container justifyContent="center" alignItems="center">
          <ToggleAudioButtonIcon disabled={isReconnecting} />
          <ToggleVideoButtonIcon disabled={isReconnecting} />
          {process.env.REACT_APP_DISABLE_TWILIO_CONVERSATIONS !== 'true' && <ToggleChatButtonIcon />}
          <ToggleParticipantsButtonIcon />
          <EndCallButtonIcon />
          <div className={classes.border}></div>
          {/* <Hidden smDown>
            <Grid style={{ flex: 1 }}>
              <Typography variant="body1">{room!.name}</Typography>
            </Grid>
          </Hidden>
          <Grid item>
            <Grid container justifyContent="center">
              <ToggleAudioButtonIcon disabled={isReconnecting} />
              <ToggleVideoButtonIcon disabled={isReconnecting} />
              {!isSharingScreen && !isMobile && <ToggleScreenShareButton disabled={isReconnecting} />}
              {process.env.REACT_APP_DISABLE_TWILIO_CONVERSATIONS !== 'true' && <ToggleChatButtonIcon />}
              <Hidden smDown>
                <Menu />
              </Hidden>
            </Grid>
          </Grid>
          <Hidden smDown>
            <Grid style={{ flex: 1 }}>
              <Grid container justifyContent="flex-end">
                <EndCallButtonIcon />
              </Grid>
            </Grid>
          </Hidden> */}
        </Grid>
      </footer>
    </>
  );
}
