import { useFieldArray, useFormContext } from "react-hook-form";
import { Box, Button, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import Iconify from "src/components/iconify";
import { RHFTextField } from "src/components/hook-form";

export default function APIBodyTypeUrlEncoded() {
    const { control } = useFormContext();

    // Manage dynamic key-value pairs
    const { fields, append, remove } = useFieldArray({
        control,
        name: "urlEncodedFields",
    });

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
