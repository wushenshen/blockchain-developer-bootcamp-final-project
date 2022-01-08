import React from 'react';
import { Box } from 'rebass';
import theme from '../theme';


const Balances = ({ contractBalance, totalReleased }) => {
  return (
    <Box
      width={1/2}
      sx={{
        bg: theme.colors.lightyellow,
        px: 4,
        py: 10,
        marginX: 'auto',
        marginY: 10,
        textAlign: 'center',
        justifyContent: 'center',
      }}
    >
      {contractBalance && <div>Current balance: {contractBalance} ETH</div>}
      {totalReleased && <div>Total released: {totalReleased} ETH</div>}
      {totalReleased && <div>Total contributed: {parseFloat(contractBalance) + parseFloat(totalReleased)} ETH</div>}
    </Box>
  )
}

export default Balances;