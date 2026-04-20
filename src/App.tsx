import { useState, useCallback } from 'react';
import { 
  useNodesState, 
  useEdgesState, 
  ReactFlowProvider,
  type Node
} from '@xyflow/react';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Canvas } from './components/Canvas/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel/PropertiesPanel';
import { Sandbox } from './components/Sandbox/Sandbox';
import { LayoutGrid, Download, Play } from 'lucide-react';
import './index.css';
import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'start',
    position: { x: 250, y: 150 },
    data: { title: 'Employee Onboarding' },
  },
];

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);

  const updateNodeData = useCallback((id: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          const updatedNode = { ...node, data: { ...node.data, ...newData } };
          if (selectedNode && selectedNode.id === id) {
              setSelectedNode(updatedNode);
          }
          return updatedNode;
        }
        return node;
      })
    );
  }, [setNodes, selectedNode]);

  const deleteNode = useCallback((id: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
    if (selectedNode && selectedNode.id === id) {
      setSelectedNode(null);
    }
  }, [setNodes, setEdges, selectedNode]);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ nodes, edges }, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "workflow.json");
    dlAnchorElem.click();
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-left">
          <div className="logo-icon">
            <LayoutGrid size={20} />
          </div>
          <h1 className="header-title heading-display">
            HR Workflow <span>Designer</span>
          </h1>
        </div>
        <div className="header-right">
          <button onClick={handleExport} className="btn bg-transparent">
            <Download size={16} />
            Export JSON
          </button>
          <button onClick={() => setIsSandboxOpen(true)} className="btn btn-primary">
            <Play size={16} fill="currentColor" />
            Simulate
          </button>
        </div>
      </header>

      <main className="app-main">
        <Sidebar />
        
        <div className="canvas-wrapper">
          <ReactFlowProvider>
            <Canvas
              onNodeSelect={setSelectedNode}
              nodes={nodes}
              setNodes={setNodes}
              edges={edges}
              setEdges={setEdges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
            />
          </ReactFlowProvider>
        </div>

        <PropertiesPanel
          selectedNode={selectedNode}
          updateNodeData={updateNodeData}
          onDeleteNode={deleteNode}
        />
      </main>

      {isSandboxOpen && (
        <Sandbox
          nodes={nodes}
          edges={edges}
          onClose={() => setIsSandboxOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
