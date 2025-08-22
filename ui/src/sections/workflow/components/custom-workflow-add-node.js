import { Box } from "@mui/material";

export default function CustomWorkflowAddNode() {
    return (
        <Box
            component="div"
            sx={{
                width: 220,
                height: 220,
                borderRadius: '50%',
                backgroundColor: '#f5f5f5',         // lighter gray
                border: '10px solid #ccc',          // outer solid border
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                "&:hover": {
                    backgroundColor: '#e0e0e0',
                    borderColor: '#999',
                    transform: 'scale(1.05)',
                },
            }}
        >
            <Box
                sx={{
                    width: 180,
                    height: 180,
                    borderRadius: '50%',
                    // border: '2px dashed #888',       // inner dashed border
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 140,
                    fontWeight: 500,
                    color: '#333',
                    backgroundColor: '#e0e0e0',
                }}
            >
                +
            </Box>
        </Box>
    );
}
