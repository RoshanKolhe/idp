import { Grid, InputAdornment, Tooltip, IconButton, MenuItem } from "@mui/material";
import { RHFSelect, RHFTextField } from "src/components/hook-form";
import Iconify from "src/components/iconify";

export default function DaysComponent() {
    const dayHourOptions = [
        { label: 'Midnight', value: 0 },
        { label: '1am', value: 1 },
        { label: '2am', value: 2 },
        { label: '3am', value: 3 },
        { label: '4am', value: 4 },
        { label: '5am', value: 5 },
        { label: '6am', value: 6 },
        { label: '7am', value: 7 },
        { label: '8am', value: 8 },
        { label: '9am', value: 9 },
        { label: '10am', value: 10 },
        { label: '11am', value: 11 },
        { label: 'Noon', value: 12 },
        { label: '1pm', value: 13 },
        { label: '2pm', value: 14 },
        { label: '3pm', value: 15 },
        { label: '4pm', value: 16 },
        { label: '5pm', value: 17 },
        { label: '6pm', value: 18 },
        { label: '7pm', value: 19 },
        { label: '8pm', value: 20 },
        { label: '9pm', value: 21 },
        { label: '10pm', value: 22 },
        { label: '11pm', value: 23 },
    ]
    return (
        <>
            <Grid item xs={12} md={6}>
                <RHFTextField
                    type="number"
                    name="daysBetween"
                    label="Days Between Triggers"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Tooltip title="Number of days between each workflow trigger">
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
                <RHFSelect
                    type="number"
                    name="dayHour"
                    label="Trigger at Hour"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment sx={{mr: 3}} position="end">
                                <Tooltip title="The hour of the day to trigger">
                                    <IconButton edge="end">
                                        <Iconify icon="mdi:information-outline" fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </InputAdornment>
                        ),
                    }}
                >
                    {dayHourOptions.length > 0 && dayHourOptions.map((dayHour) => (
                        <MenuItem key={dayHour.value} value={dayHour.value}>{dayHour.label}</MenuItem>
                    ))}
                </ RHFSelect>
            </Grid>
            <Grid item xs={12} md={12}>
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
