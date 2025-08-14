import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetMembers() {
  const URL = endpoints.member.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      members: data?.members || [],
      membersLoading: isLoading,
      membersError: error,
      membersValidating: isValidating,
      membersEmpty: !isLoading && !data?.members.length,
    }),
    [data?.members, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetMember(id) {
  const URL = id ? [endpoints.member.details, { params: { id } }] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      member: data?.member,
      memberLoading: isLoading,
      memberError: error,
      memberValidating: isValidating,
    }),
    [data?.member, error, isLoading, isValidating]
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
