import useSWR from 'swr';
import axios from 'axios';
import { AGENTS_API } from 'src/config-global';
// eslint-disable-next-line import/no-extraneous-dependencies
import { getAgentById as getStaticAgentById, getAgents as getStaticAgents } from '@repo/idp-agents';

const staticAgents = getStaticAgents();

const agentsAxiosInstance = axios.create({ baseURL: AGENTS_API });

agentsAxiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

const agentsFetcher = async (url) => {
  const response = await agentsAxiosInstance.get(url);
  return response.data;
};

export function useAgents() {
  const shouldFetch = Boolean(AGENTS_API);

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    shouldFetch ? '/agents' : null,
    agentsFetcher,
    {
      fallbackData: staticAgents,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const agents = Array.isArray(data) ? data : staticAgents;

  return {
    agents,
    agentsLoading: shouldFetch ? isLoading : false,
    agentsError: error,
    agentsValidating: isValidating,
    agentsMutate: mutate,
    isUsingFallbackAgents: !shouldFetch || Boolean(error),
  };
}

export function useAgentById(id) {
  const { agents, agentsLoading, agentsError, isUsingFallbackAgents } = useAgents();

  return {
    agent: agents.find((item) => item.id === id) || getStaticAgentById(id) || null,
    agentsLoading,
    agentsError,
    isUsingFallbackAgents,
  };
}

