import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Alert, Button, Divider, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Editor from "@monaco-editor/react";
import ReactFlowCustomNodeStructure from "../react-flow-custom-node";
import CustomProcessDialogue from "./components-dialogue";
import LogsProcessDialogue from "./logs-dialogue";

const DEFAULT_CODE = `function main() {
  // Write your custom logic here
  // Return a plain object for downstream nodes
  return {
    message: "Code node executed"
  };
}

return main();`;

export default function ReactFlowCode({ data }) {
  const [isOpen, setIsOpen] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [error, setError] = useState(null);

  const resolvedCode = useMemo(
    () => data?.bluePrint?.code || DEFAULT_CODE,
    [data]
  );

  useEffect(() => {
    setCode(resolvedCode);
    setError(null);
  }, [resolvedCode]);

  const handleRun = () => {
    setError(null);
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function(code);
      fn();
    } catch (runError) {
      setError(runError.message);
    }
  };

  const handleSave = () => {
    data?.functions?.handleBluePrintComponent(data?.label, {
      code,
    });
    setIsOpen(false);
  };

  const codeLineCount = useMemo(() => {
    if (!code) return 0;
    return code.split("\n").length;
  }, [code]);

  return (
    <Stack sx={{ marginTop: 3 }} spacing={1}>
      <ReactFlowCustomNodeStructure data={data} />
      <Typography variant="h5">{data?.label}</Typography>
      <Divider />
      <Typography variant="body1"><b>Language:</b> JavaScript</Typography>
      <Typography variant="body1"><b>Lines:</b> {codeLineCount}</Typography>
      <Typography variant="body1">
        <b>Status:</b> {data?.bluePrint?.code ? "Configured" : "Using starter template"}
      </Typography>

      {data?.isProcessInstance !== true && (
        <Button
          sx={{ width: "180px", color: "royalBlue", borderColor: "royalBlue" }}
          variant="outlined"
          onClick={() => setIsOpen(true)}
        >
          Configure Code
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
        title="Configure Code Node"
        isOpen={isOpen}
        handleCloseModal={() => setIsOpen(false)}
      >
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            Write JavaScript that will run in the code node. Keep the return value structured so downstream nodes can use it.
          </Typography>

          <Editor
            height="360px"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              automaticLayout: true,
              scrollBeyondLastLine: false,
            }}
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <LoadingButton variant="outlined" color="info" onClick={handleRun}>
              Run Code
            </LoadingButton>
            <LoadingButton variant="contained" onClick={handleSave}>
              Save
            </LoadingButton>
          </Stack>
        </Stack>
      </CustomProcessDialogue>

      <LogsProcessDialogue
        isOpen={logsOpen}
        handleCloseModal={() => setLogsOpen(false)}
        processInstanceTransactionId={data?.processInstanceTransactionId}
        processInstanceId={data?.processInstanceId}
        nodeName={data?.label}
      />
    </Stack>
  );
}

ReactFlowCode.propTypes = {
  data: PropTypes.object,
};
