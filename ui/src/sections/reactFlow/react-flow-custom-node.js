import { Box } from "@mui/material"
import PropTypes from "prop-types"
// eslint-disable-next-line import/no-extraneous-dependencies
import { Handle, Position } from "reactflow"

export default function ReactFlowCustomNodeStructure({ data }){
    return(
        <Box sx={{ mt: 6, display: 'flex', justifyContent: 'left' }}>
            {/* Outgoing handle (right side) */}
            <Handle
                type="source"
                position={Position.Right}
                style={{ background: '#555' }}
            />
            {/* Incoming handle (left side)
            <Handle
                type="target"
                position={Position.Top}
                style={{ background: '#555' }}
            /> */}

            {/* Outgoing handle (right side) */}
            {/* <Handle
                type="source"
                position={Position.Bottom}
                style={{ background: '#555' }}
            /> */}
            {/* Incoming handle (left side) */}
            <Handle
                type="target"
                position={Position.Left}
                style={{ background: '#555' }}
            />

            {/* progress line box */}
            <Box
                sx={{
                width: 250,
                height: 250,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: 'rotate(45deg)',
                ...data.style
                }}
            >
                {/* outer circle box */}
                <Box
                    sx={{
                        margin: '10px',
                        width: 180,
                        height: 180,
                        borderRadius: '50%',
                        border: '2px solid white',
                        boxShadow: '0 8px 12px rgba(0, 0, 0, 0.3)', // outer drop shadow
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: 'rotate(-45deg)',
                    }}
                >

                    {/* innner circle box */}
                    <Box
                        sx={{
                        width: 170,
                        height: 170,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(136, 136, 136, 0.20)', 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        color: '#fff',
                        }}
                    >
                        {/* image box */}
                        <Box
                            component='img'
                            src={data.icon}
                            alt='document-proccess'
                        />  
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

ReactFlowCustomNodeStructure.propTypes = {
    data : PropTypes.object,
}