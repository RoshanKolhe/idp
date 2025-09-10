import { Grid, InputAdornment, Tooltip, IconButton, MenuItem } from "@mui/material";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { RHFSelect, RHFTextField } from "src/components/hook-form";
import Iconify from "src/components/iconify";

// switch case functions
function Switch({ opt }) {
    let component;

    switch (opt) {
        case 0: // Seconds
            component = (
                <Grid item xs={12} md={12}>
                    <RHFTextField
                        type="number"
                        name="seconds"
                        label="Seconds to wait"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title="Number of seconds to wait before the next node execution">
                                        <IconButton edge="end">
                                            <Iconify icon="mdi:information-outline" fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
            );
            break;

        case 1: // Minutes
            component = (
                <Grid item xs={12} md={12}>
                    <RHFTextField
                        type="number"
                        name="minutes"
                        label="Minutes to wait"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title="Number of minutes to wait before the next node execution">
                                        <IconButton edge="end">
                                            <Iconify icon="mdi:information-outline" fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
            );
            break;

        case 2: // Hours
            component = (
                <Grid item xs={12} md={12}>
                    <RHFTextField
                        type="number"
                        name="hours"
                        label="Hours to wait"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title="Number of hours to wait before the next node execution">
                                        <IconButton edge="end">
                                            <Iconify icon="mdi:information-outline" fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
            );
            break;

        case 3: // Days
            component = (
                <Grid item xs={12} md={12}>
                    <RHFTextField
                        type="number"
                        name="days"
                        label="Days to wait"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title="Number of days to wait before the next node execution">
                                        <IconButton edge="end">
                                            <Iconify icon="mdi:information-outline" fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
            );
            break;

        default:
            component = null;
    }

    return component;
}
Switch.propTypes = {
    opt: PropTypes.number,
}

export default function IntervalComponent() {
    const { watch } = useFormContext();
    const intervalType = watch('intervalType');
    const intervalOptions = [
        { label: 'Seconds', value: 0 },
        { label: 'Minutes', value: 1 },
        { label: 'Hours', value: 2 },
        { label: 'Days', value: 3 },
    ];

    const tooltipMap = {
        0: "Choose to set the wait time in seconds",
        1: "Choose to set the wait time in minutes",
        2: "Choose to set the wait time in hours",
        3: "Choose to set the wait time in days",
    };

    return (
        <>
            <Grid item xs={12} md={12}>
                <RHFSelect
                    type="number"
                    name="intervalType"
                    label="Interval Type"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment sx={{ mr: 3 }} position="end">
                                <Tooltip title={tooltipMap[intervalType] || "Select how you want to set the wait interval"}>
                                    <IconButton edge="end">
                                        <Iconify icon="mdi:information-outline" fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </InputAdornment>
                        ),
                    }}
                >
                    {intervalOptions.length > 0 && intervalOptions.map((interval) => (
                        <MenuItem key={interval.value} value={interval.value}>{interval.label}</MenuItem>
                    ))}
                </ RHFSelect>
            </Grid>

            <Switch opt={intervalType} />
        </>
    );
}
