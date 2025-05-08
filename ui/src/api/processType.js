// eslint-disable-next-line import/no-extraneous-dependencies
import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetProcessTypes() {
  const URL = endpoints.processType.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshProcessTypes = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    processTypes: data || [],
    processTypesLoading: isLoading,
    processTypesError: error,
    processTypesValidating: isValidating,
    processTypesEmpty: !isLoading && !data?.length,
    refreshProcessTypes, // Include the refresh function separately
  };
}

// ----------------------------------------------------------------------

export function useGetProcessType(processTypeId) {
  const URL = processTypeId ? [endpoints.processType.details(processTypeId)] : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      processType: data,
      processTypeLoading: isLoading,
      processTypeError: error,
      processTypeValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetProcessTypesWithFilter(filter) {
  let URL;
  if (filter) {
    URL = endpoints.processType.filterList(filter);
  } else {
    URL = endpoints.processType.list;
  }

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshFilterProcessTypes = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    filteredProcessTypes: data || [],
    filteredProcessTypesLoading: isLoading,
    filteredProcessTypesError: error,
    filteredProcessTypesValidating: isValidating,
    filteredProcessTypesEmpty: !isLoading && !data?.length,
    refreshFilterProcessTypes, // Include the refresh function separately
  };
}
