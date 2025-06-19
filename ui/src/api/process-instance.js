// eslint-disable-next-line import/no-extraneous-dependencies
import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetProcessInstances() {
  const URL = endpoints.processInstance.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshProcessInstances = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    processInstances: data || [],
    processInstancesLoading: isLoading,
    processInstancesError: error,
    processInstancesValidating: isValidating,
    processInstancesEmpty: !isLoading && !data?.length,
    refreshProcessInstances, // Include the refresh function separately
  };
}

// ----------------------------------------------------------------------

export function useGetProcessInstance(processInstanceId) {
  const URL = processInstanceId ? [endpoints.processInstance.details(processInstanceId)] : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      processInstance: data,
      processInstanceLoading: isLoading,
      processInstanceError: error,
      processInstanceValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetProcessInstancesWithFilter(filter) {
  let URL;
  if (filter) {
    URL = endpoints.processInstance.filterList(filter);
  } else {
    URL = endpoints.processInstance.list;
  }

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshFilterProcessInstances = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    filteredProcessInstances: data || [],
    filteredProcessInstancesLoading: isLoading,
    filteredProcessInstancesError: error,
    filteredProcessInstancesValidating: isValidating,
    filteredProcessInstancesEmpty: !isLoading && !data?.length,
    refreshFilterProcessInstances, // Include the refresh function separately
  };
}
