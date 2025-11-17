import { Grid, MenuItem } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { RHFSelect, RHFTextField } from "src/components/hook-form";
import { CustomWorkflowVariablePopover } from "src/sections/workflow/components";

const lifecycleStageOptions = [
    { label: 'Subscriber', value: 'subscriber' },
    { label: 'Lead', value: 'lead' },
    { label: 'Marketing Qualified Lead', value: 'marketingQualifiedlead' },
    { label: 'Sales Qualified Lead', value: 'salesqualifiedlead' },
    { label: 'Opportunity', value: 'opportunity' },
    { label: 'Customer', value: 'customer' },
    { label: 'Evangelist', value: 'evangelist' },
    { label: 'Other', value: 'other' },
];

const leadStatusOptions = [
    { label: 'New', value: 'NEW' },
    { label: 'Open', value: 'OPEN' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Open Deal', value: 'OPEN_DEAL' },
    { label: 'Unqualified', value: 'UNQUALIFIED' },
    { label: 'Attemptrd To Contact', value: 'ATTEMPTED_TO_CONTACT' },
    { label: 'Connected', value: 'CONNECTED' },
    { label: 'Bad Timing', value: 'BAD_TIMING' },
];

export default function HubSpotUpdateContact({ variables }) {
    const { watch, setValue, getValues } = useFormContext();
    const values = watch();
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentField, setCurrentField] = useState({ name: null, ref: null });

    const handleFocus = (e, fieldName) => {
        setCurrentField({ name: fieldName, ref: e.target });
        setAnchorEl(e.target);
        setPopoverOpen(true);
    };

    const handleSelectVariable = (variable) => {
        if (!variable || !currentField.name) {
            setPopoverOpen(false);
            return;
        }

        const fieldName = currentField.name;

        if (fieldName === "body") {
            const currentVal = getValues("body") || "";
            setValue("body", `${currentVal}{{${variable}}}`, { shouldValidate: true, shouldDirty: true });
        } else if (fieldName === "to") {
            const currentArr = getValues("to") || [];
            setValue("to", [...currentArr, `{{${variable}}}`], { shouldValidate: true, shouldDirty: true });
        } else {
            // Normal TextField
            const input = currentField.ref;
            const start = input.selectionStart;
            const end = input.selectionEnd;
            const text = input.value;
            const before = text.substring(0, start);
            const after = text.substring(end, text.length);
            const newValue = `${before}{{${variable}}}${after}`;
            input.value = newValue;
            // eslint-disable-next-line no-multi-assign
            input.selectionStart = input.selectionEnd = start + variable.length + 4; // 4 for {{}}
            input.dispatchEvent(new Event('input', { bubbles: true }));
            setValue(fieldName, newValue, { shouldValidate: true, shouldDirty: true });
        }

        setPopoverOpen(false);
    };

    return (
        <>
            <Grid item xs={12} md={6}>
                <RHFTextField onFocus={(e) => handleFocus(e, "contactDetails.firstname")} name='contactDetails.firstname' label='Firstname' />
            </Grid>

            <Grid item xs={12} md={6}>
                <RHFTextField onFocus={(e) => handleFocus(e, "contactDetails.lastname")} name='contactDetails.lastname' label='Lastname' />
            </Grid>

            <Grid item xs={12} md={6}>
                <RHFTextField onFocus={(e) => handleFocus(e, "contactDetails.email")} name='contactDetails.email' label='Email' />
            </Grid>

            <Grid item xs={12} md={6}>
                <RHFTextField onFocus={(e) => handleFocus(e, "contactDetails.phone")} name='contactDetails.phone' label='Phone Number' />
            </Grid>

            <Grid item xs={12} md={6}>
                <RHFSelect name='contactDetails.lifecycle_stage' label='Lifecycle Stage' >
                    {
                        lifecycleStageOptions.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                        ))
                    }
                </RHFSelect>
            </Grid>

            <Grid item xs={12} md={6}>
                <RHFSelect name='contactDetails.lead_status' label='Lead Status' >
                    {
                        leadStatusOptions.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                        ))
                    }
                </RHFSelect>
            </Grid>

            <CustomWorkflowVariablePopover
                open={popoverOpen}
                handleClose={handleSelectVariable}
                anchorEl={anchorEl}
                variables={variables}
            />
        </>
    )
}

HubSpotUpdateContact.propTypes = {
    variables: PropTypes.array
}