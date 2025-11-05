/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFAutocomplete,
} from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';
import ProcessInstanceUploadDoc from './component/processInstance-upload-doc';
import ProcessInstanceCredentials from './component/processInstance-api-section';

// ----------------------------------------------------------------------

function SwitchComponent({ channelType, extraDetails }) {
  switch (channelType) {
    case 'ui':
      return <ProcessInstanceUploadDoc handleClose={extraDetails?.handleClose} data={extraDetails?.processInstanceData} />;

    case 'api':
      return <ProcessInstanceCredentials handleClose={extraDetails?.handleClose} data={extraDetails?.processInstanceData}/>;

    default:
      return null;
  }
}
SwitchComponent.propTypes = {
  channelType: PropTypes.string,
  extraDetails: PropTypes.object
}


export default function ProcessInstanceNewEditForm({ currentProcessInstance }) {
  const router = useRouter();
  const [processesData, setProcessesData] = useState([]);
  const [channelType, setChannelType] = useState('');
  const [extraDetailsData, setExtraDetailsData] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const NewProcessTypeSchema = Yup.object().shape({
    processInstanceName: Yup.string().required('Process Type is required'),
    processInstanceDescription: Yup.string(),
    processes: Yup.object().required("Please select process"),
  });

  const defaultValues = useMemo(
    () => ({
      processInstanceName: currentProcessInstance?.processInstanceName || '',
      processInstanceDescription: currentProcessInstance?.processInstanceDescription || '',
      processes: null,
    }),
    [currentProcessInstance]
  );

  const methods = useForm({
    resolver: yupResolver(NewProcessTypeSchema),
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
    try {
      console.info('DATA', formData);

      const inputData = {
        processInstanceName: formData.processInstanceName,
        processInstanceDescription: formData.processInstanceDescription,
        processesId: formData.processes.id,
        isInstanceRunning: false,
        isActive: currentProcessInstance ? formData.isActive : true,
      };

      let response;
      if (!currentProcessInstance) {
        response = await axiosInstance.post('/process-instances', inputData);
      } else {
        await axiosInstance.patch(`/process-instances/${currentProcessInstance.id}`, inputData);
        reset();
        enqueueSnackbar(currentProcessInstance ? 'Update success!' : 'Create success!');
        router.push(paths.dashboard.processesInstance.list);
      }

      if (response?.data) {
        const processData = response.data;
        const bluePrint = processData?.processes?.bluePrint?.bluePrint ?? [];

        const ingestionNode = bluePrint?.find((node) => node?.nodeName === 'Ingestion');

        enqueueSnackbar(currentProcessInstance ? 'Update success!' : 'Create success!');

        if ((ingestionNode?.component?.channelType === 'ui' || ingestionNode?.component?.channelType === 'api')) {
          setChannelType(ingestionNode?.component?.channelType ? ingestionNode?.component?.channelType : '');
          setExtraDetailsData(
            {
              handleClose,
              processInstanceData: processData
            }
          );
        } else {
          reset();
          router.push(paths.dashboard.processesInstance.list);
        }
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : error.error.message, {
        variant: 'error',
      });
    }
  });

  const handleClose = useCallback(() => {
    reset();
    router.push(paths.dashboard.processesInstance.list);
    setChannelType('');
    setExtraDetailsData(null);
  }, [reset, router])

  useEffect(() => {
    if (currentProcessInstance) {
      reset(defaultValues);
      setValue('processes', currentProcessInstance?.processes ? currentProcessInstance?.processes : null);
      setProcessesData((prev) => [...prev, currentProcessInstance?.processes]);
    }
  }, [currentProcessInstance, defaultValues, reset, setValue]);

  useEffect(() => {
    if (currentProcessInstance) {
      const bluePrint = currentProcessInstance?.processes?.bluePrint?.bluePrint ?? [];
      const ingestionNode = bluePrint?.find((node) => node?.nodeName === 'Ingestion');

      if ((ingestionNode?.component?.channelType === 'ui' || ingestionNode?.component?.channelType === 'api')) {
        setChannelType(ingestionNode?.component?.channelType ? ingestionNode?.component?.channelType : '');
        setExtraDetailsData(
          {
            handleClose,
            processInstanceData: currentProcessInstance
          }
        );
      }
    }
  }, [currentProcessInstance, handleClose])

  const fetchProcesses = async (searchTerm) => {
    try {
      console.log(searchTerm);
      if (searchTerm.length > 0) {
        const filter = {
          where: {
            and:[
             { name: { like: `%${searchTerm || ''}%` } },
            {isActive:true} 
            ]
          }
        }
        const filterString = encodeURIComponent(JSON.stringify(filter));
        const { data } = await axiosInstance.get(`/processes?filter=${filterString}`);
        setProcessesData(data);
      };
    } catch (error) {
      console.error('error while fetching processes', error);
    }
  }

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <RHFTextField name="processInstanceName" label="Process Instance Name" />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <RHFAutocomplete
                    name="processes"
                    label="Select Process *"
                    options={processesData || []}
                    onInputChange={(event) => fetchProcesses(event?.target?.value)}
                    getOptionLabel={(option) => `${option?.name}` || ''}
                    isOptionEqualToValue={(option, value) => option?.id === value.id}
                    filterOptions={(options, { inputValue }) =>
                      options?.filter((option) => option?.name?.toLowerCase().includes(inputValue?.toLowerCase()))
                    }
                    renderOption={(props, option) => (
                      <li {...props}>
                        <div>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {`${option?.name}`}
                          </Typography>
                        </div>
                      </li>
                    )}

                  />
                </Grid>

                <Grid item xs={12} sm={12}>
                  <RHFTextField multiline rows={3} name="processInstanceDescription" label="Process Instance Description" />
                </Grid>
              </Grid>

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                {((!currentProcessInstance && channelType === '') || (currentProcessInstance)) && <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!currentProcessInstance ? 'Create Process Instance' : 'Save Changes'}
                </LoadingButton>}
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
      <Box component='div' sx={{ mt: 2 }}>
        <SwitchComponent channelType={channelType} extraDetails={extraDetailsData} />
      </Box>
    </>
  );
}

ProcessInstanceNewEditForm.propTypes = {
  currentProcessInstance: PropTypes.object,
};
