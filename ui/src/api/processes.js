// eslint-disable-next-line import/no-extraneous-dependencies
import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetProcesses() {
  const URL = endpoints.processes.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshProcesses = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    processess: data || [],
    processessLoading: isLoading,
    processessError: error,
    processessValidating: isValidating,
    processessEmpty: !isLoading && !data?.length,
    refreshProcesses, // Include the refresh function separately
  };
}

// ----------------------------------------------------------------------

export function useGetProcessType(processesId) {
  const URL = processesId ? [endpoints.processes.details(processesId)] : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      processes: data,
      processesLoading: isLoading,
      processesError: error,
      processesValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetProcessesWithFilter(filter) {
  let URL;
  if (filter) {
    URL = endpoints.processes.filterList(filter);
  } else {
    URL = endpoints.processes.list;
  }

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshFilterProcesses = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    filteredProcesses: data || [],
    filteredProcessesLoading: isLoading,
    filteredProcessesError: error,
    filteredProcessesValidating: isValidating,
    filteredProcessesEmpty: !isLoading && !data?.length,
    refreshFilterProcesses, // Include the refresh function separately
  };
}
