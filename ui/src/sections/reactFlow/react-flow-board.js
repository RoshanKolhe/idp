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
import { Box, Button } from '@mui/material';
import axiosInstance from 'src/utils/axios';
import { useGetBluePrint } from 'src/api/blue-print';
import OperationSelectorModal from './react-flow-operation-model';
import ReactFlowCustomNodeStructure from './react-flow-custom-node';
import {
  ReactFlowAggregator,
  ReactFlowClassify,
  ReactFlowCode,
  ReactFlowDeliver,
  ReactFlowExternalDataSources,
  ReactFlowIntegration,
  ReactFlowDocumentIndex,
  ReactFlowDocumentQuery,
  ReactFlowExtract,
  ReactFlowImageProcessing,
  ReactFlowIngestion,
  ReactFlowRouter,
  ReactFlowValidate,
  getLayoutedElements
} from './components';
import ReactFlowCustomAddNodeStructure from './react-flow-custom-add-node';
import CustomEdgeWithSettings from './react-flow-custom-edge';
import { ReactFlowEdgeSettingPopup } from './edge-setting-components';
import ReactFlowSummaryDrawer from './react-flow-summary-drawer';

const nodeTypes = {
  custom: ReactFlowCustomNodeStructure,
  customAddNode: ReactFlowCustomAddNodeStructure,
  ingestion: ReactFlowIngestion,
  classify: ReactFlowClassify,
  extract: ReactFlowExtract,
  validate: ReactFlowValidate,
  deliver: ReactFlowDeliver,
  externalDataSources: ReactFlowExternalDataSources,
  router: ReactFlowRouter,
  aggregator: ReactFlowAggregator,
  imageProcessing: ReactFlowImageProcessing,
  documentIndex: ReactFlowDocumentIndex,
  documentQuery: ReactFlowDocumentQuery,
  integration: ReactFlowIntegration,
  code: ReactFlowCode,
}

const edgeTypes = {
  settingsEdge: CustomEdgeWithSettings
}

const initialNodes = [
  {
    id: '1',
    type: 'ingestion',
    data: {
      id: '1',
      label: 'Ingestion',
      icon: '/assets/icons/document-process/ignestion.svg',
      style: {
        border: `5px solid #2DCA73`,
        borderRight: '5px solid white',
      },
    },
    position: { x: 0, y: 0 },
  },
  {
    id: '2',
    type: 'customAddNode',
    data: {
      id: '2',
      label: 'New Node',
      icon: '/assets/icons/document-process/add.svg',
      style: {
        border: '5px solid ',
        borderTop: '5px solid white',
        borderLeft: '5px solid white',
      }
    },
    position: { x: 330, y: 0 },
  },
];

export default function ReactFlowBoard({ isUnlock }) {
  const params = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = params;
  const [data, setData] = useState(null);
  const { bluePrints, bluePrintsLoading } = useGetBluePrint(id);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState();
  const [bluePrint, setBluePrint] = useState([]);
  const [presentNodes, setPresentNodes] = useState([]);
  const [borderDirection, setBorderDirection] = useState('down');
  const [showModal, setShowModal] = useState(false);
  const [lastNodeId, setLastNodeId] = useState(undefined);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [edgeSettings, setEdgeSettings] = useState([]);
  const [activeEdgeData, setActiveEdgeData] = useState(null);
  const [edgePopup, setEdgePopup] = useState(false);
  const [splitGroups, setSplitGroups] = useState([]);

  // id generation
  const getNextNodeId = (nodes) => {
    if (!nodes || nodes.length === 0) return "1";

    const maxId = Math.max(...nodes.map((n) => Number(n.id) || 0));
    return String(maxId + 1);
  };

  const getConnectedSourceId = (nodeId) => {
    const connectedEdges = edges.filter((edge) => edge.target === nodeId);

    if (!connectedEdges.length) return null;

    return connectedEdges.map((edge) => edge.source);
  };

  const isDescendantNode = (startId, targetId, edgeList) => {
    const visited = new Set();
    const queue = [String(startId)];

    while (queue.length > 0) {
      const current = queue.shift();
      if (current === String(targetId)) return true;
      if (!visited.has(current)) {
        visited.add(current);
        for (let i = 0; i < edgeList.length; i += 1) {
          const edge = edgeList[i];
          if (String(edge.source) === current) {
            queue.push(String(edge.target));
          }
        }
      }
    }
    return false;
  };
  
  const resolveActiveGroupForNode = (nodeId, edgeList, groups) => groups.find((g) => {
    if (g.isClosed) return false;
    return g.branches.some((branchId) => {
      const directMatch = `${branchId}` === `${nodeId}`;
      const isDesc = isDescendantNode(branchId, nodeId, edgeList);
      return directMatch || isDesc;
    });
  });

  const getBranchEndNode = (branchStartId, edgeList, nodeList) => {
    let currentId = String(branchStartId);
    const visited = new Set();

    while (!visited.has(currentId)) {
      visited.add(currentId);
      let outgoing = null;
      for (let i = 0; i < edgeList.length; i += 1) {
        const edge = edgeList[i];
        if (String(edge.source) === currentId) {
          outgoing = edge;
          break;
        }
      }
      if (!outgoing) break;

      const nextId = String(outgoing.target);
      let nextNode = null;
      for (let i = 0; i < nodeList.length; i += 1) {
        const node = nodeList[i];
        if (String(node.id) === nextId) {
          nextNode = node;
          break;
        }
      }

      if (!nextNode || nextNode.type === 'customAddNode') break;
      currentId = nextId;
    }

    return currentId;
  };

  const collectBranchNodeIds = (sourceNodeId, branchStartId, edgeList, nodeList) => {
    const queue = [`${branchStartId}`];
    const visited = new Set();

    while (queue.length > 0) {
      const currentId = queue.shift();
      if (!visited.has(currentId)) {
        visited.add(currentId);

        const outgoingEdges = edgeList.filter((edge) => `${edge.source}` === currentId);

        outgoingEdges.forEach((edge) => {
          const nextId = `${edge.target}`;
          const nextNode = nodeList.find((node) => `${node.id}` === nextId);
          if (!nextNode) return;

          const incomingEdges = edgeList.filter((candidate) => `${candidate.target}` === nextId);
          const hasExternalIncoming = incomingEdges.some(
            (candidate) =>
              !visited.has(`${candidate.source}`) &&
              `${candidate.source}` !== currentId &&
              `${candidate.source}` !== `${sourceNodeId}`
          );

          if (!hasExternalIncoming) {
            queue.push(nextId);
          }
        });
      }
    }

    return Array.from(visited);
  };

  const collectReachableNodeIds = (nodeList, edgeList) => {
    if (!nodeList || nodeList.length === 0) {
      return new Set();
    }

    const incomingTargets = new Set(edgeList.map((edge) => `${edge.target}`));
    const startNodeIds = nodeList
      .filter((node) => !incomingTargets.has(`${node.id}`) || `${node.id}` === '1')
      .map((node) => `${node.id}`);

    const queue = [...new Set(startNodeIds)];
    const visited = new Set();

    while (queue.length > 0) {
      const currentId = queue.shift();
      if (!visited.has(currentId)) {
        visited.add(currentId);

        edgeList
          .filter((edge) => `${edge.source}` === currentId)
          .forEach((edge) => {
            const nextId = `${edge.target}`;
            if (!visited.has(nextId)) {
              queue.push(nextId);
            }
          });
      }
    }

    return visited;
  };

  // configure settings...
  const configureSettings = (sourceNode, targetNode, settingObj) => {
    setEdgeSettings((prev) => {
      const existingSetting = prev.find((setting) => setting.sourceNode === sourceNode && setting.targetNode === targetNode);

      if (existingSetting) {
        const newSettings = prev.map((setting) => {
          if (setting.id === existingSetting.id) {
            return {
              sourceNode,
              targetNode,
              settings: settingObj
            }
          }

          return setting;
        })

        return newSettings;
      }

      const newSettingObj = {
        id: `set-${sourceNode}-${targetNode}`,
        edgeId: settingObj.edgeId,
        sourceNode,
        targetNode,
        settings: settingObj
      }

      return [...prev, newSettingObj];
    })
  }

  // edge popup function
  const handleEdgePopup = useCallback((payload) => {
    setActiveEdgeData({
      ...payload,
      bluePrint: edgeSettings.find((setting) => setting.sourceNode === payload.sourceNode && setting.targetNode === payload.targetNode) ?? null,
      configureSettings
    });
    setEdgePopup(true);
  }, [edgeSettings]);

  // on close edge popup
  const handleCloseEdgePopup = () => {
    setActiveEdgeData(null);
    setEdgePopup(false);
  }

  const handleDeleteParallelPath = ({ sourceNode, targetNode }) => {
    setNodes((prevNodes) => {
      let nextNodes = [...prevNodes];

      setEdges((prevEdges) => {
        const branchNodeIds = collectBranchNodeIds(sourceNode, targetNode, prevEdges, prevNodes);
        const branchNodeSet = new Set(branchNodeIds.map((nodeId) => `${nodeId}`));

        const branchTrimmedEdges = prevEdges.filter((edge) => {
          const sourceId = `${edge.source}`;
          const targetId = `${edge.target}`;

          if (sourceId === `${sourceNode}` && targetId === `${targetNode}`) {
            return false;
          }

          if (branchNodeSet.has(sourceId) || branchNodeSet.has(targetId)) {
            return false;
          }

          return true;
        });

        const branchTrimmedNodes = prevNodes.filter((node) => !branchNodeSet.has(`${node.id}`));
        const reachableNodeIds = collectReachableNodeIds(branchTrimmedNodes, branchTrimmedEdges);

        const cleanedNodes = branchTrimmedNodes.filter((node) => reachableNodeIds.has(`${node.id}`));
        const cleanedEdges = branchTrimmedEdges.filter(
          (edge) => reachableNodeIds.has(`${edge.source}`) && reachableNodeIds.has(`${edge.target}`)
        );

        const removedNodeLabels = prevNodes
          .filter(
            (node) =>
              !reachableNodeIds.has(`${node.id}`) &&
              node.type !== 'customAddNode'
          )
          .map((node) => node.data?.label)
          .filter(Boolean);

        if (removedNodeLabels.length > 0) {
          setPresentNodes((prev) => prev.filter((nodeLabel) => !removedNodeLabels.includes(nodeLabel)));
          setBluePrint((prev) => prev.filter((node) => !removedNodeLabels.includes(node.nodeName)));
        }

        setSplitGroups((prevGroups) =>
          prevGroups
            .map((group) => ({
              ...group,
              branches: (group.branches || []).filter((branchId) => reachableNodeIds.has(`${branchId}`)),
            }))
            .filter((group) => (group.branches || []).length > 0)
        );

        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(cleanedNodes, cleanedEdges, 'LR');
        nextNodes = layoutedNodes;
        return layoutedEdges;
      });

      return nextNodes;
    });
  };

  const handleBluePrintComponent = (label, updatedComponent) => {
    setBluePrint((prev) => prev.map((node) => {
      if (node.nodeName === label) {
        return {
          ...node,
          component: updatedComponent
        }
      }
      return node;
    }))
  };

  const onNodeClick = (_, node) => {
    if (node.data.label.includes('New Node')) {
      setSelectedNodeId(node.id);
      setShowModal(true);
    }
  };

  const addNewNode = (operation) => {
    if (operation?.type === 'aggregator') {
      handleAggregatorNode(operation);
      return;
    }

    setNodes((prevNodes) => {
      let updatedNodes = [...prevNodes];
      setEdges((prevEdges) => {
        const newOpCompNodeId = getNextNodeId(updatedNodes);
        const newAddNodeId = getNextNodeId([...updatedNodes, { id: newOpCompNodeId }]);

        const clickedNode = nodes.find((n) => n.id === selectedNodeId);
        const baseX = clickedNode?.position?.x || 350;
        const baseY = 0;

        // Space layout
        const gapX = 100;
        const newOperationComponentNode = {
          id: newOpCompNodeId,
          type: operation.type,
          data: {
            id: newOpCompNodeId,
            label: `${operation.title}`,
            icon: operation.icon,
            style: borderDirection === 'up' ? {
              border: `5px solid ${operation.color}`,
              borderBottom: '5px dashed lightgray',
              borderRight: '5px dashed lightgray',
            } : {
              border: `5px solid ${operation.color}`,
              borderTop: '5px dashed lightgray',
              borderLeft: '5px dashed lightgray',
            },
            functions: {
              addToLeft: addNodeToLeft,
              addToRight: addNodeToRight,
              deleteNode,
              handleBluePrintComponent,
              addParallelNode,
              mergeParallelNode,
              ...(operation?.type === 'router' && { handleRouterNode })
            },
            bluePrint: bluePrint.find((item) => item.nodeName === operation?.title)?.component
          },
          position: { x: baseX - 20, y: baseY },
        };

        if (borderDirection === 'up') {
          setBorderDirection('down');
        } else {
          setBorderDirection('up');
        }

        const newAddNode = {
          id: newAddNodeId,
          type: 'customAddNode',
          data: {
            id: newAddNodeId,
            label: '➕ New Node',
            icon: '/assets/icons/document-process/add.svg',
            style: borderDirection === 'down' ? { // reverse opration added
              border: '5px solid #2DCA73',
              borderBottom: '5px solid white',
              borderRight: '5px solid white',
            } : {
              border: '5px solid #2DCA73',
              borderTop: '5px solid white',
              borderLeft: '5px solid white',
            },
          },
          position: { x: baseX + 165 * 2, y: baseY },
        };

        const newEdge = {
          id: `e${clickedNode?.id}-${newOpCompNodeId}`,
          source: `${clickedNode?.id}`,
          target: `${newOpCompNodeId}`,
          animated: true,
          style: { stroke: 'black' },
        };

        // const newCompEdge = {
        //   id: `e${newOpNodeId}-${newOpCompNodeId}`,
        //   source: `${newOpNodeId}`,
        //   target: `${newOpCompNodeId}`,
        //   animated: true,
        //   style: { stroke: 'black' },
        // };

        const addNewEdge = {
          id: `e${newOpCompNodeId}-${newAddNodeId}`,
          source: `${newOpCompNodeId}`,
          target: `${newAddNodeId}`,
          animated: true,
          style: { stroke: 'black' },
        };

        const sourceIds = getConnectedSourceId(selectedNodeId);

        const lastEdges = sourceIds.map((sourceId) => ({
          id: `e${sourceId}-${newOpCompNodeId}`,
          source: `${sourceId}`,
          target: `${newOpCompNodeId}`,
          animated: true,
          style: { stroke: 'black' },
          ...(operation?.type !== 'router' && {
            type: 'settingsEdge',
            data: {
              handleEdgePopup
            }
          })
        }));

        if (operation?.type !== 'router') {
          setPresentNodes((prev) => [...prev, newOperationComponentNode?.data?.label]);
        }

        updatedNodes = updatedNodes.filter((n) => n?.id !== selectedNodeId).concat(newOperationComponentNode, newAddNode);
        const updatedEdges = [
          ...prevEdges.filter((e) => e?.target !== selectedNodeId),
          ...lastEdges,
          ...(addNewEdge ? [addNewEdge] : [])
        ];
        setSplitGroups((prev) => {
          const existing = prev.find((g) => !g.isClosed && sourceIds?.includes(g.sourceNodeId));
          if (existing) {
            return prev.map((g) =>
              g.id === existing.id
                ? { ...g, branches: [...g.branches, `${newOpCompNodeId}`] }
                : g
            );
          }
          return prev;
        });

        if (operation?.type === 'router') {
          setSplitGroups((prev) => {
            const updatedGroups = [
              ...prev,
              {
                id: `split-${newOpCompNodeId}`,
                routerNodeId: `${newOpCompNodeId}`,
                branches: [`${newAddNodeId}`],
                isClosed: false
              }
            ];

            return updatedGroups;
          })
        }
        return updatedEdges;
      })
      return updatedNodes;
    })

    setLastNodeId((id) => id + 1);
    setSelectedNodeId(null);
    setShowModal(false);
  };

  // handle router node...
  const handleRouterNode = (routerNodeId) => {
    setNodes((prevNodes) => {
      let updatedNodes = [...prevNodes];
      setEdges((prevEdges) => {
        let updatedEdges = [...prevEdges];
        const routerNode = updatedNodes.find(n => n.id === routerNodeId);

        if (!routerNode) return updatedEdges;

        const newAddNodePathId = getNextNodeId(updatedNodes);

        const newAddNode = {
          id: newAddNodePathId,
          type: 'customAddNode',
          data: {
            id: newAddNodePathId,
            label: '➕ New Node',
            icon: '/assets/icons/document-process/add.svg',
            style: borderDirection === 'down' ? { // reverse opration added
              border: '5px solid #2DCA73',
              borderBottom: '5px solid white',
              borderRight: '5px solid white',
            } : {
              border: '5px solid #2DCA73',
              borderTop: '5px solid white',
              borderLeft: '5px solid white',
            },
          },
          position: {
            x: routerNode.position.x + 300,
            y: routerNode.position.y + 150,
          },
        };

        const addNewEdge = {
          id: `e${routerNodeId}-${newAddNodePathId}`,
          source: `${routerNodeId}`,
          target: `${newAddNodePathId}`,
          animated: true,
          style: { stroke: 'black' },
        };

        updatedNodes = updatedNodes.concat(newAddNode);

        updatedEdges = updatedEdges.concat(addNewEdge);
        setLastNodeId(newAddNodePathId);

        setSplitGroups(prev => prev.map(g =>
          g.routerNodeId === routerNodeId
            ? { ...g, branches: [...g.branches, newAddNodePathId] }
            : g
        ));
        return updatedEdges;
      })

      return updatedNodes;
    })

    setSelectedNodeId(null);
    setShowModal(false);
  }

  // handle merge node...
  const handleAggregatorNode = (operation) => {
    const sourceNodeIds = getConnectedSourceId(selectedNodeId);

    setNodes((prevNodes) => {
      let updatedNodes = [...prevNodes];

      setEdges((prevEdges) => {
        const newOpCompNodeId = getNextNodeId(updatedNodes);
        const newAddNodeId = getNextNodeId([...updatedNodes, { id: newOpCompNodeId }]);

        const clickedNode = nodes.find((n) => n.id === selectedNodeId);
        const baseX = clickedNode?.position?.x || 350;
        const baseY = 0;

        // Space layout
        const gapX = 100;
        const newOperationComponentNode = {
          id: newOpCompNodeId,
          type: operation.type,
          data: {
            id: newOpCompNodeId,
            label: `${operation.title}`,
            icon: operation.icon,
            style: borderDirection === 'up' ? {
              border: `5px solid ${operation.color}`,
              borderBottom: '5px dashed lightgray',
              borderRight: '5px dashed lightgray',
            } : {
              border: `5px solid ${operation.color}`,
              borderTop: '5px dashed lightgray',
              borderLeft: '5px dashed lightgray',
            },
            functions: {
              addToLeft: addNodeToLeft,
              addToRight: addNodeToRight,
              deleteNode,
              handleBluePrintComponent,
              addParallelNode,
              mergeParallelNode,
              ...(operation?.type === 'router' && { handleRouterNode })
            },
            bluePrint: bluePrint.find((item) => item.nodeName === operation?.title)?.component
          },
          position: { x: baseX - 20, y: baseY },
        };

        if (borderDirection === 'up') {
          setBorderDirection('down');
        } else {
          setBorderDirection('up');
        }

        const newAddNode = {
          id: newAddNodeId,
          type: 'customAddNode',
          data: {
            id: newAddNodeId,
            label: '➕ New Node',
            icon: '/assets/icons/document-process/add.svg',
            style: borderDirection === 'down' ? { // reverse opration added
              border: '5px solid #2DCA73',
              borderBottom: '5px solid white',
              borderRight: '5px solid white',
            } : {
              border: '5px solid #2DCA73',
              borderTop: '5px solid white',
              borderLeft: '5px solid white',
            },
          },
          position: { x: baseX + 165 * 2, y: baseY },
        };

        const addNewEdge = {
          id: `e${newOpCompNodeId}-${newAddNodeId}`,
          source: `${newOpCompNodeId}`,
          target: `${newAddNodeId}`,
          animated: true,
          style: { stroke: 'black' },
        };

        const splitGroup = splitGroups.find((g) => !g.isClosed && g.branches.some((branchId) => sourceNodeIds.includes(branchId)));

        const mergeEdges = splitGroup?.branches?.map((branchId) => ({
          id: `e${branchId}-${newOpCompNodeId}`,
          source: branchId,
          target: `${newOpCompNodeId}`,
          animated: true,
          style: { stroke: '#009688' },
        })) || [];

        const targetedNodes = prevEdges.filter((edge) =>
          splitGroup?.branches?.includes(`${edge.source}`)
        );
        const targetedNodeIds = targetedNodes.map((e) => e.target);

        updatedNodes = updatedNodes.filter(
          (node) => !targetedNodeIds.includes(node.id)
        );

        updatedNodes = updatedNodes.filter((n) => n.id !== selectedNodeId).concat(newOperationComponentNode, newAddNode);

        const updatedEdges = [...prevEdges, ...mergeEdges, addNewEdge];

        setSplitGroups(prev =>
          prev.map(g =>
            g?.id === splitGroup?.id ? { ...g, isClosed: true } : g
          )
        );

        return updatedEdges;
      })
      return updatedNodes;
    })
    setLastNodeId((id) => id + 1);
    setSelectedNodeId(null);
    setShowModal(false);
  }

  const addParallelNode = (sourceNodeId, operation) => {
    setNodes((prevNodes) => {
      let updatedNodes = [...prevNodes];

      setEdges((prevEdges) => {
        let updatedEdges = [...prevEdges];
        const sourceNode = updatedNodes.find((n) => n.id === `${sourceNodeId}`);
        if (!sourceNode) return updatedEdges;

        const activeGroup = splitGroups.find((g) => !g.isClosed && g.sourceNodeId === `${sourceNodeId}`);

        const newOpCompNodeId = getNextNodeId(updatedNodes);
        const newAddNodeId = getNextNodeId([...updatedNodes, { id: newOpCompNodeId }]);
        const branchCount = activeGroup?.branches?.length || 0;
        const baseX = sourceNode.position.x + 320;
        const baseY = sourceNode.position.y + (branchCount * 170);

        const newOperationComponentNode = {
          id: newOpCompNodeId,
          type: operation.type,
          data: {
            id: newOpCompNodeId,
            label: `${operation.title}`,
            icon: operation.icon,
            style: {
              border: `5px solid ${operation.color}`,
              borderTop: '5px dashed lightgray',
              borderLeft: '5px dashed lightgray',
            },
            functions: {
              addToLeft: addNodeToLeft,
              addToRight: addNodeToRight,
              deleteNode,
              handleBluePrintComponent,
              addParallelNode,
              mergeParallelNode
            },
            bluePrint: bluePrint.find((item) => item.nodeName === operation?.title)?.component
          },
          position: { x: baseX, y: baseY + 500 },
        };

        const newAddNode = {
          id: newAddNodeId,
          type: 'customAddNode',
          data: {
            id: newAddNodeId,
            label: '➕ New Node',
            icon: '/assets/icons/document-process/add.svg',
            style: {
              border: '5px solid #2DCA73',
              borderTop: '5px solid white',
              borderLeft: '5px solid white',
            },
          },
          position: { x: baseX + 300, y: baseY + 500 },
        };

        updatedNodes = updatedNodes.concat(newOperationComponentNode, newAddNode);
        updatedEdges = updatedEdges.concat(
          {
            id: `e${sourceNodeId}-${newOpCompNodeId}`,
            source: `${sourceNodeId}`,
            target: `${newOpCompNodeId}`,
            animated: true,
            style: { stroke: 'black' },
            type: 'settingsEdge',
            data: {
              showDeletePathControl: true,
              handleDeletePath: handleDeleteParallelPath,
            }
          },
          {
            id: `e${newOpCompNodeId}-${newAddNodeId}`,
            source: `${newOpCompNodeId}`,
            target: `${newAddNodeId}`,
            animated: true,
            style: { stroke: 'black' },
          }
        );

        setSplitGroups((prev) => {
          const existing = prev.find((g) => !g.isClosed && g.sourceNodeId === `${sourceNodeId}`);
          if (existing) {
            return prev.map((g) =>
              g.id === existing.id
                ? { ...g, branches: [...g.branches, `${newOpCompNodeId}`] }
                : g
            );
          }

          return [
            ...prev,
            {
              id: `split-${sourceNodeId}`,
              sourceNodeId: `${sourceNodeId}`,
              branches: [`${newOpCompNodeId}`],
              isClosed: false
            }
          ];
        });

        setPresentNodes((prev) => [...prev, newOperationComponentNode.data.label]);
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(updatedNodes, updatedEdges, 'LR');
        updatedNodes = layoutedNodes;
        return layoutedEdges;
      });

      return updatedNodes;
    });
  }

  const mergeParallelNode = (currentNodeId) => {
    setNodes((prevNodes) => {
      let updatedNodes = [...prevNodes];

      setEdges((prevEdges) => {
        let activeGroup;
        setSplitGroups((prev) => {
          activeGroup = resolveActiveGroupForNode(
            currentNodeId,
            prevEdges,
            prev
          );

          return prev;
        })

        if (!activeGroup) return prevEdges;

        // Find last node of each branch
        const effectiveBranches = activeGroup.branches.map((branchId) =>
          getBranchEndNode(branchId, prevEdges, updatedNodes)
        );

        const newAddNodeId = getNextNodeId([...updatedNodes]);
        const baseX = 350;
        const baseY = 0;

        const newAddNode = {
          id: newAddNodeId,
          type: 'customAddNode',
          data: {
            id: newAddNodeId,
            label: '➕ New Node',
            icon: '/assets/icons/document-process/add.svg',
            style: borderDirection === 'down' ? { // reverse opration added
              border: '5px solid #2DCA73',
              borderBottom: '5px solid white',
              borderRight: '5px solid white',
            } : {
              border: '5px solid #2DCA73',
              borderTop: '5px solid white',
              borderLeft: '5px solid white',
            },
          },
          position: { x: baseX + 165 * 2, y: baseY },
        };

        const nodesToRemove = [];
        const edgesToRemove = [];

        effectiveBranches.map((branchId) => {
          const edge = prevEdges.find((edge) => edge.source === branchId);

          if (edge) {
            const nodeToRemove = updatedNodes.find((node) => node.id === edge.target && node.type === 'customAddNode');

            if (nodeToRemove) {
              nodesToRemove.push(nodeToRemove.id);
              edgesToRemove.push(edge.id);
            }
          }

          return branchId;
        })

        // Create merge edges
        const mergeEdges = effectiveBranches
          .map((branchId) => ({
            id: `e${branchId}-${newAddNodeId}`,
            source: `${branchId}`,
            target: `${newAddNodeId}`,
            animated: true,
            style: { stroke: '#009688' },
          }));

        // // Find nodes to remove
        // const targetedNodes = prevEdges.filter((edge) =>
        //   effectiveBranches.includes(`${edge.source}`)
        // );

        // const targetedNodeIds = targetedNodes
        //   .map((e) => e.target)
        //   .filter((id) => id !== currentNodeId);

        // // Remove merged nodes
        // updatedNodes = updatedNodes.filter(
        //   (node) => !targetedNodeIds.includes(node.id)
        // );

        updatedNodes = updatedNodes.filter((node) => !nodesToRemove.includes(node.id)).concat(newAddNode);
        prevEdges = prevEdges.filter((edge) => !edgesToRemove.includes(edge.id));

        // Clean edges
        const updatedEdges = prevEdges
          // .filter((edge) => !targetedNodeIds.includes(edge.target))
          // .filter((edge) => !effectiveBranches.includes(edge.target))
          .concat(...mergeEdges);

        // Close group
        setSplitGroups((prev) =>
          prev.map((g) =>
            g.id === activeGroup.id
              ? { ...g, isClosed: true }
              : g
          )
        );
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(updatedNodes, updatedEdges, 'LR');
        updatedNodes = layoutedNodes;
        return layoutedEdges;
      });

      return updatedNodes;
    });
  };

  const onConnect = useCallback(
    (params) => {
      if (!params?.source || !params?.target) {
        return;
      }

      const sourceNode = nodes.find((node) => `${node.id}` === `${params.source}`);
      const nextEdge = {
        ...params,
        id: `e${params.source}-${params.target}`,
        animated: true,
        style: { stroke: 'black' },
        ...(sourceNode?.type !== 'router' && {
          type: 'settingsEdge',
          data: {
            handleEdgePopup
          }
        })
      };

      const connectedAddNodeIds = edges
        .filter((edge) => `${edge.source}` === `${params.source}`)
        .map((edge) => nodes.find((node) => `${node.id}` === `${edge.target}`))
        .filter((node) => node?.type === 'customAddNode')
        .map((node) => `${node.id}`);

      if (connectedAddNodeIds.length > 0) {
        setNodes((prevNodes) =>
          prevNodes.filter((node) => !connectedAddNodeIds.includes(`${node.id}`))
        );

        setEdges((prevEdges) => {
          const filteredEdges = prevEdges.filter(
            (edge) =>
              !connectedAddNodeIds.includes(`${edge.source}`) &&
              !connectedAddNodeIds.includes(`${edge.target}`)
          );
          return addEdge(nextEdge, filteredEdges);
        });

        setSplitGroups((prevGroups) =>
          prevGroups.map((group) => ({
            ...group,
            branches: (group.branches || []).map((branchId) =>
              connectedAddNodeIds.includes(`${branchId}`) ? `${params.target}` : branchId
            ),
          }))
        );

        return;
      }

      setEdges((prevEdges) => addEdge(nextEdge, prevEdges));
    },
    [edges, handleEdgePopup, nodes, setEdges, setNodes, setSplitGroups]
  );

  // add node to left
  const addNodeToLeft = (id, operation) => {
    const targetId = Number(id);
    const gapX = 370;

    const currentNode = nodes?.find((node) => Number(node.id) === targetId);
    if (!currentNode) return;

    setEdges((currentEdges) => currentEdges.map((edge) => {
      const sourceNum = Number(edge.source);
      const targetNum = Number(edge.target);

      if (targetNum >= targetId) {
        return {
          ...edge,
          id: `e${sourceNum + 1}-${targetNum + 1}`,
          source: `${sourceNum + 1}`,
          target: `${targetNum + 1}`,
        };
      }
      return edge;
    }));

    setNodes((currentNodes) => {
      const incrementedNodes = currentNodes.map((node) => {
        const nodeIdNum = Number(node.id);
        if (nodeIdNum >= targetId) {
          const newId = nodeIdNum + 1;
          return {
            ...node,
            id: `${newId}`,
            data: {
              ...node.data,
              id: `${newId}`,
            },
            position: {
              x: node.position.x + gapX,
              y: node.position.y,
            },
          };
        }
        return node;
      });

      const newNode = {
        id: `${targetId}`,
        type: operation.type,
        data: {
          id: `${targetId}`,
          label: `${operation.title}`,
          icon: operation.icon,
          style:
            borderDirection === 'up'
              ? {
                border: `5px solid ${operation.color}`,
                borderBottom: '5px dashed lightgray',
                borderRight: '5px dashed lightgray',
              }
              : {
                border: `5px solid ${operation.color}`,
                borderTop: '5px dashed lightgray',
                borderLeft: '5px dashed lightgray',
              },
          functions: {
            addToLeft: addNodeToLeft,
            addToRight: addNodeToRight,
            deleteNode,
            handleBluePrintComponent,
            addParallelNode,
            mergeParallelNode
          },
          bluePrint: bluePrint.find((item) => item.nodeName === operation?.title)?.component
        },
        position: {
          x: currentNode.position.x,
          y: currentNode.position.y,
        },
      };

      const beforeNodes = incrementedNodes.filter((node) => Number(node.id) < targetId);
      const afterNodes = incrementedNodes.filter((node) => Number(node.id) >= targetId);

      return [...beforeNodes, newNode, ...afterNodes];
    });

    setEdges((prev) => [...prev, {
      id: `${Number(id) - 1}-e${id}`,
      source: `${Number(id) - 1}`,
      target: `${id}`,
      animated: true,
      style: { stroke: 'black' },
      type: 'settingsEdge',
      data: {
        handleEdgePopup
      }
    }])

    setPresentNodes((prev) => [...prev, operation?.title]);

  };

  // add node to right
  const addNodeToRight = (id, operation) => {
    const targetId = Number(id);
    const gapX = 350; // horizontal gap for layout shift

    const currentNode = nodes?.find((node) => Number(node.id) === targetId);
    if (!currentNode) return;

    // Update edges: shift edges with source or target >= targetId + 1
    setEdges((currentEdges) =>
      currentEdges.map((edge) => {
        const sourceNum = Number(edge.source);
        const targetNum = Number(edge.target);

        if (sourceNum >= targetId + 1 || targetNum >= targetId + 1) {
          return {
            ...edge,
            id: `e${sourceNum + 1}-${targetNum + 1}`,
            source: `${sourceNum + 1}`,
            target: `${targetNum + 1}`,
            animated: true,
            style: { stroke: 'black' },
          };
        }
        return edge;
      })
    );

    setNodes((currentNodes) => {
      // Shift nodes with id >= targetId + 1
      const incrementedNodes = currentNodes.map((node) => {
        const nodeIdNum = Number(node.id);
        if (nodeIdNum >= targetId + 1) {
          const newId = nodeIdNum + 1;
          return {
            ...node,
            id: `${newId}`,
            data: { ...node.data, id: `${newId}` },
            position: {
              x: node.position.x + gapX,
              y: node.position.y,
            },
          };
        }
        return node;
      });

      // New node inserted to the right of targetId
      const newNodeId = targetId + 1;
      const newNode = {
        id: `${newNodeId}`,
        type: operation.type,
        data: {
          id: `${newNodeId}`,
          label: `${operation.title}`,
          icon: operation.icon,
          style:
            borderDirection === 'up'
              ? {
                border: `5px solid ${operation.color}`,
                borderBottom: '5px dashed lightgray',
                borderRight: '5px dashed lightgray',
              }
              : {
                border: `5px solid ${operation.color}`,
                borderTop: '5px dashed lightgray',
                borderLeft: '5px dashed lightgray',
              },
          functions: {
            addToLeft: addNodeToLeft,
            addToRight: addNodeToRight,
            deleteNode,
            handleBluePrintComponent,
            addParallelNode,
            mergeParallelNode
          },
          bluePrint: bluePrint.find((item) => item.nodeName === operation?.title)?.component
        },
        position: {
          x: currentNode.position.x + gapX,
          y: currentNode.position.y,
        },
      };

      // Place new node after the original node
      const beforeNodes = incrementedNodes.filter((node) => Number(node.id) <= targetId);
      const afterNodes = incrementedNodes.filter((node) => Number(node.id) > targetId);

      return [...beforeNodes, newNode, ...afterNodes];
    });

    // Add edge from original node to the new node
    setEdges((prev) => [
      ...prev,
      {
        id: `e${targetId}-${targetId + 1}`,
        source: `${targetId}`,
        target: `${targetId + 1}`,
        animated: true,
        style: { stroke: 'black' },
        type: 'settingsEdge',
        data: {
          handleEdgePopup
        }
      },
    ]);

    setPresentNodes((prev) => [...prev, operation?.title]);
  };

  // delete node
  const deleteNode = (id, label) => {
    const deleteId = Number(id);
    const gapX = 370;

    let prevNodeId = null;
    let nextNodeId = null;

    // Step 1: Determine prev and next nodes from edges
    setEdges((currentEdges) => {
      const filteredEdges = currentEdges.filter(edge => {
        const source = Number(edge.source);
        const target = Number(edge.target);

        if (target === deleteId) prevNodeId = source;
        if (source === deleteId) nextNodeId = target;

        return source !== deleteId && target !== deleteId;
      });

      // Step 2: If both neighbors exist, add a new edge between them
      if (prevNodeId !== null && nextNodeId !== null) {
        filteredEdges.push({
          id: `e${prevNodeId}-${nextNodeId}`,
          source: `${prevNodeId}`,
          target: `${nextNodeId}`,
          animated: true,
          style: { stroke: 'black' },
        });
      }

      // Step 3: Adjust remaining edge IDs
      const updatedEdges = filteredEdges.map(edge => {
        let sourceNum = Number(edge.source);
        let targetNum = Number(edge.target);

        if (sourceNum > deleteId) sourceNum -= 1;
        if (targetNum > deleteId) targetNum -= 1;

        return {
          ...edge,
          id: `e${sourceNum}-${targetNum}`,
          source: `${sourceNum}`,
          target: `${targetNum}`,
        };
      });

      return updatedEdges;
    });

    // Step 4: Remove node and shift remaining nodes
    setNodes((currentNodes) => {
      const filteredNodes = currentNodes.filter(node => Number(node.id) !== deleteId);

      return filteredNodes.map(node => {
        const nodeIdNum = Number(node.id);
        if (nodeIdNum > deleteId) {
          const newId = nodeIdNum - 1;
          return {
            ...node,
            id: `${newId}`,
            data: { ...node.data, id: `${newId}` },
            position: {
              x: node.position.x - gapX,
              y: node.position.y,
            },
          };
        }
        return node;
      });
    });

    setPresentNodes((prev) => prev.filter((node) => node !== label));
    setBluePrint((prev) => prev.filter((node) => node.nodeName !== label));

  };

  // handle empty components
  const handleEmptyComponents = () => {
    const emptyComponent = bluePrint.find((node) => node.component === null);
    return emptyComponent;
  }

  // submit blueprint
  const handleSubmitBluePrint = async () => {
    try {
      const emptyComponent = handleEmptyComponents();
      if (emptyComponent) {
        enqueueSnackbar(`Please complete ${emptyComponent.nodeName} node`, { variant: 'error' });
        return;
      }
      const data = {
        bluePrint,
        nodes,
        edges,
        processesId: Number(id),
        isActive: true
      };

      if (edgeSettings.length > 0) {
        data.edgeSettings = edgeSettings;
      }

      const response = await axiosInstance.post('/blue-prints', data);
      if (response?.data) {
        enqueueSnackbar("Blue Print Saved", { variant: 'success' });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : error.error.message, {
        variant: 'error',
      });
    }
  }

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

      const newPresentNodes = data?.bluePrint.length > 0 ? data?.bluePrint.map((item) => item.nodeName) : [];
      setPresentNodes(newPresentNodes);

      // setting nodes
      const newNodes = data?.nodes?.length > 0 && data?.nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          functions: {
            addToLeft: addNodeToLeft,
            addToRight: addNodeToRight,
            deleteNode,
            handleBluePrintComponent,
            addParallelNode,
            mergeParallelNode
          },
          bluePrint: data?.bluePrint?.find((item) => item.nodeName === node.data.label)?.component,
        }
      }));

      setNodes(newNodes || initialNodes);

      setLastNodeId(newNodes?.length || 2);

      setEdges(data?.edges?.length > 0 ? data?.edges?.map((edge) => ({
        ...edge,
        data: {
          handleEdgePopup
        }
      })) : []);

      setEdgeSettings(data?.edgeSettings || []);
    } else {
      // setting up the nodes...
      setNodes((prev) => [...prev, ...initialNodes.map((node) => (
        {
          ...node, data: {
            ...node.data,
            functions: {
              addToLeft: addNodeToLeft,
              addToRight: addNodeToRight,
              deleteNode,
              handleBluePrintComponent,
              addParallelNode,
              mergeParallelNode
            },
            bluePrint: bluePrint.find((item) => item.nodeName === node.data.label)?.component,
          }
        }))]);

      setLastNodeId(2);

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
  }, [data]);

  useEffect(() => {
    if (nodes && nodes.length > 0) {
      const filteredNodes = nodes.filter((node) => node.type !== 'customAddNode' && node.type !== 'router');

      setBluePrint((prev) => {
        const existingNames = new Set(prev.map(item => item.nodeName));

        const newBlueprintEntries = filteredNodes
          .filter((node) => !existingNames.has(node.data.label))
          .map((node) => ({
            nodeName: node.data.label,
            component: null,
          }));

        return [...prev, ...newBlueprintEntries];
      });
    }
  }, [nodes]);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
        <Button onClick={() => handleSubmitBluePrint()} variant='contained'>Save</Button>
      </Box>
      <ReactFlowProvider >
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
          nodesDraggable={isUnlock}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
        {showModal && <OperationSelectorModal open={showModal} onSelect={addNewNode} onClose={() => setShowModal(false)} bluePrintNode={presentNodes} />}
        <ReactFlowEdgeSettingPopup isOpen={edgePopup} data={activeEdgeData} handleCloseModal={() => handleCloseEdgePopup()} />
      </ReactFlowProvider>
      <ReactFlowSummaryDrawer bluePrint={bluePrint} />
    </div>
  );
}

ReactFlowBoard.propTypes = {
  isUnlock: PropTypes.bool
}
