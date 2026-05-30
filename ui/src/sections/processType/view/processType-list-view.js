/* eslint-disable no-nested-ternary */
import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import { Box, Grid } from '@mui/material';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
import { RouterLink } from 'src/routes/components';
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import { deleteProcessType, useGetProcessTypes } from 'src/api/processType';
import TableViewToggleSwitch from 'src/components/table/table-view-toggle-switch';
import { useSnackbar } from 'src/components/snackbar';
import ProcessTypeTableRow from '../processType-table-row';
import ProcessTypeTableGrid from '../processType-table-grid';

const TABLE_HEAD = [
  { id: 'processType', label: 'Process Type', width: 180 },
  { id: 'description', label: 'Description' },
  { id: 'createdAt', label: 'Created At' },
  { id: 'status', label: 'Status', width: 100 },
  { id: 'actions', label: 'Actions', width: 88 },
];

const defaultFilters = {
  name: '',
  role: [],
  status: 'all',
};

export default function ProcessTypeListView() {
  const table = useTable({ defaultOrderBy: 'createdAt', defaultOrder: 'desc' });
  const [view, setView] = useState('grid');

  const settings = useSettingsContext();

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState([]);

  const [filters] = useState(defaultFilters);

  const { processTypes, refreshProcessTypes } = useGetProcessTypes();

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  // const handleFilters = useCallback(
  //   (name, value) => {
  //     table.onResetPage();
  //     setFilters((prevState) => ({
  //       ...prevState,
  //       [name]: value,
  //     }));
  //   },
  //   [table]
  // );

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        await deleteProcessType(id);
        enqueueSnackbar('Process type deleted');
        setTableData((prev) => prev.filter((row) => row.id !== id));
        refreshProcessTypes();
        table.onUpdatePageDeleteRow(dataInPage.length);
      } catch (error) {
        enqueueSnackbar(error?.message || 'Unable to delete process type', { variant: 'error' });
      }
    },
    [dataInPage.length, enqueueSnackbar, refreshProcessTypes, table]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.processType.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.processType.view(id));
    },
    [router]
  );

  useEffect(() => {
    if (processTypes) {
      setTableData(processTypes);
    }
  }, [processTypes]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Process Types"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Process Type', href: paths.dashboard.processType.root },
            { name: 'List' },
          ]}
          action={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TableViewToggleSwitch view={view} setView={setView} />

              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                component={RouterLink}
                color='primary'
                href={paths.dashboard.processType.new}
                sx={{
                  borderRadius: '30px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  height: 40,
                }}
              >
                Create
              </Button>
            </Box>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        {view === 'list' ? (
          <Card>
            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <TableSelectedAction
                dense={table.dense}
                numSelected={table.selected.length}
                rowCount={tableData.length}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    tableData.map((row) => row.id)
                  )
                }
                action={
                  <Tooltip title="Delete">
                    <IconButton color="primary" onClick={confirm.onTrue}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>
                }
              />

              <Scrollbar>
                <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={tableData.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        tableData.map((row) => row.id)
                      )
                    }
                    showCheckbox={false}
                  />

                  <TableBody>
                    {dataFiltered
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      .map((row) => (
                        <ProcessTypeTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          onEditRow={() => handleEditRow(row.id)}
                          onViewRow={() => handleViewRow(row.id)}
                        />
                      ))}

                    <TableEmptyRows
                      height={denseHeight}
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
        ) : view === 'grid' ? (
          <>
            <Grid container spacing={2}>
              {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row) => (
                  <Grid item xs={12} sm={6} md={4} key={row.id}>
                    <ProcessTypeTableGrid
                      row={row}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
                      onViewRow={() => handleViewRow(row.id)}
                    />
                  </Grid>
                ))}
            </Grid>
            <TablePaginationCustom
              count={dataFiltered.length}
              page={table.page}
              rowsPerPage={table.rowsPerPage}
              onPageChange={table.onChangePage}
              onRowsPerPageChange={table.onChangeRowsPerPage}
              dense={table.dense}
              onChangeDense={table.onChangeDense}
              sx={{ mt: 2 }}
            />
          </>
        ) : null}
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  const { name, status, role } = filters;
  const stabilizedThis = inputData.map((el, index) => [el, index]);
  const roleMapping = {
    production_head: 'Production Head',
    initiator: 'Initiator',
    validator: 'Validator',
  };
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter((processType) =>
      Object.values(processType).some((value) =>
        String(value).toLowerCase().includes(name.toLowerCase())
      )
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((processType) =>
      status === '1' ? processType.isActive : !processType.isActive
    );
  }

  if (role.length) {
    inputData = inputData.filter(
      (processType) =>
        processType.permissions &&
        processType.permissions.some((processTypeRole) => {
          const mappedRole = roleMapping[processTypeRole];
          return mappedRole && role.includes(mappedRole);
        })
    );
  }

  return inputData;
}
