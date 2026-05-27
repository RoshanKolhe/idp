import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Button, Grid, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types"
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import FormProvider, { RHFUpload } from "src/components/hook-form";
import { useSnackbar } from "src/components/snackbar";
import axiosInstance from "src/utils/axios";
import * as Yup from 'yup';

export default function ProcessInstanceUploadDoc({ handleClose, data }) {
    const [isUploadingFiles, setIsUploadingFiles] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const fetchDocs = async (foldername) => {
        try {
            const response = await axiosInstance.get(`/files/${foldername}`);
            const filesArray = response?.data ?? [];

            const filesData = filesArray.map(
                (file) => `${process.env.REACT_APP_HOST_API}/files/file/${foldername}/${file}`
            );

            setValue('files', filesData);
        } catch (error) {
            console.error('Error while fetching docs', error);
        }
    };

    useEffect(() => {
        if (data) {
            fetchDocs(data?.processInstanceFolderName);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const newFileUploadSchema = Yup.object().shape({
        files: Yup.array().of(Yup.mixed()).min(1, 'Atleast upload 1 file'),
    });

    const defaultValues = useMemo(
        () => ({
            files: [],
        }),
        []
    );

    const methods = useForm({
        resolver: yupResolver(newFileUploadSchema),
        defaultValues,
    });

    const {
        watch,
        setValue,
        getValues,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    const onSubmit = handleSubmit(async (formData) => {
        try {
            console.log(formData);
            handleClose();
        } catch (error) {
            console.error('Error while storing files', error)
        }
    })

    const handleDrop = useCallback(
        async (acceptedFiles) => {
            console.log(acceptedFiles);
            if (!acceptedFiles.length) return;
            const formData = new FormData();
            acceptedFiles.forEach((file) => {
                formData.append('files[]', file);
            });
            try {
                setIsUploadingFiles(true);
                const response = await axiosInstance.post(`/files/${data?.processInstanceFolderName}`, formData);
                const newFiles = response?.data.files.map((res) => res.fileUrl);

                const currentFiles = getValues('files') || [];

                setValue('files', [...currentFiles, ...newFiles], {
                    shouldValidate: true,
                });
                enqueueSnackbar('Files uploaded successfully');
            } catch (err) {
                console.error('Error uploading files:', err);
                enqueueSnackbar(err?.error?.message || 'Error uploading files', {
                    variant: 'error',
                });
            } finally {
                setIsUploadingFiles(false);
            }
        },
        [data, enqueueSnackbar, getValues, setValue]
    );

    const handleRemoveFile = useCallback(
        (inputFile) => {
            const filtered = values.files && values.files?.filter((file) => file !== inputFile);
            setValue('files', filtered);
        },
        [setValue, values.files]
    );

    const handleRemoveAllFiles = useCallback(() => {
        setValue('files', []);
    }, [setValue]);

    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={1}>
                <Grid item xs={12} md={12}>
                    <Typography sx={{ mb: 2 }} variant="body1">{`Upload Documents for ${data?.processInstanceName}`}</Typography>
                    <RHFUpload
                        multiple
                        thumbnail
                        name="files"
                        disabled={isUploadingFiles}
                        loading={isUploadingFiles}
                        loadingText="Uploading files. Large files can take a moment..."
                        maxSize={104857600}
                        accept={{
                            'application/pdf': [],
                            'image/*': [],
                            'application/msword': [],
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
                        }}
                        onDrop={handleDrop}
                        onRemove={isUploadingFiles ? undefined : handleRemoveFile}
                        onRemoveAll={isUploadingFiles ? undefined : handleRemoveAllFiles}
                        sx={{ mb: 3 }}
                    />
                </Grid>
            </Grid>
            <Stack direction='row' spacing={1} sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <LoadingButton type="submit" variant="contained" color='primary' loading={isSubmitting || isUploadingFiles}>
                    Upload
                </LoadingButton>
                <Button onClick={handleClose} variant="outlined" color='primary' disabled={isUploadingFiles}>Close</Button>
            </Stack>
        </FormProvider>
    )
}

ProcessInstanceUploadDoc.propTypes = {
    handleClose: PropTypes.func,
    data: PropTypes.object
}
