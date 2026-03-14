import {Helmet} from 'react-helmet-async';
import {WorkflowTemplateListView} from 'src/sections/workflow-templates/view';

export default function WorkflowTemplateListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Workflow Template List</title>
      </Helmet>
      <WorkflowTemplateListView />
    </>
  );
}
