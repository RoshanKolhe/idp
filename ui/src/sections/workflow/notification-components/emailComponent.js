import { useState } from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { Chip, Grid, TextField } from "@mui/material";
import { RHFAutocomplete, RHFEditor, RHFTextField } from "src/components/hook-form";
import { CustomWorkflowVariablePopover } from "../components";

export default function EmailComponent({variables = []}) {
    const { setValue, getValues } = useFormContext();
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
                <RHFAutocomplete
                    name="to"
                    label="To"
                    multiple
                    freeSolo
                    disableCloseOnSelect
                    options={[]}
                    onFocus={(e) => handleFocus(e, "to")}
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
                <RHFTextField
                    name="subject"
                    label="Subject"
                    onFocus={(e) => handleFocus(e, "subject")}
                />
            </Grid>

            <Grid item xs={12} md={12}>
                <RHFEditor
                    name="body"
                    onFocus={(e) => handleFocus(e, "body")}
                />
            </Grid>

            <CustomWorkflowVariablePopover
                open={popoverOpen}
                handleClose={handleSelectVariable}
                anchorEl={anchorEl}
                variables={variables}
            />
        </>
    );
}

EmailComponent.propTypes = {
    variables : PropTypes.array
}
