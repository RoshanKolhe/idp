import {useCallback, useEffect, useState} from 'react';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import {Box, Typography} from '@mui/material';
import {paths} from 'src/routes/paths';
import {useRouter} from 'src/routes/hook';
import {RouterLink} from 'src/routes/components';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import {useSettingsContext} from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  emptyRows,
  getComparator,
  useTable,
} from 'src/components/table';
import {deleteWorkflowTemplate, useGetWorkflowTemplates} from 'src/api/workflow-templates';
import { useSnackbar } from 'src/components/snackbar';
import WorkflowTemplateTableRow from '../workflow-template-table-row';

const TABLE_HEAD = [
  {id: 'name', label: 'Name', width: 220},
  {id: 'version', label: 'Version'},
  {id: 'workflow', label: 'Workflow'},
  {id: 'createdAt', label: 'Created At'},
  {id: 'status', label: 'Status'},
  {id: '', label: 'Actions', width: 120},
];

export default function WorkflowTemplateListView() {
  const table = useTable({defaultOrderBy: 'createdAt', defaultOrder: 'desc'});
  const settings = useSettingsContext();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [tableData, setTableData] = useState([]);
  const {workflowTemplates, refreshWorkflowTemplates} = useGetWorkflowTemplates();

  useEffect(() => {
    if (workflowTemplates) {
      setTableData(workflowTemplates);
    }
  }, [workflowTemplates]);

  const dataFiltered = [...tableData].sort(getComparator(table.order, table.orderBy));
  const notFound = !dataFiltered.length;

  const handleEditRow = useCallback(id => {
    router.push(paths.dashboard.workflowTemplates.edit(id));
  }, [router]);

  const handleViewRow = useCallback(id => {
    router.push(paths.dashboard.workflowTemplates.view(id));
  }, [router]);

  const handleDeleteRow = useCallback(async (id) => {
    try {
      await deleteWorkflowTemplate(id);
      enqueueSnackbar('Workflow template deleted');
      setTableData((prev) => prev.filter((row) => row.id !== id));
      refreshWorkflowTemplates();
    } catch (error) {
      enqueueSnackbar(error?.message || 'Unable to delete workflow template', { variant: 'error' });
    }
  }, [enqueueSnackbar, refreshWorkflowTemplates]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Workflow Templates"
        links={[
          {name: 'Dashboard', href: paths.dashboard.root},
          {name: 'Workflow Templates'},
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            component={RouterLink}
            href={paths.dashboard.workflowTemplates.new}
            color="primary"
            sx={{
              borderRadius: 99,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              height: 40,
            }}
          >
            Create Template
          </Button>
        }
        sx={{mb: {xs: 3, md: 5}}}
      />

      <Card>
        <TableContainer sx={{position: 'relative', overflow: 'unset'}}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{minWidth: 960}}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={tableData.length}
                numSelected={0}
                onSort={table.onSort}
                showCheckbox={false}
              />

              <TableBody>
                {dataFiltered
                  .slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage)
	                  .map(row => (
	                    <WorkflowTemplateTableRow
	                      key={row.id}
	                      row={row}
	                      onDeleteRow={() => handleDeleteRow(row.id)}
	                      onEditRow={() => handleEditRow(row.id)}
	                      onViewRow={() => handleViewRow(row.id)}
	                    />
	                  ))}

                <TableEmptyRows
                  height={table.dense ? 52 : 72}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                />
                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={dataFiltered.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
    </Container>
  );
}
