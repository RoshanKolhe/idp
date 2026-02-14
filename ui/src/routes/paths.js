// utils
import { paramCase } from 'src/utils/change-case';
import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
  docs: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
  zoneUI: 'https://mui.com/store/items/zone-landing-page/',
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figma:
    'https://www.figma.com/file/kAYnYYdib0aQPNKZpgJT6J/%5BPreview%5D-Minimal-Web.v5.0.0?type=design&node-id=0%3A1&t=Al4jScQq97Aly0Mn-1',
  product: {
    root: `/product`,
    checkout: `/product/checkout`,
    details: (id) => `/product/${id}`,
    demo: {
      details: `/product/${MOCK_ID}`,
    },
  },
  post: {
    root: `/post`,
    details: (title) => `/post/${paramCase(title)}`,
    demo: {
      details: `/post/${paramCase(MOCK_TITLE)}`,
    },
  },
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/admin/login`,
      register: `${ROOTS.AUTH}/admin/register`,
      forgotPassword: `${ROOTS.AUTH}/admin/forgot-password`,
      newPassword: `${ROOTS.AUTH}/admin/new-password`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    profile: `${ROOTS.DASHBOARD}/profile`,
    mail: `${ROOTS.DASHBOARD}/mail`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    blank: `${ROOTS.DASHBOARD}/blank`,
    kanban: `${ROOTS.DASHBOARD}/kanban`,
    calendar: `${ROOTS.DASHBOARD}/calendar`,
    fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    permission: `${ROOTS.DASHBOARD}/permission`,
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      ecommerce: `${ROOTS.DASHBOARD}/ecommerce`,
      analytics: `${ROOTS.DASHBOARD}/analytics`,
      banking: `${ROOTS.DASHBOARD}/banking`,
      booking: `${ROOTS.DASHBOARD}/booking`,
      file: `${ROOTS.DASHBOARD}/file`,
    },
    // PROCESS TYPE
    processType: {
      root: `${ROOTS.DASHBOARD}/processType`,
      new: `${ROOTS.DASHBOARD}/processType/new`,
      list: `${ROOTS.DASHBOARD}/processType/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/processType/${id}/edit`,
      view: (id) => `${ROOTS.DASHBOARD}/processType/${id}/view`,
    },
    documentType: {
      root: `${ROOTS.DASHBOARD}/documentType`,
      new: `${ROOTS.DASHBOARD}/documentType/new`,
      list: `${ROOTS.DASHBOARD}/documentType/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/documentType/${id}/edit`,
      view: (id) => `${ROOTS.DASHBOARD}/documentType/${id}/view`,
    },
    processes: {
      root: `${ROOTS.DASHBOARD}/processes`,
      new: `${ROOTS.DASHBOARD}/processes/new`,
      list: `${ROOTS.DASHBOARD}/processes/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/processes/${id}/edit`,
      view: (id) => `${ROOTS.DASHBOARD}/processes/${id}/view`,
      documentProcess: `${ROOTS.DASHBOARD}/processes/document-process`,
      reactFlow: (id) => `${ROOTS.DASHBOARD}/processes/${id}/blueprint`,
    },
    processesInstance: {
      root: `${ROOTS.DASHBOARD}/processesInstance`,
      new: `${ROOTS.DASHBOARD}/processesInstance/new`,
      list: `${ROOTS.DASHBOARD}/processesInstance/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/processesInstance/${id}/edit`,
      view: (id) => `${ROOTS.DASHBOARD}/processesInstance/${id}/view`,
      reactFlow: (id) => `${ROOTS.DASHBOARD}/processesInstance/${id}/blueprint`,
      extractedDocs: (id) => `${ROOTS.DASHBOARD}/processesInstance/${id}/extracted-documents`,
      logsList: (id) => `${ROOTS.DASHBOARD}/processesInstance/${id}/logs`,
    },
    // workflows
    workflow: {
      root: `${ROOTS.DASHBOARD}/workflow`,
      new: `${ROOTS.DASHBOARD}/workflow/new`,
      list: `${ROOTS.DASHBOARD}/workflow/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/workflow/${id}/edit`,
      view: (id) => `${ROOTS.DASHBOARD}/workflow/${id}/view`,
      documentProcess: `${ROOTS.DASHBOARD}/workflow/document-process`,
      reactFlow: (id) => `${ROOTS.DASHBOARD}/workflow/${id}/blueprint`,
    },
    workflowInstance: {
      root: `${ROOTS.DASHBOARD}/workflowInstance`,
      new: `${ROOTS.DASHBOARD}/workflowInstance/new`,
      list: `${ROOTS.DASHBOARD}/workflowInstance/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/workflowInstance/${id}/edit`,
      view: (id) => `${ROOTS.DASHBOARD}/workflowInstance/${id}/view`,
      reactFlow: (id) => `${ROOTS.DASHBOARD}/workflowInstance/${id}/blueprint`,
      extractedDocs: (id) => `${ROOTS.DASHBOARD}/workflowInstance/${id}/extracted-documents`,
      logsList: (id) => `${ROOTS.DASHBOARD}/workflowInstance/${id}/logs`,
      executionFlow: (workflowId, outputId) => `${ROOTS.DASHBOARD}/workflowInstance/${workflowId}/execution/${outputId}`
    },
    fileType: {
      root: `${ROOTS.DASHBOARD}/fileType`,
      new: `${ROOTS.DASHBOARD}/fileType/new`,
      list: `${ROOTS.DASHBOARD}/fileType/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/fileType/${id}/edit`,
      view: (id) => `${ROOTS.DASHBOARD}/fileType/${id}/view`,
    },
    mailServer: {
      root: `${ROOTS.DASHBOARD}/mailServer`,
      // view: `${ROOTS.DASHBOARD}/rootServer/${id}/view`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      edit: (id) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit`,
      },
    },

    // process templates
    processTemplates: {
      root: `${ROOTS.DASHBOARD}/process-template`,
      new: `${ROOTS.DASHBOARD}/process-template/new`,
      list: `${ROOTS.DASHBOARD}/process-template/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/process-template/${id}/edit`,
      view: (id) => `${ROOTS.DASHBOARD}/process-template/${id}/view`,
    },

    product: {
      root: `${ROOTS.DASHBOARD}/product`,
      new: `${ROOTS.DASHBOARD}/product/new`,
      details: (id) => `${ROOTS.DASHBOARD}/product/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/product/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/product/${MOCK_ID}/edit`,
      },
    },
    invoice: {
      root: `${ROOTS.DASHBOARD}/invoice`,
      new: `${ROOTS.DASHBOARD}/invoice/new`,
      details: (id) => `${ROOTS.DASHBOARD}/invoice/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}/edit`,
      },
    },
    post: {
      root: `${ROOTS.DASHBOARD}/post`,
      new: `${ROOTS.DASHBOARD}/post/new`,
      details: (title) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}`,
      edit: (title) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}`,
        edit: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}/edit`,
      },
    },

    notificationSetting: {
      root: `${ROOTS.DASHBOARD}/notificationSetting`,
      list: `${ROOTS.DASHBOARD}/notificationSetting/list`,
      new: `${ROOTS.DASHBOARD}/notificationSetting/new`,
      edit: (id) => `${ROOTS.DASHBOARD}/notificationSetting/${id}/edit`,
      view: (id) => `${ROOTS.DASHBOARD}/notificationSetting/${id}`


    },
    order: {
      root: `${ROOTS.DASHBOARD}/order`,
      details: (id) => `${ROOTS.DASHBOARD}/order/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/order/${MOCK_ID}`,
      },
    },
    job: {
      root: `${ROOTS.DASHBOARD}/job`,
      new: `${ROOTS.DASHBOARD}/job/new`,
      details: (id) => `${ROOTS.DASHBOARD}/job/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/job/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/job/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/job/${MOCK_ID}/edit`,
      },
    },
    tour: {
      root: `${ROOTS.DASHBOARD}/tour`,
      new: `${ROOTS.DASHBOARD}/tour/new`,
      details: (id) => `${ROOTS.DASHBOARD}/tour/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/tour/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}/edit`,
      },
    },
  },
};
