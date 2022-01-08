import React from 'react';
import { Box, Button } from 'rebass';
import theme from '../theme';

import Loading from './Loading';

const UserOptions = ({ amountReleased, contractBalance, contribution, loading, shares, releaseFunds, totalReleased }) => {
  const isPayee = shares && shares > 0;
  const isContributor = contribution && contribution > 0;
  const width = isPayee && isContributor ? 1 : 1/2

  const couldBeWithdrawn = (parseFloat(shares)/100)*(parseFloat(contractBalance) + parseFloat(totalReleased)) - parseFloat(amountReleased)

  return (
    <div className="userData">
      <div className="userOptions">
      {isPayee &&
        <Box
          width={width}
          Flex
          sx={{
            bg: theme.colors.lightblue,
            px: 4,
            py: 20,
            marginX: 2,
            marginY: 10,
            textAlign: 'left',
            justifyContent: 'center',
          }}
        >
          <h3>Payee</h3>
          <div>
            Your share is <strong>{shares}%</strong> of total contributions and you have currently withdrawn <strong>{amountReleased}</strong> ETH.
            <br/><br/>
            {couldBeWithdrawn > 0 
              ? <span>You can withdraw <strong>{couldBeWithdrawn}</strong> ETH. Click the button below to release all funds.</span>
              : <span>You have already withdrawn your shares.</span>
            }
          </div>
          { couldBeWithdrawn > 0 && !loading && (<Button
            onClick={releaseFunds}
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
            Withdraw Funds
          </Button>)}
          {!!loading && <Loading />}
        </Box>
      }
      {isContributor &&
        <Box
          width={width}
          Flex
          sx={{
            bg: theme.colors.lightblue,
            px: 4,
            pt: 15,
            pb: 30,
            marginX: 2,
            marginY: 10,
            textAlign: 'left',
            justifyContent: 'center',
          }}
        >
          <h3>Contributor</h3>
            You have contributed <strong>{contribution}</strong> ETH
        </Box>
      }
      </div>
    </div>
  )
}

export default UserOptions;