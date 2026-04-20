import { Play, CheckSquare, UserCheck, Zap, Square } from 'lucide-react';

export const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const nodeTypes = [
    { type: 'start', label: 'Start Node', icon: <Play size={18} color="var(--node-start)" />, desc: 'Entry point' },
    { type: 'task', label: 'Task Node', icon: <CheckSquare size={18} color="var(--node-task)" />, desc: 'Human task' },
    { type: 'approval', label: 'Approval Node', icon: <UserCheck size={18} color="var(--node-approval)" />, desc: 'Manager/HR approval' },
    { type: 'automated', label: 'Automated Step', icon: <Zap size={18} color="var(--node-automated)" />, desc: 'System action' },
    { type: 'end', label: 'End Node', icon: <Square size={18} fill="var(--node-end)" color="var(--node-end)" />, desc: 'Completion step' },
  ];

  return (
    <aside className="sidebar glass-panel shadow-xl">
      <div className="sidebar-header">
        <h2 className="heading-display text-gradient">Nodes</h2>
        <p className="sidebar-desc">Drag elements to canvas</p>
      </div>

      <div className="sidebar-nodes">
        {nodeTypes.map((node) => (
          <div
            key={node.type}
            className="sidebar-node-item"
            onDragStart={(event) => onDragStart(event, node.type)}
            draggable
          >
            <div className="node-icon-bg">
              {node.icon}
            </div>
            <div className="node-item-text">
              <div className="node-item-label">{node.label}</div>
              <div className="node-item-desc">{node.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
