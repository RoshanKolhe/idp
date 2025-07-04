import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { AuthGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';
import { element } from 'prop-types';

// ----------------------------------------------------------------------

// OVERVIEW
const IndexPage = lazy(() => import('src/pages/dashboard/analytics'));
const OverviewEcommercePage = lazy(() => import('src/pages/dashboard/ecommerce'));
const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/app'));
const OverviewBankingPage = lazy(() => import('src/pages/dashboard/banking'));
const OverviewBookingPage = lazy(() => import('src/pages/dashboard/booking'));
const OverviewFilePage = lazy(() => import('src/pages/dashboard/file'));
// PRODUCT
const ProductDetailsPage = lazy(() => import('src/pages/dashboard/product/details'));
const ProductListPage = lazy(() => import('src/pages/dashboard/product/list'));
const ProductCreatePage = lazy(() => import('src/pages/dashboard/product/new'));
const ProductEditPage = lazy(() => import('src/pages/dashboard/product/edit'));
// ORDER
const OrderListPage = lazy(() => import('src/pages/dashboard/order/list'));
const OrderDetailsPage = lazy(() => import('src/pages/dashboard/order/details'));
// INVOICE
const InvoiceListPage = lazy(() => import('src/pages/dashboard/invoice/list'));
const InvoiceDetailsPage = lazy(() => import('src/pages/dashboard/invoice/details'));
const InvoiceCreatePage = lazy(() => import('src/pages/dashboard/invoice/new'));
const InvoiceEditPage = lazy(() => import('src/pages/dashboard/invoice/edit'));
// PROCESS TYPE
const ProcessTypeListPage = lazy(() => import('src/pages/dashboard/processType/list'));
const ProcessTypeCreatePage = lazy(() => import('src/pages/dashboard/processType/new'));
const ProcessTypeEditPage = lazy(() => import('src/pages/dashboard/processType/edit'));
const ProcessTypeViewPage = lazy(() => import('src/pages/dashboard/processType/view'));
// DOCUMENT TYPE
const DocumentTypeListPage = lazy(() => import('src/pages/dashboard/documentType/list'));
const DocumentTypeCreatePage = lazy(() => import('src/pages/dashboard/documentType/new'));
const DocumentTypeEditPage = lazy(() => import('src/pages/dashboard/documentType/edit'));
const DocumentTypeViewPage = lazy(() => import('src/pages/dashboard/documentType/view'));
// PROCESSES
const ProcessesListPage = lazy(() => import('src/pages/dashboard/processes/list'));
const ProcessesCreatePage = lazy(() => import('src/pages/dashboard/processes/new'));
const ProcessesEditPage = lazy(() => import('src/pages/dashboard/processes/edit'));
const ProcessesViewPage = lazy(() => import('src/pages/dashboard/processes/view'));
const ProcessesDocumentProcessingPage = lazy(() => import('src/pages/dashboard/processes/document-process'));
const ReactFlowPage = lazy(() => import('src/pages/dashboard/react-flow/board'));
// PROCESSES-INSTANCES
const ProcessInstanceCreatePage = lazy(() => import('src/pages/dashboard/processInstance/new'));
const ProcessInstanceEditPage = lazy(() => import('src/pages/dashboard/processInstance/edit'));
const ProcessInstanceListPage = lazy(() => import('src/pages/dashboard/processInstance/list'));
const ProcessInstanceViewPage = lazy(() => import('src/pages/dashboard/processInstance/view'));
const ProcessInstanceExtractedDocumentsPage = lazy(() => import('src/pages/dashboard/processInstance/extractedDocuments'));
const ProcessInstanceReactFlowPage = lazy(() => import('src/pages/dashboard/processInstance/react-flow'));
// FILE TYPE
const FileTypeListPage = lazy(() => import('src/pages/dashboard/fileType/list'));
const FileTypeCreatePage = lazy(() => import('src/pages/dashboard/fileType/new'));
const FileTypeEditPage = lazy(() => import('src/pages/dashboard/fileType/edit'));
const FileTypeViewPage = lazy(() => import('src/pages/dashboard/fileType/view'));
// USER
const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
const UserCardsPage = lazy(() => import('src/pages/dashboard/user/cards'));
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));
// BLOG
const BlogPostsPage = lazy(() => import('src/pages/dashboard/post/list'));
const BlogPostPage = lazy(() => import('src/pages/dashboard/post/details'));
const BlogNewPostPage = lazy(() => import('src/pages/dashboard/post/new'));
const BlogEditPostPage = lazy(() => import('src/pages/dashboard/post/edit'));
// JOB
const JobDetailsPage = lazy(() => import('src/pages/dashboard/job/details'));
const JobListPage = lazy(() => import('src/pages/dashboard/job/list'));
const JobCreatePage = lazy(() => import('src/pages/dashboard/job/new'));
const JobEditPage = lazy(() => import('src/pages/dashboard/job/edit'));
// TOUR
const TourDetailsPage = lazy(() => import('src/pages/dashboard/tour/details'));
const TourListPage = lazy(() => import('src/pages/dashboard/tour/list'));
const TourCreatePage = lazy(() => import('src/pages/dashboard/tour/new'));
const TourEditPage = lazy(() => import('src/pages/dashboard/tour/edit'));
// FILE MANAGER
const FileManagerPage = lazy(() => import('src/pages/dashboard/file-manager'));
// APP
const ChatPage = lazy(() => import('src/pages/dashboard/chat'));
const MailPage = lazy(() => import('src/pages/dashboard/mail'));
const CalendarPage = lazy(() => import('src/pages/dashboard/calendar'));
const KanbanPage = lazy(() => import('src/pages/dashboard/kanban'));
// TEST RENDER PAGE BY ROLE
const PermissionDeniedPage = lazy(() => import('src/pages/dashboard/permission'));
// BLANK PAGE
const BlankPage = lazy(() => import('src/pages/dashboard/blank'));
// LINKEDIN PAGE
const LinkedInPage = lazy(() => import('src/pages/linkedin-page'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      { path: 'profile', element: <UserAccountPage /> },
      { path: 'ecommerce', element: <OverviewEcommercePage /> },
      { path: 'analytics', element: <OverviewAnalyticsPage /> },
      { path: 'banking', element: <OverviewBankingPage /> },
      { path: 'booking', element: <OverviewBookingPage /> },
      { path: 'file', element: <OverviewFilePage /> },
      {
        path: 'processType',
        children: [
          { element: <ProcessTypeListPage />, index: true },
          { path: 'list', element: <ProcessTypeListPage /> },
          { path: 'new', element: <ProcessTypeCreatePage /> },
          { path: ':id/edit', element: <ProcessTypeEditPage /> },
          { path: ':id/view', element: <ProcessTypeViewPage /> },
        ],
      },
      {
        path: 'documentType',
        children: [
          { element: <DocumentTypeListPage />, index: true },
          { path: 'list', element: <DocumentTypeListPage /> },
          { path: 'new', element: <DocumentTypeCreatePage /> },
          { path: ':id/edit', element: <DocumentTypeEditPage /> },
          { path: ':id/view', element: <DocumentTypeViewPage /> },
        ],
      },
      {
        path: 'processes',
        children: [
          { element: <ProcessesListPage />, index: true },
          { path: 'list', element: <ProcessesListPage /> },
          { path: 'new', element: <ProcessesCreatePage /> },
          { path: ':id/edit', element: <ProcessesEditPage /> },
          { path: ':id/view', element: <ProcessesViewPage /> },
          { path: 'document-process', element: <ProcessesDocumentProcessingPage /> },
          { path: ':id/blueprint', element: <ReactFlowPage /> },
        ],
      },
      {
        path: 'processesInstance',
        children: [
          { element: <ProcessInstanceListPage />, index: true },
          { path: 'list', element: <ProcessInstanceListPage /> },
          { path: 'new', element: <ProcessInstanceCreatePage /> },
          { path: ':id/edit', element: <ProcessInstanceEditPage /> },
          { path: ':id/view', element: <ProcessInstanceViewPage /> },
          { path: ':id/extracted-documents', element: <ProcessInstanceExtractedDocumentsPage /> },
          { path: ':id/blueprint', element: <ProcessInstanceReactFlowPage /> },
        ],
      },
      {
        path: 'fileType',
        children: [
          { element: <FileTypeListPage />, index: true },
          { path: 'list', element: <FileTypeListPage /> },
          { path: 'new', element: <FileTypeCreatePage /> },
          { path: ':id/edit', element: <FileTypeEditPage /> },
          { path: ':id/view', element: <FileTypeViewPage /> },
        ],
      },
      {
        path: 'user',
        children: [
          { element: <UserProfilePage />, index: true },
          { path: 'profile', element: <UserProfilePage /> },
          { path: 'cards', element: <UserCardsPage /> },
          { path: 'list', element: <UserListPage /> },
          { path: 'new', element: <UserCreatePage /> },
          { path: ':id/edit', element: <UserEditPage /> },
          { path: 'account', element: <UserAccountPage /> },
        ],
      },
      {
        path: 'product',
        children: [
          { element: <ProductListPage />, index: true },
          { path: 'list', element: <ProductListPage /> },
          { path: ':id', element: <ProductDetailsPage /> },
          { path: 'new', element: <ProductCreatePage /> },
          { path: ':id/edit', element: <ProductEditPage /> },
        ],
      },
      {
        path: 'order',
        children: [
          { element: <OrderListPage />, index: true },
          { path: 'list', element: <OrderListPage /> },
          { path: ':id', element: <OrderDetailsPage /> },
        ],
      },
      {
        path: 'invoice',
        children: [
          { element: <InvoiceListPage />, index: true },
          { path: 'list', element: <InvoiceListPage /> },
          { path: ':id', element: <InvoiceDetailsPage /> },
          { path: ':id/edit', element: <InvoiceEditPage /> },
          { path: 'new', element: <InvoiceCreatePage /> },
        ],
      },
      {
        path: 'post',
        children: [
          { element: <BlogPostsPage />, index: true },
          { path: 'list', element: <BlogPostsPage /> },
          { path: ':title', element: <BlogPostPage /> },
          { path: ':title/edit', element: <BlogEditPostPage /> },
          { path: 'new', element: <BlogNewPostPage /> },
        ],
      },
      {
        path: 'job',
        children: [
          { element: <JobListPage />, index: true },
          { path: 'list', element: <JobListPage /> },
          { path: ':id', element: <JobDetailsPage /> },
          { path: 'new', element: <JobCreatePage /> },
          { path: ':id/edit', element: <JobEditPage /> },
        ],
      },
      {
        path: 'tour',
        children: [
          { element: <TourListPage />, index: true },
          { path: 'list', element: <TourListPage /> },
          { path: ':id', element: <TourDetailsPage /> },
          { path: 'new', element: <TourCreatePage /> },
          { path: ':id/edit', element: <TourEditPage /> },
        ],
      },
      { path: 'file-manager', element: <FileManagerPage /> },
      { path: 'mail', element: <MailPage /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'kanban', element: <KanbanPage /> },
      { path: 'permission', element: <PermissionDeniedPage /> },
      { path: 'blank', element: <BlankPage /> },
    ],
  },
  {
    path: 'success',
    element: (
      <LinkedInPage />
    )
  }
];
