import { Grid, InputAdornment, Tooltip, IconButton } from "@mui/material";
import { RHFTextField } from "src/components/hook-form";
import Iconify from "src/components/iconify";

export default function MinutesComponent() {
  return (
    <Grid item xs={12} md={12}>
      <RHFTextField
        type="number"
        name="minutes"
        label="Minutes Between Triggers"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title="Workflow will execute at the interval of this many minutes">
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
