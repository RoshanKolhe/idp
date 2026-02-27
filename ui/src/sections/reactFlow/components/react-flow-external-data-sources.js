import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import {
  Button,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import FormProvider, { RHFSelect, RHFTextField } from "src/components/hook-form";
import Iconify from "src/components/iconify";
import ReactFlowCustomNodeStructure from "../react-flow-custom-node";
import CustomProcessDialogue from "./components-dialogue";
import LogsProcessDialogue from "./logs-dialogue";

const SOURCE_TYPE_OPTIONS = [
  { label: "API Connector", value: "api" },
  { label: "DB Connector", value: "db" },
  { label: "Big Data Connector", value: "bigdata" },
  { label: "Website Connector", value: "website" },
];

const API_METHOD_OPTIONS = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const DB_TYPE_OPTIONS = [
  { label: "PostgreSQL", value: "postgresql" },
  { label: "MySQL", value: "mysql" },
  { label: "SQL Server", value: "sqlserver" },
  { label: "MongoDB", value: "mongodb" },
];
const BIG_DATA_TYPE_OPTIONS = [
  { label: "Snowflake", value: "snowflake" },
  { label: "BigQuery", value: "bigquery" },
  { label: "Databricks", value: "databricks" },
  { label: "S3 Data Lake", value: "s3" },
];

const fieldsSchema = Yup.array().of(
  Yup.object().shape({
    key: Yup.string().required("Key is required"),
    value: Yup.string().required("Value is required"),
  })
);

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  sourceType: Yup.string().oneOf(["api", "db", "bigdata", "website"]).required("Source type is required"),
  apiUrl: Yup.string().when("sourceType", {
    is: "api",
    then: (schema) =>
      schema
        .required("API URL is required")
        .test("valid-url", "Invalid URL", (value) => /^(https?:\/\/)/i.test(value || "")),
    otherwise: (schema) => schema.notRequired(),
  }),
  apiMethod: Yup.string().when("sourceType", {
    is: "api",
    then: (schema) => schema.oneOf(API_METHOD_OPTIONS).required("Method is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  headers: fieldsSchema.default([]),
  queryParams: fieldsSchema.default([]),
  body: Yup.string().default(""),
  dbConnectorName: Yup.string().when("sourceType", {
    is: "db",
    then: (schema) => schema.required("Connector name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  dbType: Yup.string().when("sourceType", {
    is: "db",
    then: (schema) => schema.required("DB type is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  dbConnectionRef: Yup.string().when("sourceType", {
    is: "db",
    then: (schema) => schema.required("Connection reference is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  dbHost: Yup.string().when(["sourceType", "dbType"], {
    is: (sourceType, dbType) => sourceType === "db" && ["postgresql", "mysql", "sqlserver"].includes(dbType),
    then: (schema) => schema.required("Host is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  dbPort: Yup.number().when(["sourceType", "dbType"], {
    is: (sourceType, dbType) => sourceType === "db" && ["postgresql", "mysql", "sqlserver"].includes(dbType),
    then: (schema) => schema.typeError("Port must be a number").required("Port is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  dbName: Yup.string().when(["sourceType", "dbType"], {
    is: (sourceType, dbType) => sourceType === "db" && ["postgresql", "mysql", "sqlserver"].includes(dbType),
    then: (schema) => schema.required("Database name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  dbUser: Yup.string().when(["sourceType", "dbType"], {
    is: (sourceType, dbType) => sourceType === "db" && ["postgresql", "mysql", "sqlserver"].includes(dbType),
    then: (schema) => schema.required("Username is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  dbPassword: Yup.string().when(["sourceType", "dbType"], {
    is: (sourceType, dbType) => sourceType === "db" && ["postgresql", "mysql", "sqlserver"].includes(dbType),
    then: (schema) => schema.required("Password is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mongoConnectionString: Yup.string().when(["sourceType", "dbType"], {
    is: (sourceType, dbType) => sourceType === "db" && dbType === "mongodb",
    then: (schema) => schema.required("Connection string is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mongoDatabase: Yup.string().when(["sourceType", "dbType"], {
    is: (sourceType, dbType) => sourceType === "db" && dbType === "mongodb",
    then: (schema) => schema.required("Database is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  dbQuery: Yup.string().when("sourceType", {
    is: "db",
    then: (schema) => schema.required("Query is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  bigDataConnectorName: Yup.string().when("sourceType", {
    is: "bigdata",
    then: (schema) => schema.required("Connector name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  bigDataType: Yup.string().when("sourceType", {
    is: "bigdata",
    then: (schema) => schema.required("Big data type is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  snowflakeAccount: Yup.string().when(["sourceType", "bigDataType"], {
    is: (sourceType, bigDataType) => sourceType === "bigdata" && bigDataType === "snowflake",
    then: (schema) => schema.required("Snowflake account is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  snowflakeWarehouse: Yup.string().when(["sourceType", "bigDataType"], {
    is: (sourceType, bigDataType) => sourceType === "bigdata" && bigDataType === "snowflake",
    then: (schema) => schema.required("Warehouse is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  snowflakeDatabase: Yup.string().when(["sourceType", "bigDataType"], {
    is: (sourceType, bigDataType) => sourceType === "bigdata" && bigDataType === "snowflake",
    then: (schema) => schema.required("Database is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  snowflakeSchema: Yup.string().when(["sourceType", "bigDataType"], {
    is: (sourceType, bigDataType) => sourceType === "bigdata" && bigDataType === "snowflake",
    then: (schema) => schema.required("Schema is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  snowflakeUser: Yup.string().when(["sourceType", "bigDataType"], {
    is: (sourceType, bigDataType) => sourceType === "bigdata" && bigDataType === "snowflake",
    then: (schema) => schema.required("Username is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  snowflakePassword: Yup.string().when(["sourceType", "bigDataType"], {
    is: (sourceType, bigDataType) => sourceType === "bigdata" && bigDataType === "snowflake",
    then: (schema) => schema.required("Password is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  bigQueryProjectId: Yup.string().when(["sourceType", "bigDataType"], {
    is: (sourceType, bigDataType) => sourceType === "bigdata" && bigDataType === "bigquery",
    then: (schema) => schema.required("Project ID is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  bigQueryDataset: Yup.string().when(["sourceType", "bigDataType"], {
    is: (sourceType, bigDataType) => sourceType === "bigdata" && bigDataType === "bigquery",
    then: (schema) => schema.required("Dataset is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  bigQueryServiceAccountJson: Yup.string().when(["sourceType", "bigDataType"], {
    is: (sourceType, bigDataType) => sourceType === "bigdata" && bigDataType === "bigquery",
    then: (schema) => schema.required("Service Account JSON is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  databricksWorkspaceUrl: Yup.string().when(["sourceType", "bigDataType"], {
    is: (sourceType, bigDataType) => sourceType === "bigdata" && bigDataType === "databricks",
    then: (schema) => schema.required("Workspace URL is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  databricksCatalog: Yup.string().when(["sourceType", "bigDataType"], {
    is: (sourceType, bigDataType) => sourceType === "bigdata" && bigDataType === "databricks",
    then: (schema) => schema.required("Catalog is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  databricksSchema: Yup.string().when(["sourceType", "bigDataType"], {
    is: (sourceType, bigDataType) => sourceType === "bigdata" && bigDataType === "databricks",
    then: (schema) => schema.required("Schema is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  databricksToken: Yup.string().when(["sourceType", "bigDataType"], {
    is: (sourceType, bigDataType) => sourceType === "bigdata" && bigDataType === "databricks",
    then: (schema) => schema.required("Token is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  s3Bucket: Yup.string().when(["sourceType", "bigDataType"], {
    is: (sourceType, bigDataType) => sourceType === "bigdata" && bigDataType === "s3",
    then: (schema) => schema.required("Bucket is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  s3Region: Yup.string().when(["sourceType", "bigDataType"], {
    is: (sourceType, bigDataType) => sourceType === "bigdata" && bigDataType === "s3",
    then: (schema) => schema.required("Region is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  s3AccessKey: Yup.string().when(["sourceType", "bigDataType"], {
    is: (sourceType, bigDataType) => sourceType === "bigdata" && bigDataType === "s3",
    then: (schema) => schema.required("Access key is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  s3SecretKey: Yup.string().when(["sourceType", "bigDataType"], {
    is: (sourceType, bigDataType) => sourceType === "bigdata" && bigDataType === "s3",
    then: (schema) => schema.required("Secret key is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  s3Prefix: Yup.string().default(""),
  bigDataDataset: Yup.string().when("sourceType", {
    is: "bigdata",
    then: (schema) => schema.required("Dataset/Table is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  bigDataQueryFilter: Yup.string().when("sourceType", {
    is: "bigdata",
    then: (schema) => schema.required("Query/Filter is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  bigDataLimit: Yup.number().when("sourceType", {
    is: "bigdata",
    then: (schema) => schema.typeError("Limit must be a number").min(1).required("Limit is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  websiteStartUrls: Yup.string().when("sourceType", {
    is: "website",
    then: (schema) => schema.required("At least one start URL is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  websiteMaxDepth: Yup.number().when("sourceType", {
    is: "website",
    then: (schema) => schema.typeError("Max depth must be a number").min(0).required("Max depth is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  websiteMaxPages: Yup.number().when("sourceType", {
    is: "website",
    then: (schema) => schema.typeError("Max pages must be a number").min(1).required("Max pages is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  websiteSpecificRequirement: Yup.string().when("sourceType", {
    is: "website",
    then: (schema) => schema.required("Specific requirement is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  websiteOutputSchema: Yup.string().default(""),
  websiteIncludePatterns: Yup.string().default(""),
  websiteExcludePatterns: Yup.string().default(""),
  websiteFollowSubdomains: Yup.string().default("false"),
  websiteRespectRobotsTxt: Yup.string().default("true"),
  websiteRenderJs: Yup.string().default("false"),
});

function KeyValueEditor({ fieldName }) {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: fieldName });

  return (
    <Stack spacing={1}>
      {fields.map((field, index) => (
        <Grid container spacing={1} key={field.id} alignItems="center">
          <Grid item xs={5}>
            <RHFTextField name={`${fieldName}.${index}.key`} label="Key" />
          </Grid>
          <Grid item xs={5}>
            <RHFTextField name={`${fieldName}.${index}.value`} label="Value" />
          </Grid>
          <Grid item xs={2}>
            <IconButton color="error" onClick={() => remove(index)}>
              <Iconify icon="mdi:minus-circle-outline" width={22} />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Stack alignItems="flex-end">
        <IconButton color="primary" onClick={() => append({ key: "", value: "" })}>
          <Iconify icon="mdi:plus-circle-outline" width={24} />
        </IconButton>
      </Stack>
    </Stack>
  );
}

KeyValueEditor.propTypes = {
  fieldName: PropTypes.string.isRequired,
};

export default function ReactFlowExternalDataSources({ data }) {
  const [isOpen, setIsOpen] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);

  const defaultValues = useMemo(
    () => ({
      name: data?.bluePrint?.name || "",
      sourceType: data?.bluePrint?.sourceType || "api",
      apiUrl: data?.bluePrint?.apiUrl || "",
      apiMethod: data?.bluePrint?.apiMethod || "GET",
      headers: data?.bluePrint?.headers || [],
      queryParams: data?.bluePrint?.queryParams || [],
      body: data?.bluePrint?.body || "",
      dbConnectorName: data?.bluePrint?.dbConnectorName || "",
      dbType: data?.bluePrint?.dbType || "",
      dbConnectionRef: data?.bluePrint?.dbConnectionRef || "",
      dbHost: data?.bluePrint?.dbHost || "",
      dbPort: data?.bluePrint?.dbPort || "",
      dbName: data?.bluePrint?.dbName || "",
      dbUser: data?.bluePrint?.dbUser || "",
      dbPassword: data?.bluePrint?.dbPassword || "",
      mongoConnectionString: data?.bluePrint?.mongoConnectionString || "",
      mongoDatabase: data?.bluePrint?.mongoDatabase || "",
      dbQuery: data?.bluePrint?.dbQuery || "",
      bigDataConnectorName: data?.bluePrint?.bigDataConnectorName || "",
      bigDataType: data?.bluePrint?.bigDataType || "",
      snowflakeAccount: data?.bluePrint?.snowflakeAccount || "",
      snowflakeWarehouse: data?.bluePrint?.snowflakeWarehouse || "",
      snowflakeDatabase: data?.bluePrint?.snowflakeDatabase || "",
      snowflakeSchema: data?.bluePrint?.snowflakeSchema || "",
      snowflakeUser: data?.bluePrint?.snowflakeUser || "",
      snowflakePassword: data?.bluePrint?.snowflakePassword || "",
      bigQueryProjectId: data?.bluePrint?.bigQueryProjectId || "",
      bigQueryDataset: data?.bluePrint?.bigQueryDataset || "",
      bigQueryServiceAccountJson: data?.bluePrint?.bigQueryServiceAccountJson || "",
      databricksWorkspaceUrl: data?.bluePrint?.databricksWorkspaceUrl || "",
      databricksCatalog: data?.bluePrint?.databricksCatalog || "",
      databricksSchema: data?.bluePrint?.databricksSchema || "",
      databricksToken: data?.bluePrint?.databricksToken || "",
      s3Bucket: data?.bluePrint?.s3Bucket || "",
      s3Region: data?.bluePrint?.s3Region || "",
      s3AccessKey: data?.bluePrint?.s3AccessKey || "",
      s3SecretKey: data?.bluePrint?.s3SecretKey || "",
      s3Prefix: data?.bluePrint?.s3Prefix || "",
      bigDataDataset: data?.bluePrint?.bigDataDataset || "",
      bigDataQueryFilter: data?.bluePrint?.bigDataQueryFilter || "",
      bigDataLimit: data?.bluePrint?.bigDataLimit || 100,
      websiteStartUrls: data?.bluePrint?.websiteStartUrls || "",
      websiteMaxDepth: data?.bluePrint?.websiteMaxDepth ?? 1,
      websiteMaxPages: data?.bluePrint?.websiteMaxPages ?? 20,
      websiteSpecificRequirement: data?.bluePrint?.websiteSpecificRequirement || "",
      websiteOutputSchema: data?.bluePrint?.websiteOutputSchema || "",
      websiteIncludePatterns: data?.bluePrint?.websiteIncludePatterns || "",
      websiteExcludePatterns: data?.bluePrint?.websiteExcludePatterns || "",
      websiteFollowSubdomains: String(data?.bluePrint?.websiteFollowSubdomains ?? false),
      websiteRespectRobotsTxt: String(data?.bluePrint?.websiteRespectRobotsTxt ?? true),
      websiteRenderJs: String(data?.bluePrint?.websiteRenderJs ?? false),
    }),
    [data]
  );

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const { reset, watch, handleSubmit, formState: { isSubmitting } } = methods;
  const values = watch();

  const onSubmit = handleSubmit(async (formData) => {
    data?.functions?.handleBluePrintComponent(data?.label, {
      ...formData,
      bigDataLimit: Number(formData.bigDataLimit || 0),
      websiteMaxDepth: Number(formData.websiteMaxDepth || 0),
      websiteMaxPages: Number(formData.websiteMaxPages || 0),
      websiteFollowSubdomains: formData.websiteFollowSubdomains === "true",
      websiteRespectRobotsTxt: formData.websiteRespectRobotsTxt === "true",
      websiteRenderJs: formData.websiteRenderJs === "true",
    });
    setIsOpen(false);
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const sourceTypeLabel =
    SOURCE_TYPE_OPTIONS.find((item) => item.value === values.sourceType)?.label || "-";

  return (
    <Stack sx={{ marginTop: 3 }} spacing={1}>
      <ReactFlowCustomNodeStructure data={data} />
      <Typography variant="h5">{data?.stepNumber || 4}. {data?.label}</Typography>
      <Divider />
      <Typography variant="body1"><b>Name:</b> {values.name || "-"}</Typography>
      <Typography variant="body1"><b>Source Type:</b> {sourceTypeLabel}</Typography>
      {values.sourceType === "api" && (
        <>
          <Typography variant="body1"><b>Method:</b> {values.apiMethod || "-"}</Typography>
          <Typography variant="body1"><b>URL:</b> {values.apiUrl || "-"}</Typography>
        </>
      )}
      {values.sourceType === "db" && (
        <>
          <Typography variant="body1"><b>Connector:</b> {values.dbConnectorName || "-"}</Typography>
          <Typography variant="body1"><b>DB Type:</b> {DB_TYPE_OPTIONS.find((item) => item.value === values.dbType)?.label || "-"}</Typography>
          <Typography variant="body1"><b>Connection Ref:</b> {values.dbConnectionRef || "-"}</Typography>
        </>
      )}
      {values.sourceType === "bigdata" && (
        <>
          <Typography variant="body1"><b>Connector:</b> {values.bigDataConnectorName || "-"}</Typography>
          <Typography variant="body1"><b>Big Data Type:</b> {BIG_DATA_TYPE_OPTIONS.find((item) => item.value === values.bigDataType)?.label || "-"}</Typography>
          <Typography variant="body1"><b>Dataset/Table:</b> {values.bigDataDataset || "-"}</Typography>
          <Typography variant="body1"><b>Limit:</b> {values.bigDataLimit || "-"}</Typography>
        </>
      )}
      {values.sourceType === "website" && (
        <>
          <Typography variant="body1"><b>Max Depth:</b> {values.websiteMaxDepth}</Typography>
          <Typography variant="body1"><b>Max Pages:</b> {values.websiteMaxPages}</Typography>
          <Typography variant="body1"><b>Requirement:</b> {values.websiteSpecificRequirement || "-"}</Typography>
        </>
      )}

      {data?.isProcessInstance !== true && (
        <Button
          sx={{ width: "230px", color: "royalBlue", borderColor: "royalBlue" }}
          variant="outlined"
          onClick={() => setIsOpen(true)}
        >
          Configure Data Source
        </Button>
      )}

      {data?.isProcessInstance === true && (
        <Button
          sx={{ width: "200px", color: "royalBlue", borderColor: "royalBlue" }}
          variant="outlined"
          onClick={() => setLogsOpen(true)}
        >
          View Logs
        </Button>
      )}

      <CustomProcessDialogue
        title="Configure External Data Source"
        isOpen={isOpen}
        handleCloseModal={() => setIsOpen(false)}
      >
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <RHFTextField name="name" label="Name" />
            </Grid>
            <Grid item xs={12}>
              <RHFSelect name="sourceType" label="Source Type">
                {SOURCE_TYPE_OPTIONS.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Grid>

            {values.sourceType === "api" && (
              <>
                <Grid item xs={12}>
                  <RHFTextField name="apiUrl" label="URL" />
                </Grid>
                <Grid item xs={12}>
                  <RHFSelect name="apiMethod" label="Method">
                    {API_METHOD_OPTIONS.map((method) => (
                      <MenuItem key={method} value={method}>
                        {method}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">Headers</Typography>
                  <KeyValueEditor fieldName="headers" />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">Query Params</Typography>
                  <KeyValueEditor fieldName="queryParams" />
                </Grid>
                <Grid item xs={12}>
                  <RHFTextField name="body" label="Body" multiline minRows={3} />
                </Grid>
              </>
            )}

            {values.sourceType === "db" && (
              <>
                <Grid item xs={12}>
                  <RHFTextField name="dbConnectorName" label="Connector Name" />
                </Grid>
                <Grid item xs={12}>
                  <RHFSelect name="dbType" label="DB Type">
                    {DB_TYPE_OPTIONS.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Grid>
                <Grid item xs={12}>
                  <RHFTextField name="dbConnectionRef" label="Connection Ref" />
                </Grid>
                {["postgresql", "mysql", "sqlserver"].includes(values.dbType) && (
                  <>
                    <Grid item xs={12} md={6}>
                      <RHFTextField name="dbHost" label="Host" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <RHFTextField name="dbPort" label="Port" type="number" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <RHFTextField name="dbName" label="Database Name" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <RHFTextField name="dbUser" label="Username" />
                    </Grid>
                    <Grid item xs={12}>
                      <RHFTextField name="dbPassword" label="Password" type="password" />
                    </Grid>
                  </>
                )}
                {values.dbType === "mongodb" && (
                  <>
                    <Grid item xs={12}>
                      <RHFTextField name="mongoConnectionString" label="Mongo Connection String" />
                    </Grid>
                    <Grid item xs={12}>
                      <RHFTextField name="mongoDatabase" label="Mongo Database" />
                    </Grid>
                  </>
                )}
                <Grid item xs={12}>
                  <RHFTextField name="dbQuery" label="Query" multiline minRows={4} />
                </Grid>
              </>
            )}

            {values.sourceType === "bigdata" && (
              <>
                <Grid item xs={12}>
                  <RHFTextField name="bigDataConnectorName" label="Connector Name" />
                </Grid>
                <Grid item xs={12}>
                  <RHFSelect name="bigDataType" label="Big Data Type">
                    {BIG_DATA_TYPE_OPTIONS.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Grid>
                {values.bigDataType === "snowflake" && (
                  <>
                    <Grid item xs={12} md={6}>
                      <RHFTextField name="snowflakeAccount" label="Snowflake Account" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <RHFTextField name="snowflakeWarehouse" label="Warehouse" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <RHFTextField name="snowflakeDatabase" label="Database" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <RHFTextField name="snowflakeSchema" label="Schema" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <RHFTextField name="snowflakeUser" label="Username" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <RHFTextField name="snowflakePassword" label="Password" type="password" />
                    </Grid>
                  </>
                )}
                {values.bigDataType === "bigquery" && (
                  <>
                    <Grid item xs={12} md={6}>
                      <RHFTextField name="bigQueryProjectId" label="Project ID" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <RHFTextField name="bigQueryDataset" label="Dataset" />
                    </Grid>
                    <Grid item xs={12}>
                      <RHFTextField name="bigQueryServiceAccountJson" label="Service Account JSON" multiline minRows={4} />
                    </Grid>
                  </>
                )}
                {values.bigDataType === "databricks" && (
                  <>
                    <Grid item xs={12}>
                      <RHFTextField name="databricksWorkspaceUrl" label="Workspace URL" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <RHFTextField name="databricksCatalog" label="Catalog" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <RHFTextField name="databricksSchema" label="Schema" />
                    </Grid>
                    <Grid item xs={12}>
                      <RHFTextField name="databricksToken" label="Access Token" type="password" />
                    </Grid>
                  </>
                )}
                {values.bigDataType === "s3" && (
                  <>
                    <Grid item xs={12} md={6}>
                      <RHFTextField name="s3Bucket" label="Bucket" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <RHFTextField name="s3Region" label="Region" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <RHFTextField name="s3AccessKey" label="Access Key" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <RHFTextField name="s3SecretKey" label="Secret Key" type="password" />
                    </Grid>
                    <Grid item xs={12}>
                      <RHFTextField name="s3Prefix" label="Prefix (Optional)" />
                    </Grid>
                  </>
                )}
                <Grid item xs={12}>
                  <RHFTextField name="bigDataDataset" label="Dataset/Table" />
                </Grid>
                <Grid item xs={12}>
                  <RHFTextField name="bigDataQueryFilter" label="Query/Filter" multiline minRows={4} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <RHFTextField name="bigDataLimit" label="Limit" type="number" />
                </Grid>
              </>
            )}
            {values.sourceType === "website" && (
              <>
                <Grid item xs={12}>
                  <RHFTextField
                    name="websiteStartUrls"
                    label="Start URLs (one per line)"
                    multiline
                    minRows={3}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <RHFTextField name="websiteMaxDepth" label="Max Depth" type="number" />
                </Grid>
                <Grid item xs={12} md={4}>
                  <RHFTextField name="websiteMaxPages" label="Max Pages" type="number" />
                </Grid>
                <Grid item xs={12} md={4}>
                  <RHFSelect name="websiteFollowSubdomains" label="Follow Subdomains">
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFSelect name="websiteRespectRobotsTxt" label="Respect robots.txt">
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFSelect name="websiteRenderJs" label="Render JS">
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </RHFSelect>
                </Grid>
                <Grid item xs={12}>
                  <RHFTextField
                    name="websiteIncludePatterns"
                    label="Include Patterns (one per line, optional)"
                    multiline
                    minRows={2}
                  />
                </Grid>
                <Grid item xs={12}>
                  <RHFTextField
                    name="websiteExcludePatterns"
                    label="Exclude Patterns (one per line, optional)"
                    multiline
                    minRows={2}
                  />
                </Grid>
                <Grid item xs={12}>
                  <RHFTextField
                    name="websiteSpecificRequirement"
                    label="Specific Requirement"
                    multiline
                    minRows={3}
                  />
                </Grid>
                <Grid item xs={12}>
                  <RHFTextField
                    name="websiteOutputSchema"
                    label="Output Schema (optional)"
                    multiline
                    minRows={3}
                  />
                </Grid>
              </>
            )}
          </Grid>

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Save
            </LoadingButton>
          </Stack>
        </FormProvider>
      </CustomProcessDialogue>

      <LogsProcessDialogue
        isOpen={logsOpen}
        handleCloseModal={() => setLogsOpen(false)}
        processInstanceId={data?.processInstanceId}
        nodeName={data?.label}
      />
    </Stack>
  );
}

ReactFlowExternalDataSources.propTypes = {
  data: PropTypes.object,
};
