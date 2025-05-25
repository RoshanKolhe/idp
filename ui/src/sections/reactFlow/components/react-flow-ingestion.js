import PropTypes from "prop-types";
import { useState } from "react";
import { Button, Dialog, DialogContent, DialogTitle, MenuItem, Select, Stack, Typography } from "@mui/material";
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactFlowCustomNodeStructure from "../react-flow-custom-node";
import { FTPComponent } from "../ingestion-components";

// channel options
const channelOptions = [
    {label: 'FTP', value: 'ftp', isDisabled: false},
    {label: 'API', value: 'api', isDisabled: true},
    {label: 'HTTP/HTTPS', value: 'http', isDisabled: true},
    {label: 'UI/PORTAL', value: 'ui', isDisabled: true},
]

// switch case functions
function Switch({opt, setUrl, onClose}){
    let component;

    switch(opt){
        case 'ftp':
            component = <FTPComponent setUrl={setUrl} onClose={onClose}/>;
            break;

        default :
            component = <div />
    }

    return(
        <>{component}</>
    )
}

Switch.propTypes = {
    opt : PropTypes.string,
    setUrl : PropTypes.func,
    onClose : PropTypes.func,
}

export default function ReactFlowIngestion({data}){
    const [channelType, setChannelType] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [url, setUrl] = useState('');

    // Open modal
    const handleOpenModal = () => {
        setIsOpen(true);
    };

    // Close modal
    const handleCloseModal = () => {
        setIsOpen(false);
    }

    return(
        <Stack sx={{marginTop: 3}} spacing={1}>
            <ReactFlowCustomNodeStructure data={data}/>
            <Typography variant='h5'>1. {data.label}</Typography>
            <Typography variant='h6'>{channelType}</Typography>
            <Typography variant='body2'>{url}</Typography>
            <Button sx={{width: '200px', color: 'royalBlue', borderColor: 'royalBlue'}} variant='outlined' onClick={() => handleOpenModal()}>Add Channel</Button>
            <Dialog open={isOpen} onClose={handleCloseModal} maxWidth="xs" fullWidth>
                <DialogTitle>Select an Operation</DialogTitle>
                <DialogContent dividers>
                    <Stack direction='column' spacing={1}>
                        <Typography variant="h6">Channel Type</Typography>
                        <Select placeholder="Select channel type" value={channelType} onChange={(e) => setChannelType(e.target.value)}>
                            {channelOptions.length > 0 ? channelOptions.map((channel) => (
                                <MenuItem disabled={channel.isDisabled} key={channel?.value} value={channel?.value}>{channel?.label}</MenuItem>
                            )) : (
                                <MenuItem disabled value=''>No channels found</MenuItem>
                            )}
                        </Select>
                        <Switch opt={channelType} setUrl={setUrl} onClose={handleCloseModal}/>
                    </Stack>
                </DialogContent>
            </Dialog>
        </Stack>
    )
}

ReactFlowIngestion.propTypes = {
    data : PropTypes.object
}