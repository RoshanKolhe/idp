/* eslint-disable no-shadow */
import { Box, Grid, IconButton, Stack } from "@mui/material";
import PropTypes from "prop-types"
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form"
import { RHFTextField } from "src/components/hook-form";
import Iconify from "src/components/iconify";
import { CustomWorkflowVariablePopover } from "../components";

export default function FieldsArrayKeyValueComponent({ fieldName, variables = [] }) {
    const { control, watch, setValue, getValues } = useFormContext();
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentField, setCurrentField] = useState({ name: null, ref: null });
    const { fields, append, remove } = useFieldArray({
        name: fieldName,
        control
    });

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
        <Stack spacing={2}>
            {fields.map((item, index) => (
                <Grid
                    container
                    spacing={1}
                    key={item.id}
                    alignItems="center"
                >
                    <Grid item xs={5}>
                        <RHFTextField
                            name={`${fieldName}[${index}].key`}
                            label="Key"
                            placeholder="e.g. Authorization"
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <RHFTextField
                            onFocus={(e) => handleFocus(e, `${fieldName}[${index}].value`)}
                            name={`${fieldName}[${index}].value`}
                            label="Value"
                            placeholder="e.g. Bearer token123"
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton color="error" onClick={() => remove(index)}>
                            <Iconify icon="mdi:minus-circle-outline" width={22} />
                        </IconButton>
                    </Grid>
                </Grid>
            ))}

            <Box display="flex" justifyContent="flex-end">
                <IconButton
                    color="primary"
                    onClick={() => append({ key: "", value: "" })}
                >
                    <Iconify icon="mdi:plus-circle-outline" width={24} />
                </IconButton>
            </Box>

            <CustomWorkflowVariablePopover
                open={popoverOpen}
                handleClose={handleSelectVariable}
                anchorEl={anchorEl}
                variables={variables}
            />
        </Stack>
    )
}

FieldsArrayKeyValueComponent.propTypes = {
    fieldName: PropTypes.string,
    variables: PropTypes.array,
}