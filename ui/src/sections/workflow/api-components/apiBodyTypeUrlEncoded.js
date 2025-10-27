import { useFieldArray, useFormContext } from "react-hook-form";
import { Box, Button, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import Iconify from "src/components/iconify";
import { RHFTextField } from "src/components/hook-form";
import PropTypes from "prop-types";
import { useState } from "react";
import { CustomWorkflowVariablePopover } from "../components";

export default function APIBodyTypeUrlEncoded({ variables = [] }) {
    const { control, setValue, getValues } = useFormContext();
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentField, setCurrentField] = useState({ name: null, ref: null });

    // Manage dynamic key-value pairs
    const { fields, append, remove } = useFieldArray({
        control,
        name: "urlEncodedFields",
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
        <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                URL-Encoded Fields
            </Typography>

            {fields.map((item, index) => (
                <Grid
                    container
                    spacing={2}
                    key={item.id}
                    alignItems="center"
                    sx={{
                        mt: 1,
                    }}
                >
                    <Grid item xs={5}>
                        <RHFTextField
                            name={`urlEncodedFields.${index}.key`}
                            label="Key"
                            placeholder="e.g., userId"
                        />
                    </Grid>

                    <Grid item xs={5}>
                        <RHFTextField
                            onFocus={(e) => handleFocus(e, `urlEncodedFields.${index}.value`)}
                            name={`urlEncodedFields.${index}.value`}
                            label="Value"
                            placeholder="e.g., 12345"
                        />
                    </Grid>

                    <Grid item xs={2} textAlign="center">
                        <Tooltip title="Remove field">
                            <IconButton color="error" onClick={() => remove(index)}>
                                <Iconify icon="mdi:delete-outline" />
                            </IconButton>
                        </Tooltip>
                    </Grid>

                    <CustomWorkflowVariablePopover
                        open={popoverOpen}
                        handleClose={handleSelectVariable}
                        anchorEl={anchorEl}
                        variables={variables}
                    />
                </Grid>
            ))}

            <Box sx={{ mt: 1 }}>
                <Button
                    variant="outlined"
                    startIcon={<Iconify icon="mdi:plus" />}
                    onClick={() => append({ key: "", value: "" })}
                >
                    Add Field
                </Button>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                💡 Tip: Use this for <strong>x-www-form-urlencoded</strong> body types.
                Each key–value pair will be automatically encoded like:
                <code>userId=12345&amp;status=active</code>
            </Typography>
        </Grid>
    );
}

APIBodyTypeUrlEncoded.propTypes = {
    variables: PropTypes.array
}