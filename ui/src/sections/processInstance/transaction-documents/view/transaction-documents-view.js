import { useEffect, useState } from 'react';
import { Box, Container, Grid, Typography, CircularProgress } from '@mui/material';
import { useParams } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { useGetTransactionDocuments } from 'src/api/process-instance';
import { useGetProcessInstance } from 'src/api/process-instance';
import TransactionDocumentCard from '../transaction-document-card';

export default function TransactionDocumentsView() {
  const { id: instanceId, transactionId } = useParams();
  const settings = useSettingsContext();

  const { processInstance } = useGetProcessInstance(instanceId);
  const { transactionDocuments, transactionDocumentsLoading, transactionDocumentsEmpty } =
    useGetTransactionDocuments(transactionId);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Transaction Documents"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Process Instances', href: paths.dashboard.processesInstance.list },
          processInstance?.processInstanceName && { name: processInstance.processInstanceName, href: paths.dashboard.processesInstance.logsList(instanceId) },
          { name: `Transaction #${transactionId}` },
          { name: 'Documents' },
        ].filter(Boolean)}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {transactionDocumentsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      ) : transactionDocumentsEmpty ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 10,
            gap: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No documents found for this transaction
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Documents will appear here after the classification step completes
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {transactionDocuments.map((record) => (
            <Grid item xs={12} sm={6} md={4} key={record.id}>
              <TransactionDocumentCard record={record} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
