import axios from 'axios';
// config
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/me',
    login: '/login',
    register: '/register',
  },
  processType: {
    list: '/process-types',
    filterList: (filter) => `/process-types?${filter}`,
    details: (id) => `/process-types/${id}`,
  },
  documentType: {
    list: '/document-types',
    filterList: (filter) => `/document-types?${filter}`,
    details: (id) => `/document-types/${id}`,
  },
  processes: {
    list: '/processes',
    filterList: (filter) => `/processes?${filter}`,
    details: (id) => `/processes/${id}`,
    bluePrint: (id) => `/blue-prints/processes/${id}`
  },
  processInstance: {
    list: '/process-instances',
    filterList: (filter) => `/process-instances?${filter}`,
    details: (id) => `/process-instances/${id}`,
    extractedDocuments: (id) => `/process-instance-documents/by-process-instance/${id}`
  },
  fileType: {
    list: '/file-types',
    filterList: (filter) => `/file-types?${filter}`,
    details: (id) => `/file-types/${id}`,
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  level: {
    list: '/levels',
    filterList: (filter) => `/levels?filter=${filter}`,
    details: (id) => `/levels/${id}`,
  },
  member: {
    list: '/members',
    details: (id) => `/members/${id}`,
  },

  escalation: {
    list: '/escalations',
    filterList: (filter) => `/escalations?filter=${filter}`,
    details: (id) => `/escalations/${id}`,
  },
};
