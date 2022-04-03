import { Button, createStyles, makeStyles, Theme, Tooltip } from '@material-ui/core';
import { LayersClear } from '@material-ui/icons';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    btn: {
      backgroundColor: 'white',
      minWidth: '0',
      padding: '0',
      color: 'rgb(104,104,104)',
      borderRadius: '50%',
      position: 'absolute',
      top: '510px',
      margin: '3px',
      zIndex: 9999,
      [theme.breakpoints.down('sm')]: {
        left: '45px',
        top: '50px',
      },
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

interface ClearTableButtomProps {
  onClick: () => void;
}

const ClearTableButtom = ({ onClick }: ClearTableButtomProps) => {
  const classes = useStyles();
  return (
    <Tooltip title="CLEAN TABLE">
      <Button className={clsx(classes.btn)} onClick={onClick}>
        <LayersClear />
      </Button>
    </Tooltip>
  );
};

export default ClearTableButtom;
