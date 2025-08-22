import { Box, Stack, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import SingleHexagon from 'src/components/level-cards/hexagon-level-card';
import MemberItemHorizontal from './member-details-horizontal';

const LEVEL_COLORS = ['#853cc2ff', '#F5B800', '#33B679', '#00B8D9'];

export default function EscalationMatrixPage({ levels, refreshLevels }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Stack
      direction={isSmallScreen ? 'column' : 'row'}
      spacing={4}
      justifyContent="flex-start"
      sx={{
        overflowX: isSmallScreen ? 'visible' : 'auto',
        overflowY: isSmallScreen ? 'auto' : 'hidden',
        whiteSpace: isSmallScreen ? 'normal' : 'nowrap',
      }}
    >
      {levels.map((level, index) => (
        <Stack
          key={level.id}
          spacing={1}
          alignItems="center"
          sx={{
            minWidth: isSmallScreen ? '100%' : 'fit-content',
            height: isSmallScreen ? 'auto' : 600,
            backgroundImage: "url('/assets/background/escalation-matrix.svg')",
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center 40px',
            py: 2,
            boxSizing: 'border-box',
          }}
        >
          {/* Hexagon */}
          <SingleHexagon
            level={level.name}
            color={LEVEL_COLORS[index % LEVEL_COLORS.length]}
          />

          {/* Members list fills remaining height */}
          <Stack
            spacing={1}
            sx={{
              flex: 1,
              minWidth: '100%',
              height: isSmallScreen ? 'auto' : 'calc(100% - 120px)',
              overflowY: isSmallScreen ? 'visible' : 'auto',
              pr: 1,
            }}
          >
            {(level.members || []).map((member) => (
              <Box key={member.id} sx={{ minWidth: isSmallScreen ? '100%' : 280 }}>
                <MemberItemHorizontal
                  levelName={level.name}
                  member={member}
                />
              </Box>
            ))}
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}

EscalationMatrixPage.propTypes = {
  levels: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      members: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          fullName: PropTypes.string,
          email: PropTypes.string,
          phoneNumber: PropTypes.string,
          avatarUrl: PropTypes.object,
        })
      ),
    })
  ),
  refreshLevels: PropTypes.func
};
