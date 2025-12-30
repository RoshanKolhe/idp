import { Grid, MenuItem } from "@mui/material";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form"
import { RHFSelect } from "src/components/hook-form";
import WaitDelaySetting from "./wait-delay-setting";

const waitOptions = [
    { label: 'Delay', value: 'delay' },
    { label: 'Action', value: 'action' }
];

function Switch({ opt }) {
    let component;

    switch (opt) {
        case 'delay':
            component = <WaitDelaySetting />;
            break;

        case 'action':
            component = <div />;
            break;

        default:
            component = <div />
    }

    return (
        <>{component}</>
    )
}
Switch.propTypes = {
    opt: PropTypes.string
}

export default function WaitSettingParentView() {
    const { watch } = useFormContext();
    const values = watch();

    return (
        <>
            <Grid item xs={12} md={12}>
                <RHFSelect name='waitType' label='Wait type'>
                    {waitOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                </RHFSelect>
            </Grid>

            <Switch opt={values.waitType} />
        </>
    )
}
