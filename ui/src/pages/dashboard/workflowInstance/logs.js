import { Helmet } from 'react-helmet-async';
// sections
import { WorkflowInstanceLogsListView } from 'src/sections/workflow-Instance/logs-data/view';

// ----------------------------------------------------------------------

export default function WorkflowInstanceLogsListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: WorkflowInstance Logs</title>
      </Helmet>

      <WorkflowInstanceLogsListView />
    </>
  );
}
