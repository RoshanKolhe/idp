import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
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
import OperationSelectorModal from './react-flow-operation-model';
import ReactFlowCustomNodeStructure from './react-flow-custom-node';
import { ReactFlowClassify, ReactFlowExtract, ReactFlowIngestion } from './components';

const nodeTypes = {
  custom : ReactFlowCustomNodeStructure,
  ingestion : ReactFlowIngestion,
  classify : ReactFlowClassify,
  extract : ReactFlowExtract,
}

const initialNodes = [
  {
    id: '1',
    type: 'ingestion',
    data: {
      label: 'Ingestion',
      icon: '/assets/icons/document-process/ignestion.svg',
      style: {
        border: '5px solid #2DCA73',
        borderRight: '5px solid white',
      }
    },
    position: { x: 0, y: 0 },
  },
  {
    id: '2',
    type: 'custom',
    data: {
      label: 'New Node',
      icon: '/assets/icons/document-process/add.svg',
      style: {
        border: '5px solid #2DCA73',
        borderTop: '5px solid white',
        borderLeft: '5px solid white',
      }
    },
    position: { x: 330, y: 0 },
  },
];

export default function ReactFlowBoard({isUnlock}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([{
    id: `e1-2`,
    source: `1`,
    target: `2`,
    animated: true,
    style: { stroke: 'black' },
  }]);
  const [borderDirection, setBorderDirection] = useState('down');
  const [showModal, setShowModal] = useState(false);
  const [lastNodeId, setLastNodeId] = useState(2);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

 const onNodeClick = (_, node) => {
    if (node.data.label.includes('New Node')) {
      setSelectedNodeId(node.id);
      setShowModal(true);
    }
  };

  const addNewNode = (operation) => {
    // const newOpNodeId = `${lastNodeId + 1}`;
    const newOpCompNodeId = `${lastNodeId + 1}`;
    const newAddNodeId = `${lastNodeId + 2}`;

    const clickedNode = nodes.find((n) => n.id === selectedNodeId);
    const baseX = clickedNode?.position?.x || 350;
    const baseY = 0;

    // Space layout
    const gapX = 100;

    

    const newOperationComponentNode = {
      id: newOpCompNodeId,
      type: operation.type,
      data: {
        label: `${operation.title} Component`,
        icon: operation.icon,
        style: borderDirection === 'up' ? {
          border: '5px solid #2DCA73',
          borderBottom: '5px solid white',
          borderRight: '5px solid white',
        } : {
          border: '5px solid #2DCA73',
          borderTop: '5px solid white',
          borderLeft: '5px solid white',
        } 
      },
      position: { x: baseX - 20, y: baseY },
    };

    if(borderDirection === 'up'){
      setBorderDirection('down');
    }else{
      setBorderDirection('up');
    }

    const isNewEven = parseInt(newAddNodeId, 10) % 2 === 0; 

    const newAddNode = {
      id: newAddNodeId,
      type: 'custom',
      data: { 
        label: '➕ New Node', 
        icon: '/assets/icons/document-process/add.svg' ,
        style: borderDirection === 'down' ? { // reverse opration added
          border: '5px solid #2DCA73',
          borderBottom: '5px solid white',
          borderRight: '5px solid white',
        } : {
          border: '5px solid #2DCA73',
          borderTop: '5px solid white',
          borderLeft: '5px solid white',
        }
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

    const lastEdge = {
      id: `e${lastNodeId-1}-${newOpCompNodeId}`,
      source: `${lastNodeId-1}`,
      target: `${newOpCompNodeId}`,
      animated: true,
      style: { stroke: 'black' },
    }

    setNodes((nds) =>
      nds
        .filter((n) => n.id !== selectedNodeId)
        .concat(newOperationComponentNode, newAddNode)
    );

    setEdges((eds) => 
      eds
      .filter((e) => e.target !== selectedNodeId)
      .concat(lastEdge, addNewEdge)
    );

    setLastNodeId((id) => id + 2);
    setSelectedNodeId(null);
    setShowModal(false);
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  console.log('nodes', nodes);
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlowProvider >
        <ReactFlow
          nodeTypes={nodeTypes}
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
        {showModal && <OperationSelectorModal open={showModal} onSelect={addNewNode} onClose={() => setShowModal(false)} />}
      </ReactFlowProvider>
    </div>
  );
}

ReactFlowBoard.propTypes = {
  isUnlock : PropTypes.bool
}