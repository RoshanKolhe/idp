import { Helmet } from 'react-helmet-async';
import { AddMemberCreateView } from 'src/sections/notification-setting/view';

// sections


// ----------------------------------------------------------------------

export default function NewLevelCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new Level</title>
      </Helmet>

      <AddMemberCreateView />
    </>
  );
}
