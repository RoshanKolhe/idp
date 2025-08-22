import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetLevels() {
  const URL = endpoints.level.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const refreshLevels = () => {
    mutate(URL);
  }

  const memoizedValue = useMemo(
    () => ({
      levels: Array.isArray(data) ? data : [],
      levelsLoading: isLoading,
      levelsError: error,
      levelsValidating: isValidating,
      levelsEmpty: !isLoading && !(Array.isArray(data) && data.length > 0),
    }),
    [data, error, isLoading, isValidating]
  );

  return {...memoizedValue, refreshLevels};
}


// ----------------------------------------------------------------------

export function useGetLevel(id) {
  const URL = id ? [endpoints.level.details, { params: { id } }] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      level: data?.level,
      levelLoading: isLoading,
      levelError: error,
      levelValidating: isValidating,
    }),
    [data?.level, error, isLoading, isValidating]
  );

  return memoizedValue;
}
export function useGetFilteredLevels(filter) {
  const URL = filter ? endpoints.level.filterList(filter)  : endpoints.level.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      levels: data?.levels || [],
      count: data?.count || 0,
      levelsLoading: isLoading,
      levelsError: error,
      levelsValidating: isValidating,
      levelsEmpty: !isLoading && (!data || data?.levels?.length === 0),
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

// export function useGetLatestPosts(title) {
//   const URL = title ? [endpoints.post.latest, { params: { title } }] : null;

//   const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

//   const memoizedValue = useMemo(
//     () => ({
//       latestPosts: data?.latestPosts || [],
//       latestPostsLoading: isLoading,
//       latestPostsError: error,
//       latestPostsValidating: isValidating,
//       latestPostsEmpty: !isLoading && !data?.latestPosts.length,
//     }),
//     [data?.latestPosts, error, isLoading, isValidating]
//   );

//   return memoizedValue;
// }

// // ----------------------------------------------------------------------

// export function useSearchPosts(query) {
//   const URL = query ? [endpoints.post.search, { params: { query } }] : null;

//   const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
//     keepPreviousData: true,
//   });

//   const memoizedValue = useMemo(
//     () => ({
//       searchResults: data?.results || [],
//       searchLoading: isLoading,
//       searchError: error,
//       searchValidating: isValidating,
//       searchEmpty: !isLoading && !data?.results.length,
//     }),
//     [data?.results, error, isLoading, isValidating]
//   );

//   return memoizedValue;
// }
