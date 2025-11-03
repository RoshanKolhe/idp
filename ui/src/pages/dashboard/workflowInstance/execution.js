import { Helmet } from 'react-helmet-async';
// sections
import { WorkflowInstanceNodesLogs } from 'src/sections/workflow-Instance/logs-data/view';

// ----------------------------------------------------------------------

export default function WorkflowInstanceNodesLogsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: WorkflowInstance Execution Logs</title>
      </Helmet>

      <WorkflowInstanceNodesLogs />
    </>
  );
}
