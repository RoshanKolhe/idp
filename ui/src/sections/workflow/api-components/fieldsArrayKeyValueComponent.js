import { Box, Grid, IconButton, Stack } from "@mui/material";
import PropTypes from "prop-types"
import { useFieldArray, useFormContext } from "react-hook-form"
import { RHFTextField } from "src/components/hook-form";
import Iconify from "src/components/iconify";

export default function FieldsArrayKeyValueComponent({fieldName}) {
    const {control, watch} = useFormContext();
    const {fields, append, remove} = useFieldArray({
        name: fieldName,
        control
    });

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
        </Stack>
    )
}

FieldsArrayKeyValueComponent.propTypes = {
    fieldName: PropTypes.string,
}