import React from 'react';
import { Box, Button } from 'rebass';
import theme from '../theme';

import Loading from './Loading';

const PaymentForm = ({ amount, loading, onSubmit, onChange }) => {
  return (
    <Box
      width={1/2}
      sx={{
        bg: theme.colors.lightblue,
        px: 4,
        py: 10,
        marginX: 'auto',
        marginY: 10,
        textAlign: 'center',
        justifyContent: 'center',
      }}
    >
      <h3>Make a Payment</h3>
      <form>
        <label>Amount (in ETH): 
          <input type="number" value={amount} onChange={onChange} />
        </label>
        {loading ? <Loading /> : (<Button
          onClick={onSubmit}
          sx={{
            bg: theme.colors.secondary,
            px: 4,
            py: 10,
            marginX: 'auto',
            marginY: 10,
            textAlign: 'center',
            justifyContent: 'center',
            fontFamily: 'Lekton',
          }}
        >
          Send
        </Button>)}
        
      </form>
    </Box>
  )
}

export default PaymentForm;