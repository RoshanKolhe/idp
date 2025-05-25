import { Button, Stack, TextField, Typography } from "@mui/material"
import PropTypes from "prop-types"
import { useState } from "react"

export default function FTPComponent({setUrl, onClose}){
    const [filePath, setFilePath] = useState('');

    const handleSubmit = () => {
        if(filePath === ''){
            window.alert('Please enter path');
            return;
        }

        setUrl(filePath);
        onClose();
    }
    return(
        <>
        <Stack direction='column' spacing={1}>
            <Typography variant="h6">Path</Typography>
            <TextField value={filePath} onChange={(e) => setFilePath(e.target.value)} />
        </Stack>
        <Button variant="contained" onClick={() => handleSubmit()}>Add</Button>
        </>
    )
}

FTPComponent.propTypes = {
    setUrl: PropTypes.func,
    onClose: PropTypes.func
}