import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      background: theme.brand,
      color: 'white',
      '&:hover': {
        background: '#600101',
      },
    },
  })
);

const ClearTableButtom = () => {
  const classes = useStyles();

  return <Button className={clsx(classes.button)}></Button>;
};

export default ClearTableButtom;
