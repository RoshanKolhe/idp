import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------
export function useGetProcessTemplates() {
    const URL = endpoints.processTemplates.list;

    const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

    const refreshProcessTemplates = () => {
        // Use the `mutate` function to trigger a revalidation
        mutate();
    };

    return {
        processTemplates: data || [],
        processTemplatesLoading: isLoading,
        processTemplatesError: error,
        processTemplatesValidating: isValidating,
        processTemplatesEmpty: !isLoading && !data?.length,
        refreshProcessTemplates,
    };
}

// ---------------------------------------------------------------------

export function useGetProcessTemplatesWithFilter(filter) {
    const URL = filter ? endpoints.processTemplates.filterList(filter) : endpoints.processTemplates.list;

    const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

    const refreshProcessTemplates = () => {
        // Use the `mutate` function to trigger a revalidation
        mutate();
    };

    return {
        processTemplates: data || [],
        processTemplatesLoading: isLoading,
        processTemplatesError: error,
        processTemplatesValidating: isValidating,
        processTemplatesEmpty: !isLoading && !data?.length,
        refreshProcessTemplates,
    };
}

// ----------------------------------------------------------------------
export function useGetProcessTemplate(processTemplateId) {
    const URL = processTemplateId ? [endpoints.processTemplates.details(processTemplateId)] : null;
    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            processTemplate: data,
            processTemplateLoading: isLoading,
            processTemplateError: error,
            processTemplateValidating: isValidating,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------

export async function deleteProcessTemplate(id) {
  await axiosInstance.delete(endpoints.processTemplates.details(id));
}
