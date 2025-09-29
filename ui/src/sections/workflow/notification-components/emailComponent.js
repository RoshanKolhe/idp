import { Chip, Grid, TextField } from "@mui/material";
import { RHFAutocomplete, RHFEditor, RHFTextField } from "src/components/hook-form";

export default function EmailComponent() {
    return (
        <>
            <Grid item xs={12} md={6}>
                <RHFAutocomplete
                    name="to"
                    label="To"
                    multiple
                    freeSolo
                    disableCloseOnSelect
                    options={[]}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip
                                key={index}
                                variant="outlined"
                                label={option}
                                {...getTagProps({ index })}
                            />
                        ))
                    }
                    renderInput={(params) => (
                        <TextField {...params} label="To" placeholder="Add email" />
                    )}
                />
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