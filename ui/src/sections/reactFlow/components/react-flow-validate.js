import { FormControl, FormControlLabel, Radio, RadioGroup, Stack, Typography } from "@mui/material";
import { useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import * as Yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ReactFlowCustomNodeStructure from "../react-flow-custom-node";

export default function ReactFlowValidate({ data }) {
    const newValidationSchema = Yup.object().shape({
        method: Yup.string().required('Validation method is required')
    });

    const defaultValues = useMemo(
        () => ({
            method: data.bluePrint?.method || 'human',
        }),
        [data]
    );

    const methods = useForm({
        resolver: yupResolver(newValidationSchema),
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
    console.log('values', values);

    const onSubmit = handleSubmit(async (formData) => {
        console.log(formData);
        data.functions.handleBluePrintComponent(data.label, { ...formData });
    })

    useEffect(() => {
        if(values.method){
            onSubmit();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.method]);

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);
    return (
        <Stack sx={{ marginTop: 3 }} spacing={1}>
            <ReactFlowCustomNodeStructure data={data} />
            <Typography variant='h5'>4. {data.label}</Typography>

            <FormControl component="fieldset">
                <Typography variant="h5">
                    Validation Type
                </Typography>
                <RadioGroup
                    row
                    name="method"
                    value={values.method}
                    onChange={(e) => setValue('method', e.target.value)}
                    sx={{
                        display: 'flex',
                        alignItems: 'left',
                        flexDirection: 'column'
                    }}
                >
                    <FormControlLabel value="human" control={<Radio />} label="Human Validation" />
                    <FormControlLabel value="auto" control={<Radio />} label="Auto Validation" />
                </RadioGroup>
            </FormControl>
        </Stack>
    )
}

ReactFlowValidate.propTypes = {
    data: PropTypes.object
}