import {Helmet} from 'react-helmet-async';
import {WorkflowTemplateEditView} from 'src/sections/workflow-templates/view';

export default function WorkflowTemplateEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Workflow Template Edit</title>
      </Helmet>
      <WorkflowTemplateEditView />
    </>
  );
}
