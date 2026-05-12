import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// api
import { useGetDashboardCounts } from 'src/api/dashboard';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
// utils
import { fShortenNumber } from 'src/utils/format-number';

// ----------------------------------------------------------------------

const QUICK_RANGES = [
  { value: 'all', label: 'All' },
  { value: '24h', label: '24h' },
  { value: '7d', label: '7d' },
  { value: '30d', label: '30d' },
  { value: 'custom', label: 'Custom' },
];

const IDP_CARDS = [
  {
    title: 'Processes',
    field: 'totalProcesses',
    caption: 'All process definitions',
    icon: 'solar:document-text-bold-duotone',
    color: 'primary',
  },
  {
    title: 'Running Processes',
    field: 'currentRunningProcesses',
    caption: 'Current running process instances',
    icon: 'solar:play-circle-bold-duotone',
    color: 'success',
  },
  {
    title: 'Process Instances',
    field: 'totalProcessInstances',
    caption: 'Created process runs',
    icon: 'solar:layers-bold-duotone',
    color: 'info',
  },
  {
    title: 'Failed Process Instances',
    field: 'failedProcessInstances',
    caption: 'Instances marked failed',
    icon: 'solar:danger-triangle-bold-duotone',
    color: 'error',
  },
];

const WORKFLOW_CARDS = [
  {
    title: 'Workflows',
    field: 'totalWorkflows',
    caption: 'All workflow definitions',
    icon: 'solar:branching-paths-up-bold-duotone',
    color: 'secondary',
  },
  {
    title: 'Workflow In Progress',
    field: 'currentWorkflowInProgress',
    caption: 'Workflow executions currently running',
    icon: 'solar:clock-circle-bold-duotone',
    color: 'warning',
  },
  {
    title: 'Completed Workflow Instances',
    field: 'completedWorkflowInstances',
    caption: 'Workflow executions completed',
    icon: 'solar:check-circle-bold-duotone',
    color: 'success',
  },
];

function DashboardMetricCard({ title, total, caption, icon, color, loading }) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        p: 3,
        height: 1,
        minHeight: 168,
        borderRadius: 1,
        border: `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
        boxShadow: theme.customShadows.card,
      }}
    >
      <Stack spacing={2} sx={{ height: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Box
            sx={{
              width: 48,
              height: 48,
              display: 'grid',
              borderRadius: 1,
              placeItems: 'center',
              color: `${color}.main`,
              bgcolor: alpha(theme.palette[color].main, 0.12),
            }}
          >
            <Iconify icon={icon} width={28} />
          </Box>

          {loading ? (
            <Skeleton variant="rounded" width={92} height={40} />
          ) : (
            <Typography variant="h3" sx={{ lineHeight: 1 }}>
              {fShortenNumber(total)}
            </Typography>
          )}
        </Stack>

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1">{title}</Typography>
          <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
            {caption}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
}

DashboardMetricCard.propTypes = {
  caption: PropTypes.string,
  color: PropTypes.string,
  icon: PropTypes.string,
  loading: PropTypes.bool,
  title: PropTypes.string,
  total: PropTypes.number,
};

// ----------------------------------------------------------------------

export default function OverviewAnalyticsView() {
  const settings = useSettingsContext();

  const [range, setRange] = useState('all');
  const [startDate, setStartDate] = useState(() => new Date(Date.now() - 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(() => new Date());

  const dashboardFilters = useMemo(() => {
    if (range === '24h') {
      return { hours: 24 };
    }

    if (range === '7d') {
      return { hours: 24 * 7 };
    }

    if (range === '30d') {
      return { hours: 24 * 30 };
    }

    if (range === 'custom') {
      return { startDate, endDate };
    }

    return {};
  }, [endDate, range, startDate]);

  const {
    dashboardCounts,
    dashboardCountsLoading,
    dashboardCountsError,
    dashboardCountsValidating,
    refreshDashboardCounts,
  } = useGetDashboardCounts(dashboardFilters);

  const handleRangeChange = (event, newRange) => {
    if (newRange) {
      setRange(newRange);
    }
  };

  const renderCards = (cards, gridSize) =>
    cards.map((card) => (
      <Grid key={card.field} xs={12} sm={6} md={gridSize}>
        <DashboardMetricCard
          {...card}
          total={dashboardCounts[card.field]}
          loading={dashboardCountsLoading}
        />
      </Grid>
    ));

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4">Dashboard</Typography>
          <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
            Process and workflow activity at a glance
          </Typography>
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          spacing={1.5}
          sx={{ width: { xs: 1, md: 'auto' } }}
        >
          <ToggleButtonGroup
            exclusive
            size="small"
            value={range}
            onChange={handleRangeChange}
            sx={{
              '& .MuiToggleButton-root': {
                px: 1.5,
              },
            }}
          >
            {QUICK_RANGES.map((option) => (
              <ToggleButton key={option.value} value={option.value}>
                {option.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <Tooltip title="Refresh counts">
            <span>
              <IconButton
                color="primary"
                onClick={refreshDashboardCounts}
                disabled={dashboardCountsValidating}
                sx={{
                  border: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.24)}`,
                }}
              >
                <Iconify icon="solar:refresh-bold" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Stack>

      {range === 'custom' && (
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            mb: 3,
            maxWidth: 640,
          }}
        >
          <DateTimePicker
            label="Start date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            slotProps={{ textField: { fullWidth: true, size: 'small' } }}
          />

          <DateTimePicker
            label="End date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            slotProps={{ textField: { fullWidth: true, size: 'small' } }}
          />
        </Stack>
      )}

      {dashboardCountsError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Unable to load dashboard counts. Please check the IDP and workflow APIs.
        </Alert>
      )}

      <Stack spacing={3}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
            <Iconify icon="solar:database-bold-duotone" width={22} sx={{ color: 'primary.main' }} />
            <Typography variant="h6">IDP Operations</Typography>
          </Stack>

          <Grid container spacing={3}>
            {renderCards(IDP_CARDS, 3)}
          </Grid>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
            <Iconify
              icon="solar:share-circle-bold-duotone"
              width={22}
              sx={{ color: 'secondary.main' }}
            />
            <Typography variant="h6">Workflow Operations</Typography>
          </Stack>

          <Grid container spacing={3}>
            {renderCards(WORKFLOW_CARDS, 4)}
          </Grid>
        </Box>
      </Stack>
    </Container>
  );
}
