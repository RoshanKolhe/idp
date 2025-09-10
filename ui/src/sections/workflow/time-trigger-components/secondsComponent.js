import { Grid, InputAdornment, Tooltip, IconButton } from "@mui/material";
import { RHFTextField } from "src/components/hook-form";
import Iconify from "src/components/iconify";

export default function SecondsComponent() {
  return (
    <Grid item xs={12} md={12}>
      <RHFTextField
        type="number"
        name="seconds"
        label="Seconds"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title="Workflow will execute at the interval of this many seconds">
                <IconButton edge="end">
                  <Iconify icon="mdi:information-outline" fontSize="small" />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />
    </Grid>
  );
}
