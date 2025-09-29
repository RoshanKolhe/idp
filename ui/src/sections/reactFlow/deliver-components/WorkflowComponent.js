import { Grid, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useGetWorkflowWithFilter } from "src/api/workflow";
import { RHFSelect } from "src/components/hook-form";

export default function WorkflowComponent() {
    const [tableData, setTableData] = useState([]);
    const filter = {
        where: {
            isActive: true,
            isDeleted: false
        }
    };
    const filterString = encodeURIComponent(JSON.stringify(filter));
    const { filteredWorkflows, filteredWorkflowsEmpty } = useGetWorkflowWithFilter(filterString);
    const {watch, setValue} = useFormContext();
    const values = watch();

    useEffect(() => {
        if (filteredWorkflows && !filteredWorkflowsEmpty) {
            setTableData(filteredWorkflows);
        }
    }, [filteredWorkflows, filteredWorkflowsEmpty]);

    useEffect(() => {
        if(values.workflowId){
            const workflowName = tableData.find((workflow) => workflow?.id === values.workflowId)?.name || '';
            setValue('workflowName', workflowName);
        }
    }, [values.workflowId, setValue, tableData])

    return (
        <Grid item xs={12} md={6}>
            <RHFSelect name='workflowId' label='workflow'>
                {tableData.length > 0 ? tableData.map((workflow) => (
                    <MenuItem key={workflow?.id} value={workflow?.id}>{workflow?.name}</MenuItem>
                )) : (
                    <MenuItem value=''>No workflows available</MenuItem>
                )}
            </RHFSelect>
        </Grid>
    )
}