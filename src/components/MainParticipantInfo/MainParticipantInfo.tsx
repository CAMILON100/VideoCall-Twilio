import React from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { LocalAudioTrack, LocalVideoTrack, Participant, RemoteAudioTrack, RemoteVideoTrack } from 'twilio-video';

import AudioLevelIndicator from '../AudioLevelIndicator/AudioLevelIndicator';
import AvatarIcon from '../../icons/AvatarIcon';
import NetworkQualityLevel from '../NetworkQualityLevel/NetworkQualityLevel';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import useIsRecording from '../../hooks/useIsRecording/useIsRecording';
import useIsTrackSwitchedOff from '../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff';
import useParticipantIsReconnecting from '../../hooks/useParticipantIsReconnecting/useParticipantIsReconnecting';
import usePublications from '../../hooks/usePublications/usePublications';
import useScreenShareParticipant from '../../hooks/useScreenShareParticipant/useScreenShareParticipant';
import useTrack from '../../hooks/useTrack/useTrack';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

import Painterro from 'painterro';
import $ from 'jquery';
import './MainParticipantInfo.css';
import { io } from 'socket.io-client';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  identity: {
    background: 'rgba(0, 0, 0, 0.5)',
    color: 'red',
    padding: '0.1em 0.3em 0.1em 0',
    display: 'inline-flex',
    '& svg': {
      marginLeft: '0.3em',
    },
    marginRight: '0.4em',
    alignItems: 'center',
  },
  infoContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  reconnectingContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(40, 42, 43, 0.75)',
    zIndex: 1,
  },
  fullWidth: {
    gridArea: '1 / 1 / 2 / 3',
    [theme.breakpoints.down('sm')]: {
      gridArea: '1 / 1 / 3 / 3',
    },
  },
  avatarContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'black',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
    '& svg': {
      transform: 'scale(2)',
    },
  },
  recordingIndicator: {
    position: 'absolute',
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: '0.1em 0.3em 0.1em 0',
    fontSize: '1.2rem',
    height: '28px',
    [theme.breakpoints.down('sm')]: {
      bottom: 'auto',
      right: 0,
      top: 0,
    },
  },
  circle: {
    height: '12px',
    width: '12px',
    background: 'red',
    borderRadius: '100%',
    margin: '0 0.6em',
    animation: `1.25s $pulsate ease-out infinite`,
  },
  '@keyframes pulsate': {
    '0%': {
      background: `#A90000`,
    },
    '50%': {
      background: '#f00',
    },
    '100%': {
      background: '#A90000',
    },
  },
}));

interface MainParticipantInfoProps {
  participant: Participant;
  children: React.ReactNode;
}

export default function MainParticipantInfo({ participant, children }: MainParticipantInfoProps) {
  const classes = useStyles();
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;
  const isLocal = localParticipant === participant;

  const screenShareParticipant = useScreenShareParticipant();
  const isRemoteParticipantScreenSharing = screenShareParticipant && screenShareParticipant !== localParticipant;

  const publications = usePublications(participant);
  const videoPublication = publications.find(p => !p.trackName.includes('screen') && p.kind === 'video');
  const screenSharePublication = publications.find(p => p.trackName.includes('screen'));

  const videoTrack = useTrack(screenSharePublication || videoPublication);
  const isVideoEnabled = Boolean(videoTrack);

  const audioPublication = publications.find(p => p.kind === 'audio');
  const audioTrack = useTrack(audioPublication) as LocalAudioTrack | RemoteAudioTrack | undefined;

  const isVideoSwitchedOff = useIsTrackSwitchedOff(videoTrack as LocalVideoTrack | RemoteVideoTrack);
  const isParticipantReconnecting = useParticipantIsReconnecting(participant);

  const isRecording = useIsRecording();

  const queryParams = new URLSearchParams(window.location.search);
  const entrenador = queryParams.get('entrenador');
  globalThis.contador = 0;
  globalThis.auxDataCanvas = null;

  if (typeof globalThis.socket == 'undefined') {
    globalThis.socket = io('https://fitafter50.tk:8000');
    globalThis.socket.on('connect', () => {
      //console.log('conectó!');
    });
  }

  if (entrenador === 'true') {
    if ($('.ptro-holder-wrapper').length === 0) {
      globalThis.canvas = Painterro({
        backgroundFillColor: '#ffffff',
        backgroundFillColorAlpha: 0.0,
        defaultArrowLength: 8,
        defaultLineWidth: 5,
        defaultEraserWidth: 40,
        defaultPrimitiveShadowOn: false,
        hiddenTools: ['crop', 'text', 'rotate', 'resize', 'save', 'open', 'zoomin', 'zoomout'],
        toolbarPosition: 'top',
        backplateImgUrl: '',
      });

      const canvasId = (globalThis.canvas as any).id;
      $('#' + canvasId)[0].width = globalThis.canvasWidth;
      $('#' + canvasId)[0].height = globalThis.canvasHeight;
      $('#' + canvasId).css('width', globalThis.canvasWidth);
      $('#' + canvasId).css('height', globalThis.canvasHeight);
      $('#' + canvasId).click(() => {
        const canvasData = (globalThis.canvas as any).canvas.toDataURL();
        globalThis.socket.emit('drawing', {
          room: room!.sid,
          data: canvasData,
          requestSize: false,
          participantId: null,
          pizarraWidth: null,
          pizarraHeight: null,
        });
        return false;
      });
    }
  } else {
    $('#pizarra').css('z-index', '1');
  }

  if (globalThis.contador == 0) {
    globalThis.socket.on('drawing', function(msg: any) {
      if (msg.room == room!.sid) {
        if (entrenador === 'true') {
          const canvas2 = (globalThis.canvas as any).canvas;
          if (
            msg.pizarraWidth &&
            msg.pizarraHeight &&
            (canvas2.width != msg.pizarraWidth || canvas2.height != msg.pizarraHeight)
          ) {
            let left: any = ($('.ptro-center-tablecell').width() - msg.pizarraWidth) / 2;
            canvas2.height = msg.pizarraHeight;
            canvas2.width = msg.pizarraWidth;
            $('.ptro-holder-wrapper canvas').css({
              position: 'absolute',
              margin: 'auto',
              top: '0',
              left: left + 'px',
            });
            $('.ptro-crp-el').css({
              position: 'absolute',
              height: msg.pizarraHeight + 'px',
              width: msg.pizarraWidth + 'px',
              margin: 'auto',
              top: '0',
              left: left + 'px',
            });
            $('#div-main-participant').css({
              position: 'absolute',
              height: msg.pizarraHeight + 'px',
              width: msg.pizarraWidth + 'px',
              margin: 'auto',
              top: '0',
              left: left + 'px',
            });
            $('.ptro-info')
              .empty()
              .html(msg.pizarraWidth + '<span>x</span>' + msg.pizarraHeight + '<br>png');
          } else {
            return false;
          }
        } else {
          if (msg.requestSize === true && localParticipant!.sid == msg.participantId) {
            let pizarraWidth: any = $('#pizarra')[0].width;
            let pizarraHeight: any = $('#pizarra')[0].height;
            globalThis.socket.emit('drawing', {
              room: room!.sid,
              data: null,
              requestSize: false,
              participantId: null,
              pizarraWidth: pizarraWidth,
              pizarraHeight: pizarraHeight,
            });
          } else {
            if (msg.data && globalThis.auxDataCanvas != msg.data) {
              globalThis.auxDataCanvas = msg.data;
              $('#pizarra')[0].getContext('2d');
              const img = new Image();
              img.src = msg.data;
              img.onload = function() {
                $('#pizarra')[0].width = globalThis.canvasWidth;
                $('#pizarra')[0].height = globalThis.canvasHeight;
                $('#pizarra')[0]
                  .getContext('2d')
                  .drawImage(
                    img,
                    0,
                    0,
                    globalThis.canvasWidth,
                    globalThis.canvasHeight,
                    0,
                    0,
                    globalThis.canvasWidth,
                    globalThis.canvasHeight
                  );
              };
            }
          }
        }
      }
    });
    globalThis.contador++;
  }

  return (
    <div
      data-cy-main-participant
      data-cy-participant={participant.identity}
      id="div-main-participant"
      className={clsx(classes.container, {
        [classes.fullWidth]: !isRemoteParticipantScreenSharing,
      })}
      ref={element => {
        if (!element) return;

        if (entrenador === 'true') {
          if (typeof globalThis.canvasWidth === 'undefined' || typeof globalThis.canvasHeight === 'undefined') {
            const canvas2 = (globalThis.canvas as any).show();
            globalThis.canvasWidth = element.getBoundingClientRect().width;
            globalThis.canvasHeight = element.getBoundingClientRect().height;
          } else {
            if (
              element.getBoundingClientRect().width !== globalThis.canvasWidth ||
              element.getBoundingClientRect().height !== globalThis.canvasHeight
            ) {
              const canvas2 = (globalThis.canvas as any).show();
              canvas2.width = element.getBoundingClientRect().width;
              canvas2.height = element.getBoundingClientRect().height;
              globalThis.canvasWidth = element.getBoundingClientRect().width;
              globalThis.canvasHeight = element.getBoundingClientRect().height;
            }
          }
        } else {
          globalThis.canvasWidth = element.getBoundingClientRect().width;
          globalThis.canvasHeight = element.getBoundingClientRect().height;
          if (globalThis.canvasWidth != $('#pizarra')[0].width || globalThis.canvasHeight != $('#pizarra')[0].height) {
            $('#pizarra')[0].width = globalThis.canvasWidth;
            $('#pizarra')[0].height = globalThis.canvasHeight;
          }
        }
      }}
    >
      <canvas id="pizarra" style={{ position: 'fixed', transform: 'scaleX(-1)' }}></canvas>
      <div className={classes.infoContainer}>
        <div style={{ display: 'flex' }}>
          <div className={classes.identity}>
            <AudioLevelIndicator audioTrack={audioTrack} />
            <Typography variant="body1" color="inherit">
              {participant.identity}
              {isLocal && ' (You)'}
              {screenSharePublication && ' - Screen'}
            </Typography>
          </div>
          <NetworkQualityLevel participant={participant} />
        </div>
        {isRecording && (
          <Tooltip
            title="All participants' audio and video is currently being recorded. Visit the app settings to stop recording."
            placement="top"
          >
            <div className={classes.recordingIndicator}>
              <div className={classes.circle}></div>
              <Typography variant="body1" color="inherit" data-cy-recording-indicator>
                Recording
              </Typography>
            </div>
          </Tooltip>
        )}
      </div>
      {(!isVideoEnabled || isVideoSwitchedOff) && (
        <div className={classes.avatarContainer}>
          <AvatarIcon />
        </div>
      )}
      {isParticipantReconnecting && (
        <div className={classes.reconnectingContainer}>
          <Typography variant="body1" style={{ color: 'white' }}>
            Reconnecting...
          </Typography>
        </div>
      )}
      {children}
    </div>
  );
}
