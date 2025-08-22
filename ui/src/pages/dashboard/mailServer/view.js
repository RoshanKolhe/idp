import { Helmet } from 'react-helmet-async';
// sections
import MailServerCreateForm from 'src/sections/mailServer/view/mailServer-view';

// ----------------------------------------------------------------------

export default function MailServerViewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Mail Server</title>
      </Helmet>

      <MailServerCreateForm />
    </>
  );
}