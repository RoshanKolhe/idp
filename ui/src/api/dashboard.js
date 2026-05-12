// eslint-disable-next-line import/no-extraneous-dependencies
import useSWR from 'swr';
import { useCallback, useMemo } from 'react';
// utils
import { endpoints, fetcher, workflowFetcher } from 'src/utils/axios';

// ----------------------------------------------------------------------

const DEFAULT_IDP_COUNTS = {
  totalProcesses: 0,
  currentRunningProcesses: 0,
  totalProcessInstances: 0,
  failedProcessInstances: 0,
};

const DEFAULT_WORKFLOW_COUNTS = {
  totalWorkflows: 0,
  currentWorkflowInProgress: 0,
  completedWorkflowInstances: 0,
};

function toQueryDate(value) {
  if (!value) {
    return '';
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return value;
}

function buildDashboardQuery(filters) {
  const params = new URLSearchParams();

  if (filters?.hours) {
    params.set('hours', String(filters.hours));
  }

  const startDate = toQueryDate(filters?.startDate);
  const endDate = toQueryDate(filters?.endDate);

  if (startDate) {
    params.set('startDate', startDate);
  }

  if (endDate) {
    params.set('endDate', endDate);
  }

  return params.toString();
}

export function useGetDashboardCounts(filters) {
  const query = useMemo(() => buildDashboardQuery(filters), [filters]);

  const idpURL = endpoints.dashboard.idpCounts(query);
  const workflowURL = endpoints.dashboard.workflowCounts(query);

  const {
    data: idpCounts,
    isLoading: idpCountsLoading,
    error: idpCountsError,
    isValidating: idpCountsValidating,
    mutate: mutateIdpCounts,
  } = useSWR(idpURL, fetcher);

  const {
    data: workflowCounts,
    isLoading: workflowCountsLoading,
    error: workflowCountsError,
    isValidating: workflowCountsValidating,
    mutate: mutateWorkflowCounts,
  } = useSWR(workflowURL, workflowFetcher);

  const refreshDashboardCounts = useCallback(() => {
    mutateIdpCounts();
    mutateWorkflowCounts();
  }, [mutateIdpCounts, mutateWorkflowCounts]);

  return {
    dashboardCounts: {
      ...DEFAULT_IDP_COUNTS,
      ...DEFAULT_WORKFLOW_COUNTS,
      ...idpCounts,
      ...workflowCounts,
    },
    dashboardCountsLoading: idpCountsLoading || workflowCountsLoading,
    dashboardCountsError: idpCountsError || workflowCountsError,
    dashboardCountsValidating: idpCountsValidating || workflowCountsValidating,
    refreshDashboardCounts,
  };
}
