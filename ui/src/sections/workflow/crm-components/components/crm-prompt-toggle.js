import { Grid, Switch, FormControlLabel, Box } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

export default function CRMPromptToggle() {
    const { control } = useFormContext();

    return (
        <Grid item xs={12} md={12}>
            <Box
                component='div'
                sx={{
                    width: '100%',
                    textAlign: 'right'
                }}
            >
                <Controller
                    name="valueRef"
                    control={control}
                    defaultValue={0}
                    render={({ field }) => (
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={field.value === 1}
                                    onChange={(e) => field.onChange(e.target.checked ? 1 : 0)}
                                />
                            }
                            label={field.value === 1 ? "Prompt" : "Config"}
                        />
                    )}
                />
            </Box>
        </Grid>
    );
}
