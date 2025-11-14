/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState, useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import {
    Grid, Typography, Box, MenuItem, TextField, IconButton, Tooltip,
} from "@mui/material";
import { RHFTextField } from "src/components/hook-form";
import { workflowAxiosInstance } from "src/utils/axios";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import Iconify from "src/components/iconify";
import { useParams } from "react-router";
import { useSnackbar } from "notistack";

export default function HubSpotConnection() {
    const { id } = useParams();
    const { watch, control, setValue } = useFormContext();
    const { fields, append } = useFieldArray({ control, name: "connectionDetails" });
    const { enqueueSnackbar } = useSnackbar();
    const values = watch();
    const [isLoading, setIsLoading] = useState(false);
    const [viewForm, setViewForm] = useState(false);

    useEffect(() => {
        if (!values?.connectionDetails || values.connectionDetails.length === 0) {
            append({
                connectionId: "",
                connectionName: "",
                connectionType: "hubspot",
                isConnectionEstablished: false,
            });
            setViewForm(true);
        }
    }, []);

    const lastIndex =
        Math.max(0, (values?.connectionDetails?.length ?? 1) - 1);

    const handleConnectHubSpot = async () => {
        try {
            setIsLoading(true);
            const connectionName = values?.connectionDetails?.[lastIndex]?.connectionName;

            if (!connectionName) {
                console.error("❌ Missing connection name for last index");
                setIsLoading(false);
                return;
            }

            // Step 1️⃣: Create HubSpot OAuth authorization URL
            const response = await workflowAxiosInstance.post("/crm/hubspot-authentication", {
                connectionName,
                workflowId: id,
            });

            if (response.data?.authUrl) {
                const popup = window.open(response.data.authUrl);

                const pollInterval = 3000; 
                const maxAttempts = 50; 
                let attempts = 0;

                const poll = setInterval(async () => {
                    attempts += 1;
                    console.log(`🔍 Checking connection (attempt ${attempts}/${maxAttempts})...`);

                    try {
                        const check = await workflowAxiosInstance.post("/workflow-connections/validate", {
                            connectionName,
                            workflowId: id,
                        });

                        if (check.data?.isConnectionEstablished) {
                            clearInterval(poll);
                            popup?.close();
                            console.log("✅ HubSpot connection established successfully!");
                            const updatedValues = values.connectionDetails.map((connection) => {
                                if (connection.connectionName === connectionName) {
                                    return {
                                        connectionId: check.data?.id,
                                        connectionName,
                                        isConnectionEstablished: check.data?.isConnectionEstablished,
                                        connectionType: 'hubspot'
                                    }
                                }

                                return connection;
                            })
                            setValue('connectionDetails', updatedValues, { shouldValidate: true });
                            setValue('selectedConnection', check.data?.id, { shouldValidate: true });
                            setViewForm(false);
                            enqueueSnackbar("HubSpot connection established!", { variant: "success" });
                        } else if (attempts >= maxAttempts) {
                            clearInterval(poll);
                            popup?.close();
                            console.warn("⚠️ Connection validation timed out after 4 attempts.");
                            enqueueSnackbar("Connection not verified. Please try again.", { variant: "warning" });
                        }
                    } catch (err) {
                        clearInterval(poll);
                        popup?.close();
                        console.error("Error while validating HubSpot connection:", err);
                    }
                }, pollInterval);
            }
        } catch (error) {
            console.error("HubSpot connection failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                    HubSpot Connection
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                    Manage your HubSpot CRM integration. You can either create a new
                    connection or select an existing one linked to this workflow.
                </Typography>
            </Grid>

            {/* Dropdown view */}
            {!viewForm ? (
                <>
                    <Grid item xs={12} md={12}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Controller
                                name="selectedConnection"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        select
                                        fullWidth
                                        label="Select Existing Connection"
                                        {...field}
                                        error={!!error}
                                        helperText={error?.message}
                                    >
                                        {values?.connectionDetails?.length > 0 ? (
                                            values.connectionDetails.map((conn, idx) => (
                                                <MenuItem
                                                    key={conn.connectionId || idx}
                                                    value={conn.connectionId}
                                                >
                                                    {conn.connectionName}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem disabled>No connections found</MenuItem>
                                        )}
                                    </TextField>
                                )}
                            />
                            <IconButton color="primary" onClick={() => console.log("refresh connections")}>
                                <Tooltip title="Refresh connections">
                                    <Iconify name="eva:refresh-outline" width={22} height={22} />
                                </Tooltip>
                            </IconButton>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Box my={2}>
                            <Typography variant="body2" color="text.secondary">
                                💡 You can also{" "}
                                <span
                                    onClick={() => setViewForm(true)}
                                    style={{ color: "#1976d2", cursor: "pointer", fontWeight: 500 }}
                                >
                                    create a new connection
                                </span>
                                .
                            </Typography>
                        </Box>
                    </Grid>
                </>
            ) : (
                <>
                    {/* Only render the last index */}
                    <Grid item xs={12} md={12}>
                        <RHFTextField
                            name={`connectionDetails[${lastIndex}].connectionName`}
                            label="Connection Name"
                            placeholder="e.g., Marketing CRM or HubSpot Main"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Box mt={2} display="flex" alignItems="center" gap={2}>
                            <LoadingButton
                                variant="contained"
                                loading={isLoading}
                                onClick={handleConnectHubSpot}
                            >
                                Create HubSpot Connection
                            </LoadingButton>
                            <Typography
                                variant="body2"
                                color="primary"
                                sx={{ cursor: "pointer" }}
                                onClick={() => setViewForm(false)}
                            >
                                Use existing connection
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                            🔒 We’ll redirect you to HubSpot to grant access. Your credentials are
                            never stored directly — only a secure access token is used to
                            communicate with HubSpot’s API.
                        </Typography>
                    </Grid>
                </>
            )}
        </>
    );
}
