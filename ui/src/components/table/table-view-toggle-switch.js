import { Box, IconButton } from '@mui/material';
import PropTypes from 'prop-types';

export default function TableViewToggleSwitch({ view = 'grid', setView }) {
  const handleToggle = (newView) => {
    setView(newView);
    // trigger any parent function if needed
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#F9F9FB',
        borderRadius: '30px',
        padding: '4px',
        width: 130,
        height: 48,
        boxShadow: '0 0 0 1px #E5E7EB',
        justifyContent: 'space-between',
      }}
    >
      {/* Grid View */}
      <IconButton
        onClick={() => handleToggle('grid')}
        sx={{
          width: 60,
          height: 40,
          borderRadius: '24px',
          backgroundColor: view === 'grid' ? '#4182EB' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            backgroundColor: view === 'grid' ? '#4182EB' : '#f0f0f0',
          },
        }}
      >
        <Box
          component="img"
          src="/assets/icons/components/element-3.png"
          alt="Grid"
          sx={{
            width: 20,
            height: 20,
            filter: view === 'grid' ? 'brightness(0) invert(1)' : 'none',
          }}
        />
      </IconButton>

      {/* List View */}
      <IconButton
        onClick={() => handleToggle('list')}
        sx={{
          width: 60,
          height: 40,
          borderRadius: '24px',
          backgroundColor: view === 'list' ? '#4182EB' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            backgroundColor: view === 'list' ? '#4182EB' : '#f0f0f0',
          },
        }}
      >
        <Box
          component="img"
          src="/assets/icons/components/Frame.png"
          alt="List"
          sx={{
            width: 20,
            height: 20,
            filter: view === 'list' ? 'brightness(0) invert(1)' : 'none',
          }}
        />
      </IconButton>
    </Box>
  );
}

TableViewToggleSwitch.propTypes = {
  view: PropTypes.string,
  setView: PropTypes.func,
};
