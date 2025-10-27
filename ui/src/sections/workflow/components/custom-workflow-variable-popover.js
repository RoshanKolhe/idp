import { useState, useMemo } from "react";
import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Popover,
    TextField,
    Box,
    Typography,
    InputAdornment,
} from "@mui/material";
import PropTypes from "prop-types";
import Iconify from "src/components/iconify";

export default function CustomWorkflowVariablePopover({ open, handleClose, anchorEl, variables }) {
    const [searchTerm, setSearchTerm] = useState("");

    // Filter variables based on search term
    const filteredVariables = useMemo(() => {
        if (!searchTerm) return variables;
        return variables.filter((v) =>
            `${v.nodeId}.${v.variableName}`.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, variables]);

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={() => handleClose(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            disableEnforceFocus
            disableAutoFocus
            disableRestoreFocus
            disablePortal
            PaperProps={{
                sx: {
                    width: 250,
                    maxHeight: 300,
                    p: 1,
                    borderRadius: 2,
                    mt: 2
                }
            }}
        >
            <Box sx={{ mb: 1 }}>
                <TextField
                    size="small"
                    fullWidth
                    placeholder="Search variable..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Iconify icon="eva:search-fill" fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <List dense>
                {filteredVariables.length > 0 ? (
                    filteredVariables.map((v, i) => (
                        <ListItem key={i} disablePadding>
                            <ListItemButton
                                onClick={() => handleClose(`${v.nodeId}.${v.variableName}`)}
                                sx={{
                                    '&:hover': { backgroundColor: 'primary.light' },
                                    borderRadius: 1,
                                }}
                            >
                                <ListItemText
                                    primary={`${v.variableName}`}
                                    secondary={v.variableValue}
                                    primaryTypographyProps={{ fontWeight: 500 }}
                                    secondaryTypographyProps={{ fontSize: '0.8rem', color: 'text.secondary' }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))
                ) : (
                    <Typography variant="body2" sx={{ textAlign: 'center', mt: 1 }}>
                        No variables found
                    </Typography>
                )}
            </List>
        </Popover>
    );
}

CustomWorkflowVariablePopover.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    anchorEl: PropTypes.any,
    variables: PropTypes.arrayOf(
        PropTypes.shape({
            variableName: PropTypes.string.isRequired,
            variableValue: PropTypes.string,
            nodeId: PropTypes.string.isRequired,
        })
    ),
};
