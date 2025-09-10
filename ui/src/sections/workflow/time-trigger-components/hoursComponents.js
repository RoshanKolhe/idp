import { Grid, InputAdornment, Tooltip, IconButton } from "@mui/material";
import { RHFTextField } from "src/components/hook-form";
import Iconify from "src/components/iconify";

export default function HoursComponent() {
    return (
        <>
            <Grid item xs={12} md={6}>
                <RHFTextField
                    type="number"
                    name="hoursBetween"
                    label="Hours Between Triggers"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Tooltip title="Number of hours between each workflow trigger">
                                    <IconButton edge="end">
                                        <Iconify icon="mdi:information-outline" fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <RHFTextField
                    type="number"
                    name="minuteTrigger"
                    label="Trigger at Minute (0 - 59)"
                    InputProps={{
                        inputProps: { min: 0, max: 59 },
                        endAdornment: (
                            <InputAdornment position="end">
                                <Tooltip title="The minute past the hour to trigger (0-59)">
                                    <IconButton edge="end">
                                        <Iconify icon="mdi:information-outline" fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>
        </>
    );
}
