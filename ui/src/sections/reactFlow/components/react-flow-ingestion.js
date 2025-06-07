import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Button, Grid, MenuItem, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// eslint-disable-next-line import/no-extraneous-dependencies
import FormProvider, { RHFSelect, RHFTextField } from "src/components/hook-form";
import ReactFlowCustomNodeStructure from "../react-flow-custom-node";
import { FTPComponent } from "../ingestion-components";
import CustomProcessDialogue from "./components-dialogue";

// channel options
const channelOptions = [
    {label: 'FTP', value: 'ftp', isDisabled: false},
    {label: 'API', value: 'api', isDisabled: true},
    {label: 'HTTP/HTTPS', value: 'http', isDisabled: true},
    {label: 'UI/PORTAL', value: 'ui', isDisabled: true},
]

// switch case functions
function Switch({opt, setUrl, onClose}){
    let component;

    switch(opt){
        case 'ftp':
            component = <FTPComponent setUrl={setUrl} onClose={onClose}/>;
            break;

        default :
            component = <div />
    }

    return(
        <>{component}</>
    )
}

Switch.propTypes = {
    opt : PropTypes.string,
    setUrl : PropTypes.func,
    onClose : PropTypes.func,
}

export default function ReactFlowIngestion({data}){
    const [channelType, setChannelType] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [url, setUrl] = useState('');

     const NewChannelTypeSchema = Yup.object().shape({
        channelType: Yup.string().required('Channel Type is required'),
        path: Yup.string().required("Path is required"),
      });
    
      const defaultValues = useMemo(
        () => ({
          channelType: '',
          path: ''
        }),
        []
      );
    
      const methods = useForm({
        resolver: yupResolver(NewChannelTypeSchema),
        defaultValues,
      });
    
      const {
        reset,
        watch,
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
      } = methods;

      const values = watch();

      const onSubmit = handleSubmit(async (formData) => {
        console.log(formData);
        handleCloseModal();
      })

    // Open modal
    const handleOpenModal = () => {
        setIsOpen(true);
    };

    // Close modal
    const handleCloseModal = () => {
        setIsOpen(false);
    }

    return(
        <Stack sx={{marginTop: 3}} spacing={1}>
            <ReactFlowCustomNodeStructure data={data}/>
            <Typography variant='h5'>1. {data.label}</Typography>
            <Typography variant='h6'>{values.channelType}</Typography>
            <Typography variant='body2'>{values.path}</Typography>
            <Button sx={{width: '200px', color: 'royalBlue', borderColor: 'royalBlue'}} variant='outlined' onClick={() => handleOpenModal()}>Add Channel</Button>
            <CustomProcessDialogue
                isOpen={isOpen}
                handleCloseModal={handleCloseModal}
                title='Add Channel'
            >
                <FormProvider methods={methods} onSubmit={onSubmit}>
                    <Grid sx={{marginTop: '20px'}} container spacing={1}>
                        <Grid item xs={12} md={6}>
                            <RHFSelect name='channelType' label='Channel Type'>
                                {(channelOptions && channelOptions.length) > 0 ? channelOptions.map((channel) => (
                                    <MenuItem key={channel.value} value={channel.value} disabled={channel.isDisabled}>{channel.label}</MenuItem>
                                )) : (
                                    <MenuItem value=''>No channels found</MenuItem>
                                )}
                            </RHFSelect>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            {values.channelType !== '' && <RHFTextField name='path' label='Path' />}
                            {/* <Switch opt={values.channelType} onClose={handleCloseModal} setUrl={setValue}/> */}
                        </Grid>
                    </Grid>
                    <Stack alignItems="flex-end" sx={{ mt: 3, display: 'flex', gap: '10px' }}>
                        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                            Add
                        </LoadingButton>
                        {/* <Button onClick={handleCloseModal} variant="contained">Close</Button> */}
                    </Stack>
                </FormProvider>
            </CustomProcessDialogue>
        </Stack>
    )
}

ReactFlowIngestion.propTypes = {
    data : PropTypes.object
}