import { Helmet } from 'react-helmet-async';
import { NotificationSettingListView } from 'src/sections/notification-setting/view';



// sections


// ----------------------------------------------------------------------

export default function NotificationSettingListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Notification Setting List</title>
      </Helmet>
       <NotificationSettingListView/>
     
    </>
  );
}
