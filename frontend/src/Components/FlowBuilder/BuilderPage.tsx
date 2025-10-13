import React, { useCallback, useEffect, useState } from "react";
import {
  ReactFlowProvider,
  addEdge,
  Background,
  Controls,
  Node,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
  ReactFlow
} from "@xyflow/react";
// import * as ReactFlow from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { DefaultNode } from "./Actions/DefaultNode";
import { DecisionNode } from "./Actions/DecisionNode";
import { nodeTypes } from "./nodeTypes";
import NoteAddIcon from '@mui/icons-material/NoteAdd';

interface FlowBuilderProps {
  initialFlow?: { nodes: Node[]; edges: Edge[] };
  onFlowChange?: (flow: { nodes: Node[]; edges: Edge[] }) => void;
  edgeColor?: string;
  onSelectionChange?: (params: { nodes: Node[] }) => void;
}

const BuilderPage: React.FC<FlowBuilderProps> = ({
  initialFlow,
  onFlowChange,
  edgeColor = "blue",
  onSelectionChange
}) => {

    const [nodes, setNodes, onNodesChange] = useNodesState(initialFlow?.nodes || []);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialFlow?.edges || []);

    useEffect(() => {
        setNodes(initialFlow.nodes);
        setEdges(initialFlow.edges);
    }, [initialFlow]);

    useEffect(() => {
        onFlowChange?.({ nodes, edges });
    }, [edges]);

    const onConnect = useCallback((params: Edge | Connection) => {
        let allEdges = addEdge({
            ...params,
            type: "step",
            // style: { stroke: edgeColor }
        }, edges)
        setEdges((eds) => allEdges);
        onFlowChange?.({ nodes, edges: allEdges });
    }, [edgeColor]);

    const onNodeDragStop = (_: any, node: Node) => {
        // Send new coordinates on drag stop
        onFlowChange?.({ nodes, edges });
    };

    // const handleSave = () => {
    //     const flowData = { nodes, edges };
    //     localStorage.setItem("flowData", JSON.stringify(flowData));
    //     alert("Flow saved to localStorage!");
    // };

    // const handleLoad = () => {
    //     const saved = localStorage.getItem("flowData");
    //     if (saved) {
    //         const parsed = JSON.parse(saved);
    //         setNodes(parsed.nodes);
    //         setEdges(parsed.edges);
    //     }
    // };

    // const addNode = (nodeData: any) => {
    //     setNodes((nds) => [
    //         ...nds,
    //         {
    //             id: `${nds.length + 1}`,
    //             type: nodeData.type || "decisionNode",
    //             position: { x: 250, y: 100 + nds.length * 80 },
    //             data: nodeData,
    //         },
    //     ]);
    // };

    return (

        <ReactFlowProvider>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                onNodeDragStop={onNodeDragStop}
                onSelectionChange={onSelectionChange}
                fitView
                selectionOnDrag={false}
            >
                <Background />
                <Controls />
            </ReactFlow>
        </ReactFlowProvider>
    );
};

// export { BuilderPage };
export default BuilderPage;
