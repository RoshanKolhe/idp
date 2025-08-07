import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Stack } from '@mui/material';

// Single hexagon item component
function SingleHexagon({ level, color }) {
  return (
    <Box
      sx={{
        width: 120,
        height: 120,
        position: 'relative',
        mx: 0.5,
      }}
    >
      {/* Outer Hexagon (Outer Border) */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
          background: color,
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />

      {/* Middle White Border */}
      <Box
        sx={{
          width: '90%',
          height: '90%',
          clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
          background: '#fff',
          position: 'absolute',
          top: '5%',
          left: '5%',
        }}
      />

      {/* Inner Hexagon */}
      <Box
        sx={{
          width: '75%',
          height: '75%',
          clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
          background: color,
          position: 'absolute',
          top: '12.5%',
          left: '12.5%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ color: '#fff', fontWeight: 'bold', textTransform: 'uppercase' }}
        >
          {level}
        </Typography>
      </Box>
    </Box>
  );
}

SingleHexagon.propTypes = {
  level: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

// Hexagon group with color array logic
export default function HexagonLevel({ levels = [] }) {
  const colors = ['#68aeff', '#978444ff', '#a6b0ecff', '#d89c2dff']; // Your 4 colors

  return (
    <Stack direction="row" flexWrap="wrap" justifyContent="left" spacing={1}>
      {levels.map((item, index) => (
        <SingleHexagon
          key={item.id}
          level={item.name}
          color={colors[index % colors.length]} // Rotate colors
        />
      ))}
    </Stack>
  );
}

HexagonLevel.propTypes = {
  levels: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      members: PropTypes.array,
    })
  )
};
