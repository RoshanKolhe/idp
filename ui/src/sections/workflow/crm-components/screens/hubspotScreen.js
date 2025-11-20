import PropTypes from "prop-types"
import { useFormContext } from "react-hook-form"
import { Grid, MenuItem, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { RHFSelect } from "src/components/hook-form";
import { HubSpotConnection, HubSpotContactScreen } from "../hubspot";
import { CRMPromptField, CRMPromptToggle } from "../components";

// switch case functions
function Switch({ opt, variables }) {
    let component;

    switch (opt) {
        case 1:
            component = <HubSpotContactScreen variables={variables} />;
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

export default function HubSpotScreen({ variables}) {
    const { watch, formState: { isSubmitting } } = useFormContext();
    const values = watch();
    const hubSpotOptions = [
        { label: 'Contacts', value: 1 },
        { label: 'Companies', value: 2 },
        { label: 'Deals', value: 3 },
        { label: 'Tickets', value: 4 },
        { label: 'Orders', value: 5 }
    ];

    return (
        <>
            {(values.connectionDetails && values.connectionDetails.length > 0 && values.selectedConnection) ? (
                <>
                    <Grid item xs={12} md={12}>
                        <HubSpotConnection />
                    </Grid>

                    <CRMPromptToggle />

                    {values.valueRef === 0 ?
                        (
                            <>
                                <Grid item xs={12} md={12}>
                                    <RHFSelect name='hubspotTask' label='Select The Task'>
                                        {hubSpotOptions?.map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                        ))}
                                    </RHFSelect>
                                </Grid>

                                <Switch opt={values.hubspotTask} variables={variables} />
                            </>
                        ) :
                        (
                            <CRMPromptField variables={variables} />
                        )
                    }

                    <Stack alignItems="flex-end" sx={{ mt: 3, display: 'flex', alignItems: 'flex-end', gap: '10px', width: '100%' }}>
                        <LoadingButton sx={{ backgroundColor: "black" }} type="submit" variant="contained" loading={isSubmitting}>
                            Save
                        </LoadingButton>
                    </Stack>
                </>
            ) : (
                <HubSpotConnection />
            )}
        </>
    )
}

HubSpotScreen.propTypes = {
    variables: PropTypes.array,
}