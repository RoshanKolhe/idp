import React, { useEffect, useState } from "react";
import PropTypes from "prop-types"
import { Box, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import PdfViewer from "./pdfViewer";

export default function ProcessInstanceExtractedDocuments({ currentDocs }) {
    const [documentsData, setDocumentsData] = useState([]);
    const [selectedDocumentId, setSelectedDocumentId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (currentDocs && currentDocs.success && currentDocs.data.length > 0) {
            setDocumentsData(currentDocs.data);
            setSelectedDocumentId(currentDocs?.data[0]);
        }
        setIsLoading(false);
    }, [currentDocs]);

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
                <Stack spacing={1} direction='column'>
                    {documentsData.length > 0 ? documentsData.map((doc) => (
                        <Card
                            key={doc.id}
                            sx={{
                                border: selectedDocumentId?.id === doc.id ? '2px solid royalBlue' : '1px solid #e0e0e0',
                                borderRadius: 3,
                                boxShadow: 2,
                                p: 2,
                                transition: 'border 0.3s ease',
                                cursor: 'pointer',
                                '&:hover': {
                                    borderColor: 'royalBlue',
                                },
                            }}
                        >
                            <CardContent>
                                <Stack spacing={2}>
                                    {/* Document Name & Type */}
                                    <Box>
                                        <Typography variant='h6' color="primary" fontWeight="bold">
                                            {doc?.documentDetails?.documentName || 'Untitled Document'}
                                        </Typography>
                                        <Typography variant='subtitle1' color="text.secondary">
                                            {doc?.documentDetails?.documentType || 'Unknown Type'}
                                        </Typography>
                                    </Box>

                                    {/* Extracted Fields */}
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                            Extracted Fields
                                        </Typography>
                                        <Stack spacing={1} direction="column">
                                            {doc?.extractedFields ? (
                                                Object.entries(doc.extractedFields).map(([key, value]) => (
                                                    <Box key={key}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {key}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.primary">
                                                            {value}
                                                        </Typography>
                                                    </Box>
                                                ))
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    No fields extracted.
                                                </Typography>
                                            )}
                                        </Stack>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>

                    )) : (
                        <Typography variant='body1'>No Documents</Typography>
                    )}
                </Stack>
            </Grid>
            <Grid item md={6}>
                {selectedDocumentId?.fileDetails?.fileUrl ? (
                    <Box
                        sx={{
                            width: '100%',
                            height: '600px', // Set desired height
                            overflow: 'auto',
                            border: '1px solid #ccc',
                            borderRadius: 2,
                            p: 1,
                            backgroundColor: '#f9f9f9'
                        }}
                    >
                        <PdfViewer docUrl={selectedDocumentId.fileDetails.fileUrl} />
                    </Box>
                ) : (
                    <Typography variant="h4">No Document</Typography>
                )}
            </Grid>

        </Grid>
    )
}

ProcessInstanceExtractedDocuments.propTypes = {
    currentDocs: PropTypes.object,
}