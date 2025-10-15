import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Stack, Typography, Divider, Alert } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Editor from "@monaco-editor/react";
import FormProvider from "src/components/hook-form";
import Iconify from "src/components/iconify";
import { CustomWorkflowNode, CustomWorkflowDialogue } from "../components";

export default function WorkFlowCode({ data }) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);

  // Default starter code
  const defaultCode = `function main() {
  // Write your custom logic here
  // You can access input variables or make transformations
  console.log("Custom code node executing...");
}
main();`;

  useEffect(() => {
    if (data?.bluePrint?.code) {
      setCode(data.bluePrint.code);
    } else {
      setCode(defaultCode);
    }
  }, [data, defaultCode]);

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const handleRun = () => {
    setError(null);
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function(code);
      fn();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSave = () => {
    try {
      data.functions.handleBluePrintComponent(data.label, data.id, {
        code,
      });
      handleClose();
    } catch (newError) {
      console.error("Error while saving code node", newError);
    }
  };

  return (
    <Box component="div">
      <Stack spacing={1} direction="column" alignItems="center">
        <Box
          component="div"
          onClick={() => setOpen(true)}
          sx={{ cursor: "pointer" }}
        >
          <CustomWorkflowNode data={data} />
        </Box>

        <CustomWorkflowDialogue
          isOpen={open}
          handleCloseModal={handleClose}
          title="Custom JS Logic"
          color={data.bgColor}
        >
          <FormProvider>
            <Typography variant="subtitle1">Write your custom JS logic</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Use the <code>main()</code> function to define your logic. It will be executed automatically.
            </Typography>

            <Divider sx={{ mb: 2 }} />

            {/* 🧠 Monaco Editor */}
            <Box
              sx={{
                borderRadius: 2,
                border: "1px solid #ccc",
                overflow: "hidden",
                height: "300px",
              }}
            >
              <Editor
                height="100%"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value)}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                }}
              />
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                variant="outlined"
                color="info"
                onClick={handleRun}
                startIcon={<Iconify icon="mdi:play" />}
              >
                Run Code
              </LoadingButton>

              <LoadingButton
                variant="contained"
                onClick={handleSave}
                sx={{
                  backgroundColor: data.bgColor,
                  borderColor: data.borderColor,
                }}
              >
                Save
              </LoadingButton>
            </Stack>
          </FormProvider>
        </CustomWorkflowDialogue>
      </Stack>
    </Box>
  );
}

WorkFlowCode.propTypes = {
  data: PropTypes.object.isRequired,
};
