import { Helmet } from 'react-helmet-async';

import {NotificationSettingListView} from 'src/sections/notification-setting/view'




// sections


// ----------------------------------------------------------------------

export default function EscalationNotificationSettingListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Notification Setting List View</title>
      </Helmet>
       {/* <NotificationSettingListView/> */}
       <NotificationSettingListView/>
     
    </>
  );
}
