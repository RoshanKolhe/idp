import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import {
    Box,
    Button,
    Grid,
    IconButton,
    MenuItem,
    Tooltip,
    Typography,
} from "@mui/material";
import { RHFTextField, RHFSelect } from "src/components/hook-form";
import Iconify from "src/components/iconify";

export default function APIBodyTypeFormData() {
    const { control } = useFormContext();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "formDataFields",
    });

    return (
        <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Form Data Fields (multipart/form-data)
            </Typography>

            {fields.map((item, index) => (
                <Grid
                    container
                    spacing={2}
                    key={item.id}
                    alignItems="center"
                    sx={{
                        mt: 1,
                        p: 1.5,
                    }}
                >
                    {/* Key / Field Name */}
                    <Grid item xs={3}>
                        <RHFTextField
                            name={`formDataFields.${index}.key`}
                            label="Field Name"
                            placeholder="e.g., profilePic or username"
                        />
                    </Grid>

                    {/* Field Type (text / file) */}
                    <Grid item xs={3}>
                        <RHFSelect name={`formDataFields.${index}.fieldType`} label="Field Type">
                            <MenuItem value="text">Text</MenuItem>
                            <MenuItem value="file">File</MenuItem>
                        </RHFSelect>
                    </Grid>

                    {/* Value Input — changes based on fieldType */}
                    <Grid item xs={4}>
                        <Controller
                            name={`formDataFields.${index}.value`}
                            control={control}
                            render={({ field, fieldState }) => {
                                const fieldType = field?.name?.includes(`${index}`)
                                    ? fields[index]?.fieldType
                                    : "text";

                                return fieldType === "file" ? (
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        fullWidth
                                        sx={{ textAlign: "left" }}
                                    >
                                        {field.value ? field.value.name : "Choose File"}
                                        <input
                                            type="file"
                                            hidden
                                            onChange={(e) => field.onChange(e.target.files[0])}
                                        />
                                    </Button>
                                ) : (
                                    <RHFTextField
                                        {...field}
                                        name={`formDataFields.${index}.value`}
                                        label="Value"
                                        placeholder="e.g., John Doe"
                                    />
                                );
                            }}
                        />
                    </Grid>

                    {/* Remove Button */}
                    <Grid item xs={2} textAlign="center">
                        <Tooltip title="Remove field">
                            <IconButton color="error" onClick={() => remove(index)}>
                                <Iconify icon="mdi:delete-outline" />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            ))}

            {/* Add Field Button */}
            <Box sx={{ mt: 1 }}>
                <Button
                    variant="outlined"
                    startIcon={<Iconify icon="mdi:plus" />}
                    onClick={() => append({ key: "", fieldType: "text", value: "" })}
                >
                    Add Field
                </Button>
            </Box>

            {/* Info Text */}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                💡 Tip: Use <strong>multipart/form-data</strong> when uploading files.
                <br />
                Each entry can either be a plain text field or a file.
                Example:
                <code>profilePic → File</code> &nbsp; | &nbsp; <code>username → Text</code>
            </Typography>
        </Grid>
    );
}
