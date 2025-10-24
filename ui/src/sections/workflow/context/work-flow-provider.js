import { useMemo, useState } from "react";
import PropTypes from "prop-types"
import { WorkflowContext } from "./work-flow-context";

export function WorkflowProvider({ children }) {
    const [workflowDirection, setWorkflowDirection] = useState('TB');

    const memorizedValues = useMemo(() => ({
        workflowDirection,
        setWorkflowDirection
    }), [workflowDirection]);

    return <WorkflowContext.Provider value={memorizedValues}>{children}</WorkflowContext.Provider>;
}

WorkflowProvider.propTypes = {
    children: PropTypes.node
}