import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetEscalations() {
  const URL = endpoints.escalation.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const refreshEscalations = () => {
    mutate(URL);
  }

  const memoizedValue = useMemo(
    () => ({
      escalation: data || [],
      count: data?.count || 0,
      escalationLoading: isLoading,
      escalationError: error,
      escalationValidating: isValidating,
     escalationEmpty: !isLoading && (!data || data.length === 0),

    }),
    [data, error, isLoading, isValidating]
  );

  return {...memoizedValue, refreshEscalations};
}


// ----------------------------------------------------------------------

export function useGetEscalation(id) {
  const URL = id ? [endpoints.escalation.details, { params: { id } }] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      escalation: data?.escalation,
      escalationLoading: isLoading,
      escalationError: error,
      escalationValidating: isValidating,
    }),
    [data?.escalation, error, isLoading, isValidating]
  );

  return memoizedValue;
}
export function useGetFilteredEscalations(filter) {
  const URL = filter ? endpoints.escalation.filterList(filter)  : endpoints.escalation.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      escalations: data || [],
      count: data?.count || 0,
      escalationsLoading: isLoading,
      escalationsError: error,
      escalationsValidating: isValidating,
      escalationsEmpty: !isLoading && (!data || data?.length === 0),
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
