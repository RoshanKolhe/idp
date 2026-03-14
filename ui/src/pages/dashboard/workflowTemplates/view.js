import {Helmet} from 'react-helmet-async';
import WorkflowTemplateView from 'src/sections/workflow-templates/view/workflow-template-view';

export default function WorkflowTemplateViewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Workflow Template View</title>
      </Helmet>
      <WorkflowTemplateView />
    </>
  );
}
