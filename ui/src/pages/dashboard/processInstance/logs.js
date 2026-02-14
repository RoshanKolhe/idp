import { Helmet } from 'react-helmet-async';
// sections
import { ProcessInstanceLogsListView } from 'src/sections/processInstance/logs-data/view';

// ----------------------------------------------------------------------

export default function ProcessInstanceLogsListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Process Instance Logs</title>
      </Helmet>

      <ProcessInstanceLogsListView />
    </>
  );
}
