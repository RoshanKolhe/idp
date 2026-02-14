import {
    Button,
    Stack,
    Typography,
    Divider,
    Grid,
    MenuItem,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useMemo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router";
import { useParams } from "src/routes/hook";
import FormProvider, { RHFSelect } from "src/components/hook-form";
import ReactFlowCustomNodeStructure from "../react-flow-custom-node";
import LogsProcessDialogue from "./logs-dialogue";
import CustomProcessDialogue from "./components-dialogue";

const OCR_OPTIONS = [
    {
        label: "Tesseract OCR",
        value: "tesseract",
        category: "Open Source",
        description:
            "Fast, open-source OCR suitable for most printed documents like invoices, forms, and reports.",
        recommended: true,
        disabled: false,
    },
    {
        label: "EasyOCR",
        value: "easyocr",
        category: "Open Source / Deep Learning",
        description:
            "Deep learning-based OCR with better accuracy on low-quality scans and mixed fonts. Uses more system resources.",
        recommended: false,
        disabled: false, // you can set true if backend not ready
    },
    {
        label: "AWS Textract",
        value: "aws_textract",
        category: "Cloud / Enterprise",
        description:
            "High-accuracy OCR for scanned documents, forms, and tables. Requires AWS configuration.",
        disabled: true,
    },
    {
        label: "Google Vision OCR",
        value: "google_vision",
        category: "Cloud / Enterprise",
        description:
            "Cloud-based OCR with strong multilingual and layout detection capabilities.",
        disabled: true,
    },
    {
        label: "Azure Vision OCR",
        value: "azure_vision",
        category: "Cloud / Enterprise",
        description:
            "Microsoft Azure OCR optimized for business and identity documents.",
        disabled: true,
    },
    {
        label: "PaddleOCR",
        value: "paddle_ocr",
        category: "Advanced / ML-based",
        description:
            "High-accuracy OCR for complex layouts and Asian languages. Resource intensive.",
        disabled: true,
    },
];

export default function ReactFlowImageProcessing({ data }) {
    const navigate = useNavigate();
    const params = useParams();
    const { id } = params;
    const [isOpen, setIsOpen] = useState(false);
    const [logsOpen, setLogsOpen] = useState(false);

    /* ---------------- Validation Schema ---------------- */
    const validationSchema = Yup.object().shape({
        ocr_engine: Yup.string().required("OCR engine is required"),
        language_mode: Yup.string().required("Language detection mode is required"),
        ai_cleanup: Yup.string().required("AI cleanup selection is required"),
    });

    /* ---------------- Default Values ---------------- */
    const defaultValues = useMemo(
        () => ({
            ocr_engine: data?.bluePrint?.ocr_engine || "tesseract",
            language_mode: data?.bluePrint?.language_mode || "auto",
            ai_cleanup:
                data?.bluePrint?.ai_cleanup !== undefined
                    ? String(data?.bluePrint.ai_cleanup)
                    : "true",
        }),
        [data]
    );

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        setValue,
        handleSubmit,
    } = methods;

    const values = watch();

    const onSubmit = handleSubmit(async (formData) => {
        data?.functions?.handleBluePrintComponent(data?.label, {
            ...formData,
            ai_cleanup: formData.ai_cleanup === "true",
        });
    });

    useEffect(() => {
        if (values.ocr_engine && values.language_mode && values.ai_cleanup) {
            onSubmit();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.ocr_engine, values.ai_cleanup, values.language_mode]);

    useEffect(() => {
        if (data && data.bluePrint) {
            reset(defaultValues);
        }
    }, [defaultValues, reset, data]);

    const handleOpenModal = () => setIsOpen(true);
    const handleCloseModal = () => setIsOpen(false);

    /* ---------------- Logs modal ---------------- */
    const handleOpenLogsModal = () => setLogsOpen(true);
    const handleCloseLogsModal = () => setLogsOpen(false);

    return (
        <Stack sx={{ marginTop: 3 }} spacing={1}>
            <ReactFlowCustomNodeStructure data={data} />

            <Typography variant="h5">
                {data?.stepNumber || 4}. {data?.label}
            </Typography>

            <Divider />

            {/* -------- Summary View -------- */}
            <Stack spacing={0.5}>
                <Typography variant="body1">
                    <b>OCR Engine:</b>{" "}
                    {OCR_OPTIONS.find((o) => o.value === values.ocr_engine)?.label}
                </Typography>

                <Typography variant="body1">
                    <b>Language Detection:</b>{" "}
                    {values.language_mode === "auto" ? "Auto Detect" : "Manual"}
                </Typography>

                <Typography variant="body1">
                    <b>AI Cleanup:</b> {values.ai_cleanup ? "Enabled" : "Disabled"}
                </Typography>
            </Stack>

            {/* -------- Actions -------- */}
            {data?.isProcessInstance !== true && (
                <Button
                    sx={{ width: "240px", color: "royalBlue", borderColor: "royalBlue" }}
                    variant="outlined"
                    onClick={handleOpenModal}
                >
                    Configure Image Processing
                </Button>
            )}

            {data?.isProcessInstance === true && (
                <Button
                    sx={{ width: "200px", color: "royalBlue", borderColor: "royalBlue" }}
                    variant="outlined"
                    onClick={handleOpenLogsModal}
                >
                    View Logs
                </Button>
            )}

            {/* -------- Dialog -------- */}
            <CustomProcessDialogue
                title="Configure Image Processing"
                isOpen={isOpen}
                handleCloseModal={handleCloseModal}
            >
                <FormProvider methods={methods} onSubmit={onSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <RHFSelect name="ocr_engine" label="OCR Engine">
                                {OCR_OPTIONS.map((opt) => (
                                    <MenuItem
                                        key={opt.value}
                                        value={opt.value}
                                        disabled={opt.disabled}
                                    >
                                        {opt.label}
                                    </MenuItem>
                                ))}
                            </RHFSelect>
                        </Grid>

                        <Grid item xs={12}>
                            <RHFSelect name="language_mode" label="Language Detection">
                                <MenuItem value="auto">Auto Detect (Recommended)</MenuItem>
                                <MenuItem value="manual" disabled>
                                    Manual (Advanced)
                                </MenuItem>
                            </RHFSelect>
                        </Grid>

                        <Grid item xs={12}>
                            <RHFSelect name="ai_cleanup" label="AI Text Cleanup">
                                <MenuItem value>Enable</MenuItem>
                                <MenuItem value={false}>Disable</MenuItem>
                            </RHFSelect>
                        </Grid>
                    </Grid>

                    <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                        <LoadingButton type="submit" variant="contained">
                            Save
                        </LoadingButton>
                    </Stack>
                </FormProvider>
            </CustomProcessDialogue>

            {/* -------- Logs Modal -------- */}
            <LogsProcessDialogue
                isOpen={logsOpen}
                handleCloseModal={handleCloseLogsModal}
                processInstanceId={data?.processInstanceId}
                nodeName={data.label}
            />
        </Stack>
    );
}

ReactFlowImageProcessing.propTypes = {
    data: PropTypes.object.isRequired,
};
