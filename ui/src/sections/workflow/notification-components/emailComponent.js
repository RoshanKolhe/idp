import { Grid } from "@mui/material";
import { RHFEditor, RHFTextField } from "src/components/hook-form";

export default function EmailComponent() {
    return (
        <>
            <Grid item xs={12} md={6}>
                <RHFTextField name='to' label='To' />
            </Grid>

            <Grid item xs={12} md={6}>
                <RHFTextField name='subject' label='Subject' />
            </Grid>

            <Grid item xs={12} md={12}>
                <RHFEditor name='body' />
            </Grid>
        </>
    )
}