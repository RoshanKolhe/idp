// eslint-disable-next-line import/no-extraneous-dependencies
import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetFileTypes() {
  const URL = endpoints.fileType.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshFileTypes = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    fileTypes: data || [],
    fileTypesLoading: isLoading,
    fileTypesError: error,
    fileTypesValidating: isValidating,
    fileTypesEmpty: !isLoading && !data?.length,
    refreshFileTypes, // Include the refresh function separately
  };
}

// ----------------------------------------------------------------------

export function useGetFileType(fileTypeId) {
  const URL = fileTypeId ? [endpoints.fileType.details(fileTypeId)] : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      fileType: data,
      fileTypeLoading: isLoading,
      fileTypeError: error,
      fileTypeValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetFileTypesWithFilter(filter) {
  let URL;
  if (filter) {
    URL = endpoints.fileType.filterList(filter);
  } else {
    URL = endpoints.fileType.list;
  }

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshFilterFileTypes = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    filteredFileTypes: data || [],
    filteredFileTypesLoading: isLoading,
    filteredFileTypesError: error,
    filteredFileTypesValidating: isValidating,
    filteredFileTypesEmpty: !isLoading && !data?.length,
    refreshFilterFileTypes, // Include the refresh function separately
  };
}
