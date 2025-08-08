import { Box, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import SingleHexagon from 'src/components/level-cards/hexagon-level-card';
import MemberItemHorizontal from './member-details-horizontal';

const LEVEL_COLORS = ['#e6651aff', '#F5B800', '#33B679', '#00B8D9'];

export default function EscalationMatrixPage({ levels }) {
  return (
   
        <Stack direction="row" spacing={4} justifyContent="flex-start"   sx={{
          overflowX: 'auto',
          whiteSpace: 'nowrap',
        }}>
{/* levels.map(level, index)=> ( ) */}
           
          {levels.map((level, index) => (
            <Stack
              key={level.id}
              spacing={2}
              alignItems="center"
              sx={{ minWidth: 300 }}
            >
              {/* Hexagon */}
              <SingleHexagon
                level={level.name}
                color={LEVEL_COLORS[index % LEVEL_COLORS.length]}
              />

              {/* Members */}
              <Stack spacing={2} width={260}>
                {level.members.map((member) => (
                  <MemberItemHorizontal
                    key={member.id}
                    levelName={level.name}
                    levelDescription={level.description}
                    member={member}
                  />
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
          name: PropTypes.string,
          email: PropTypes.string,
          phone: PropTypes.string,
        })
      ),
    })
  ),
};
