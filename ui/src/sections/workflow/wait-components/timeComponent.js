import { Grid } from "@mui/material";
import { RHFDateTimePicker } from "src/components/hook-form";

export default function TimeComponent() {
    return (
        <Grid item xs={12} md={12}>
            <RHFDateTimePicker
                name="dateAndTime"
                label="Date & Time"
                tooltip="Workflow will execute at the specified date and time"
            />
        </Grid>
    );
}
