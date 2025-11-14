import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// locales
import { useLocales } from 'src/locales';
// components
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  settings: icon('ic_settings'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  processes: icon('ic_processes'),
  processInstance: icon('ic_process_instance'),
  mailServer: icon('ic_mail'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useLocales();

  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: t('overview'),
        items: [
          { title: t('Dashboard'), path: paths.dashboard.root, icon: ICONS.dashboard },
          { title: t('Processes'), path: paths.dashboard.processes.root, icon: ICONS.processes },
          { title: t('Process Instance'), path: paths.dashboard.processesInstance.root, icon: ICONS.processInstance },
          { title: t('workflow'), path: paths.dashboard.workflow.root, icon: ICONS.processInstance },
          { title: t('Workflow Instance'), path: paths.dashboard.workflowInstance.root, icon: ICONS.processInstance },
          {
            title: t('Settings'),
            path: paths.dashboard.processType.list,
            icon: ICONS.settings,
            roles: ['super_admin', 'admin', 'company'],
            children: [
              {
                title: t('Process Types'),
                path: paths.dashboard.processType.list,
                roles: ['super_admin'],
              },
              {
                title: t('Document Types'),
                path: paths.dashboard.documentType.list,
                roles: ['super_admin'],
              },
              {
                title: t('File Types'),
                path: paths.dashboard.fileType.list,
                roles: ['super_admin'],
              },
              {
                title: t('Notification Setting'),
                path: paths.dashboard.notificationSetting.list,
                roles: ['super_admin', 'company', 'admin'],
              },
              {
                title: t(' Mail Server '),
                path: paths.dashboard.mailServer.root,
                roles: ['super_admin'],
              },
            ],
          },
        ],
      },

      // SETTINGS
      // ----------------------------------------------------------------------
      // {
      //   subheader: t('settings'),
      //   items: [
      //     // PROCESS TYPE
      //     {
      //       title: t('Process Types'),
      //       path: paths.dashboard.processType.root,
      //       icon: ICONS.processType,
      //       roles: ['admin'],
      //       children: [
      //         {
      //           title: t('list'),
      //           path: paths.dashboard.processType.list,
      //           roles: ['admin'],
      //         },
      //         {
      //           title: t('create'),
      //           path: paths.dashboard.processType.new,
      //           roles: ['admin'],
      //         },
      //       ],
      //     },
      //   ],
      // },
    ],
    [t]
  );

  return data;
}
