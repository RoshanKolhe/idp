import { Grid, IconButton, InputAdornment, MenuItem, Stack, Tooltip, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { RHFSelect, RHFTextField } from "src/components/hook-form";
import Iconify from "src/components/iconify";
import { CustomWorkflowVariablePopover } from "../components";

export default function APIBodyTypeRaw({ variables = [] }) {
  const { watch, setValue, getValues } = useFormContext();
  const values = watch();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentField, setCurrentField] = useState({ name: null, ref: null });

  const contentTypeOptions = [
    {
      label: "application/json",
      value: 1,
      description:
        "Sends data in JSON format. Commonly used for REST APIs that expect structured JSON in the request body.",
      helper: (
        <>
          Provide the body in valid <strong>JSON</strong> format.
          Example:
          <pre style={{ background: "#f5f5f5", padding: "8px", borderRadius: "8px" }}>
            {`{
  "userId": "12345",
  "action": "create",
  "timestamp": "2025-10-10T12:00:00Z"
}`}
          </pre>
          You can also use placeholders like <code>{`{userId}`}</code> or <code>{`{timestamp}`}</code>.
        </>
      ),
    },
    {
      label: "text/plain",
      value: 2,
      description:
        "Sends plain text without formatting. Useful for simple string or log data submissions.",
      helper: (
        <>
          Provide raw <strong>plain text</strong> content.
          Example:
          <pre style={{ background: "#f5f5f5", padding: "8px", borderRadius: "8px" }}>
            {/* eslint-disable-next-line react/jsx-curly-brace-presence */}
            {`User 12345 created a new record at 2025-10-10T12:00:00Z`}
          </pre>
        </>
      ),
    },
  ];

  const selectedContentType = contentTypeOptions.find(
    (opt) => opt.value === values.contentType
  );

  const handleFocus = (e, fieldName) => {
    setCurrentField({ name: fieldName, ref: e.target });
    setAnchorEl(e.target);
    setPopoverOpen(true);
  };

  const handleSelectVariable = (variable) => {
    if (!variable || !currentField.name) {
      setPopoverOpen(false);
      return;
    }

    const fieldName = currentField.name;

    if (fieldName === "body") {
      const currentVal = getValues("body") || "";
      setValue("body", `${currentVal}{{${variable}}}`, { shouldValidate: true, shouldDirty: true });
    } else if (fieldName === "to") {
      const currentArr = getValues("to") || [];
      setValue("to", [...currentArr, `{{${variable}}}`], { shouldValidate: true, shouldDirty: true });
    } else {
      // Normal TextField
      const input = currentField.ref;
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const text = input.value;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      const newValue = `${before}{{${variable}}}${after}`;
      input.value = newValue;
      // eslint-disable-next-line no-multi-assign
      input.selectionStart = input.selectionEnd = start + variable.length + 4; // 4 for {{}}
      input.dispatchEvent(new Event('input', { bubbles: true }));
      setValue(fieldName, newValue, { shouldValidate: true, shouldDirty: true });
    }

    setPopoverOpen(false);
  };

  return (
    <>
      <Grid item xs={12} md={12}>
        <RHFSelect
          name="contentType"
          label="Content Type"
          InputProps={{
            endAdornment: (
              <InputAdornment sx={{ mr: 3 }} position="end">
                <Tooltip
                  title={
                    selectedContentType?.description ||
                    "Select the content type"
                  }
                >
                  <IconButton edge="end">
                    <Iconify icon="mdi:information-outline" fontSize="small" />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
        >
          {contentTypeOptions.map((method) => (
            <MenuItem key={method.value} value={method.value}>
              {method.label}
            </MenuItem>
          ))}
        </RHFSelect>
      </Grid>

      <Grid item xs={12}>
        <RHFTextField
          onFocus={(e) => handleFocus(e, "requestContent")}
          name="requestContent"
          label="Request Body"
          multiline
          minRows={3}
          placeholder={
            selectedContentType?.label === "text/plain"
              ? "Enter plain text content here..."
              : `{
  "userId": "12345",
  "action": "create",
  "timestamp": "2025-10-10T12:00:00Z"
}`
          }
        />

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1 }}
          component="div"
        >
          {selectedContentType?.helper || (
            <>Select a content type to view format instructions.</>
          )}
        </Typography>
      </Grid>

      <CustomWorkflowVariablePopover
        open={popoverOpen}
        handleClose={handleSelectVariable}
        anchorEl={anchorEl}
        variables={variables}
      />
    </>
  );
}

APIBodyTypeRaw.propTypes = {
  variables: PropTypes.array
}
