import PropTypes from "prop-types";
import { Box, Stack } from "@mui/material";
import { useState } from "react";
import { CustomWorkflowNode } from "../components";

// Import popup registry from your external package
// eslint-disable-next-line import/no-extraneous-dependencies, import/order
// import popupRegistry from "@workflow/central-popups";

export default function WorkFlowMonorepo({ data }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Get popup component from registry dynamically
  // const PopupComponent = popupRegistry?.[data?.popupKey];

  console.log("External Node Data:", data);
  console.log("Popup Key:", data?.popupKey);
  // console.log("Popup Component Found:", PopupComponent);

  return (
    <Box component="div">
      <Stack spacing={1} direction="column" alignItems="center">

        {/* NODE ICON — click to open popup */}
        <Box
          component="div"
          onClick={handleOpen}
          sx={{ cursor: "pointer" }}
        >
          <CustomWorkflowNode data={data} />
        </Box>

        {/* RENDER POPUP ONLY IF IT EXISTS */}
        {/* {PopupComponent && (
          <PopupComponent
            open={open}
            data={data}
            onClose={handleClose}
          />
        )} */}

      </Stack>
    </Box>
  );
}

WorkFlowMonorepo.propTypes = {
  data: PropTypes.object.isRequired,
};
