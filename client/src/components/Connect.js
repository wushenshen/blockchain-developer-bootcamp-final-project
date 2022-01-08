import React from 'react';
import { Button } from 'rebass';
import theme from '../theme';

const Connect = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      sx={{
        bg: theme.colors.lightblue,
        color: theme.colors.secondary,
        p: '10px',
        position: 'fixed',
        top: '10px',
        right: '10px',
        borderColor: theme.colors.secondary,
        borderStyle: 'solid',
        borderWidth: '1px',
        borderRadius: '5px',
        fontFamily: 'Lekton',
      }}
    >
      Connect
    </Button>
  )
};

export default Connect;