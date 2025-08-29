import { Helmet } from 'react-helmet-async';

import { MemberEditView } from 'src/sections/notification-setting/view';


// sections


// ----------------------------------------------------------------------

export default function MemberEditViewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Edit Member</title>
      </Helmet>

      <MemberEditView/>
    </>
  );
}
