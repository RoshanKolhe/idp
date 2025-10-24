import { useContext } from "react";
import { WorkflowContext } from "../context/work-flow-context";

export const useWorkflowContext = () => {
  const context = useContext(WorkflowContext);

  if (!context) throw new Error('useWorkflowContext context must be use inside WorkFlowProvider');

  return context;
};