import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import PropTypes from "prop-types";
import Iconify from "src/components/iconify";

export default function CustomWorkflowDialogue({isOpen, handleCloseModal, title, children, color}){
    return(
        <Dialog open={isOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
            <DialogTitle sx={{backgroundColor: color, color: 'white', py: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Typography variant='h6'>{title}</Typography>
                <IconButton onClick={handleCloseModal} sx={{border: '1px solid white'}}>
                        <Iconify icon="mdi:close" color="white"/>
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{my: '20px'}}>
                    {children}
                </Box>
            </DialogContent>
        </Dialog>
    )
}

CustomWorkflowDialogue.propTypes = {
    isOpen : PropTypes.bool,
    handleCloseModal : PropTypes.func,
    title: PropTypes.string,
    children: PropTypes.node,
    color: PropTypes.string,
}