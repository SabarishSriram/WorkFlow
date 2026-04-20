import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { v4 as uuidv4 } from 'uuid';
import { nodeTypes } from './Nodes';

interface CanvasProps {
  onNodeSelect: (node: Node | null) => void;
  nodes: Node[];
  setNodes: any;
  edges: Edge[];
  setEdges: any;
  onNodesChange: any;
  onEdgesChange: any;
}

export const Canvas = ({
  onNodeSelect,
  nodes,
  setNodes,
  edges,
  setEdges,
  onNodesChange,
  onEdgesChange,
}: CanvasProps) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds: Edge[]) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: uuidv4(),
        type,
        position,
        data: { title: `${type.charAt(0).toUpperCase() + type.slice(1)} Node` },
      };

      setNodes((nds: Node[]) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );

  const handleSelectionChange = useCallback(({ nodes }: { nodes: Node[] }) => {
    if (nodes.length > 0) {
      onNodeSelect(nodes[0]);
    } else {
      onNodeSelect(null);
    }
  }, [onNodeSelect]);

  return (
    <div style={{ position: 'absolute', inset: 0 }} ref={reactFlowWrapper} onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={handleSelectionChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background gap={16} size={1} color="var(--border-color)" />
        <Controls />
        <MiniMap zoomable pannable />
      </ReactFlow>
    </div>
  );
};
