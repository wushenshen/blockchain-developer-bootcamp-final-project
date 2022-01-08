import React from 'react';
import { Card } from 'rebass';
import theme from '../theme';

const Description = ({ text }) => {
  return (
    <Card
      width={1/2}
      Flex
      sx={{
        bg: theme.colors.primary,
        px: 4,
        py: 10,
        marginX: 'auto',
        marginY: 10,
        textAlign: 'center',
        justifyContent: 'center',
        fontStyle: 'italic',
      }}
    >
      {text}
    </Card>
  )
}

export default Description;