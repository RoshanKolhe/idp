import {Helmet} from 'react-helmet-async';
import {WorkflowTemplateCreateView} from 'src/sections/workflow-templates/view';

export default function WorkflowTemplateCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create Workflow Template</title>
      </Helmet>
      <WorkflowTemplateCreateView />
    </>
  );
}
