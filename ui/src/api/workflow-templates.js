import useSWR from 'swr';
import {useMemo} from 'react';
import {endpoints, workflowFetcher} from 'src/utils/axios';

export function useGetWorkflowTemplates() {
  const URL = endpoints.workflowTemplates.list;
  const {data, isLoading, error, isValidating, mutate} = useSWR(URL, workflowFetcher);

  return {
    workflowTemplates: data || [],
    workflowTemplatesLoading: isLoading,
    workflowTemplatesError: error,
    workflowTemplatesValidating: isValidating,
    workflowTemplatesEmpty: !isLoading && !data?.length,
    refreshWorkflowTemplates: mutate,
  };
}

export function useGetWorkflowTemplatesWithFilters(filter) {
  const URL = filter ? endpoints.workflowTemplates.filterList(filter) : endpoints.workflowTemplates.list;
  const {data, isLoading, error, isValidating, mutate} = useSWR(URL, workflowFetcher);

  return {
    workflowTemplates: data || [],
    workflowTemplatesLoading: isLoading,
    workflowTemplatesError: error,
    workflowTemplatesValidating: isValidating,
    workflowTemplatesEmpty: !isLoading && !data?.length,
    refreshWorkflowTemplates: mutate,
  };
}

export function useGetWorkflowTemplate(workflowTemplateId) {
  const URL = workflowTemplateId ? [endpoints.workflowTemplates.details(workflowTemplateId)] : null;
  const {data, isLoading, error, isValidating, mutate} = useSWR(URL, workflowFetcher);

  return useMemo(
    () => ({
      workflowTemplate: data,
      workflowTemplateLoading: isLoading,
      workflowTemplateError: error,
      workflowTemplateValidating: isValidating,
      refreshWorkflowTemplate: mutate,
    }),
    [data, error, isLoading, isValidating, mutate],
  );
}
