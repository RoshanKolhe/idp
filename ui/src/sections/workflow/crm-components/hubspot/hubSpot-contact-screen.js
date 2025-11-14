import { useFormContext } from "react-hook-form";
import PropTypes from "prop-types";
import { RHFSelect } from "src/components/hook-form";
import { Grid, MenuItem } from "@mui/material";
import { HubSpotCreateContact } from "./contacts";

// switch case functions
function Switch({ opt, variables }) {
    let component;

    switch (opt) {
        case 3:
            component = <HubSpotCreateContact variables={variables} />;
            break;

        default:
            component = <div />
    }

    return (
        <>{component}</>
    )
}
Switch.propTypes = {
    opt: PropTypes.number,
    variables: PropTypes.array
}

export default function HubSpotContactScreen({ variables }) {
    const { watch } = useFormContext();
    const values = watch();
    const hubSpotContactTaskOptions = [
        { label: 'Get Contacts', value: 1 },
        { label: 'Search Contact', value: 2 },
        { label: 'Create New Contact', value: 3 },
        { label: 'Update Contact', value: 4 },
        { label: 'Delete Contact', value: 5 },
    ];

    return (
        <>
            <Grid item xs={12} md={12}>
                <RHFSelect name='contactTask' label='Select The Contact Task'>
                    {hubSpotContactTaskOptions?.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                </RHFSelect>
            </Grid>

            <Switch opt={values.contactTask} variables={variables} />
        </>
    )
}

HubSpotContactScreen.propTypes = {
    variables: PropTypes.array
}