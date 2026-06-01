import { Box, Stack, useMediaQuery } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import SingleHexagon from 'src/components/level-cards/hexagon-level-card';
import MemberItemHorizontal from './member-details-horizontal';

export default function EscalationMatrixPage({ levels, onEditMember, onDeleteMember }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const levelColors = [
    theme.palette.primary.main,
    theme.palette.warning.main,
    theme.palette.success.main,
    theme.palette.info.main,
  ];

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
            color={levelColors[index % levelColors.length]}
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
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
	            {(level.members || []).map((member) => (
	              <Box
	                key={member.id}
	                sx={{
	                  minWidth: isSmallScreen ? '100%' : 300,
	                  borderRadius: 2,
	                  backgroundColor: (currentTheme) =>
	                    alpha(currentTheme.palette.background.paper, 0.72),
	                }}
	              >
	                <MemberItemHorizontal
	                  levelName={level.name}
	                  member={member}
	                  onEditRow={() => onEditMember(member)}
	                  onDeleteRow={() => onDeleteMember?.(member)}
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
          avatarUrl: PropTypes.shape({
            fileUrl: PropTypes.string,
          }),
        })
      ),
    })
  ),
	  onEditMember: PropTypes.func,
	  onDeleteMember: PropTypes.func,
};
