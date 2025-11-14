/* eslint-disable no-shadow */
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { useSnackbar } from 'notistack';
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    ReactFlowProvider,
} from 'reactflow';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'reactflow/dist/style.css';
import { Box, FormControlLabel, Switch } from '@mui/material';
import { workflowAxiosInstance } from 'src/utils/axios';
import { useGetWorkflowBluePrint } from 'src/api/blue-print';
import { useGetWorkflowInstanceExecutionLogs } from 'src/api/workflow-instance';
import { useWorkflowContext } from 'src/sections/workflow/hooks';
import {
    CurvedEdge,
    CustomDottedEdge,
    CustomWorkflowNode,
    ExecutionLogPopup,
    getLayoutedElements,
} from './components';

const nodeTypes = {
    customNode: CustomWorkflowNode,
    ingestion: CustomWorkflowNode,
    notification: CustomWorkflowNode,
    decision: CustomWorkflowNode,
    case: CustomWorkflowNode,
    timeTrigger: CustomWorkflowNode,
    waitTrigger: CustomWorkflowNode,
    approval: CustomWorkflowNode,
    event: CustomWorkflowNode,
    webhook: CustomWorkflowNode,
    variable: CustomWorkflowNode,
    api: CustomWorkflowNode,
    code: CustomWorkflowNode,
    iterator: CustomWorkflowNode,
    iteratorEnd: CustomWorkflowNode,
    crm: CustomWorkflowNode,
}

const edgeTypes = {
    customDottedEdge: CustomDottedEdge,
    curvedEdge: CurvedEdge,
}

const initialNodes = [
    {
        id: '1',
        type: 'customAddNode',
        data: {
            id: '2',
            label: 'Start',
            icon: '/assets/icons/workflow/start.svg',
            style: {
                border: '5px solid ',
                borderTop: '5px solid white',
                borderLeft: '5px solid white',
            },
            borderColor: '#8E24AA',
            bgColor: '#8E24AA',
        },
        position: { x: 0, y: 0 },
    },
];

export default function WorkFlowLogsBoard() {
    const { workflowDirection, setWorkflowDirection } = useWorkflowContext();
    const params = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const { workflowId, outputId } = params;
    const [data, setData] = useState(null);
    const [nodeOutputs, setNodeOutputs] = useState([]);
    const { bluePrints, bluePrintsLoading } = useGetWorkflowBluePrint(workflowId);
    const { executionLogs, executionLogsError } = useGetWorkflowInstanceExecutionLogs(outputId);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [bluePrint, setBluePrint] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [logs, SetLogs] = useState(null);

    const applyLayout = useCallback(() => {
        const { nodes: layouted, edges: layoutedE } = getLayoutedElements(nodes, edges, workflowDirection);
        setNodes(layouted);
        setEdges(layoutedE);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workflowDirection]);

    const onNodeClick = (_, node) => {
        if (node.type !== 'customAddNode' && node.type !== 'decision') {
            const logsData = nodeOutputs.find((output) => output.nodeId === node.id) ?? null;
            SetLogs(logsData);
            setShowModal(true);
        }
    };

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    useEffect(() => {
        applyLayout();
    }, [applyLayout]);

    useEffect(() => {
        if (bluePrints && !bluePrintsLoading) {
            if (bluePrints?.success) {
                setData(bluePrints?.data);
            }
        }
    }, [bluePrints, bluePrintsLoading]);

    useEffect(() => {
        if (data) {
            // setting bluePrint
            setBluePrint(data?.bluePrint);

            // setting direction of bluePrint
            setWorkflowDirection(data?.direction ? data?.direction : 'TB');

            // setting nodes
            const newNodes = data?.nodes?.length > 0 && data?.nodes.map((node) => ({
                ...node,
                data: {
                    ...node.data,
                    logStatus:
                        // eslint-disable-next-line no-nested-ternary
                        nodeOutputs?.find((output) => output?.nodeId === node?.id)?.status ?? 2,
                    bluePrint: data?.bluePrint?.find((item) => item.id === node.data.id)?.component,
                }
            }));

            setNodes(newNodes || initialNodes);

            setEdges(data?.edges || []);
        } else {
            // setting up the nodes...
            setNodes((prev) => [...prev, ...initialNodes.map((node) => (
                {
                    ...node, data: {
                        ...node.data,
                        bluePrint: bluePrint.find((item) => item.id === node.data.id)?.component,
                    }
                }))]);

            // setting up the edges...
            setEdges([{
                id: `e1-2`,
                source: `1`,
                target: `2`,
                animated: true,
                style: { stroke: 'black' },
            }])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, nodeOutputs])

    useEffect(() => {
        if (nodes && nodes.length > 0) {
            const filteredNodes = nodes.filter(
                (node) => node.type !== 'customAddNode' && node.type !== 'decision' && node.type !== 'iteratorEnd'
            );

            setBluePrint((prev) => {
                const existingIds = new Set(prev.map(item => item.id));

                const newBlueprintEntries = filteredNodes
                    .filter((node) => !existingIds.has(node.data.id))
                    .map((node) => ({
                        id: node.data.id,
                        nodeName: node.data.label,
                        component: null,
                    }));

                return [...prev, ...newBlueprintEntries];
            });
        }
    }, [nodes]);

    useEffect(() => {
        if (executionLogs && !executionLogsError) {
            setNodeOutputs(executionLogs.nodeOutputs);
        }
    }, [executionLogs, executionLogsError]);

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={workflowDirection === "LR"}
                            onChange={() =>
                                setWorkflowDirection((prev) =>
                                    prev === "TB" ? "LR" : "TB"
                                )
                            }
                        />
                    }
                    label={
                        workflowDirection === "LR"
                            ? "Horizontal Layout"
                            : "Vertical Layout"
                    }
                />
            </Box>
            <Box
                component='div'
                sx={{ height: '100%' }}
            >
                <ReactFlowProvider>
                    <ReactFlow
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onNodeClick={onNodeClick}
                        onConnect={onConnect}
                        defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
                        nodesDraggable
                    >
                        <MiniMap />
                        <Controls />
                        <Background />
                    </ReactFlow>
                </ReactFlowProvider>
                {showModal &&
                    <ExecutionLogPopup
                        open={showModal}
                        log={logs}
                        onClose={() => {
                            setShowModal(false);
                            SetLogs(null);
                        }
                        }
                    />
                }
            </Box>
        </div>
    );
}
