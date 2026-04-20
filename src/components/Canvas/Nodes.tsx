import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Play, CheckSquare, UserCheck, Zap, Square } from 'lucide-react';

const NodeWrapper = ({ title, icon, colorVar, children, selected }: any) => {
  return (
    <div className={`custom-node ${selected ? 'selected' : ''}`} style={{ borderColor: selected ? 'var(--brand-primary)' : `var(${colorVar})` }}>
      <div className="node-header" style={{ borderBottomColor: `var(${colorVar})` }}>
        <div className="node-icon-wrapper" style={{ backgroundColor: `color-mix(in srgb, var(${colorVar}) 20%, transparent)` }}>
          {icon}
        </div>
        <div className="node-title">{title}</div>
      </div>
      <div className="node-content">
        {children}
      </div>
    </div>
  );
};

export const StartNode = memo(({ data, selected }: any) => {
  return (
    <>
      <NodeWrapper title={data.title || 'Start'} icon={<Play size={16} color="var(--node-start)" />} colorVar="--node-start" selected={selected}>
        <span style={{color: 'var(--text-muted)'}}>Workflow Entry Point</span>
      </NodeWrapper>
      <Handle type="source" position={Position.Right} style={{ background: 'var(--node-start)' }} />
    </>
  );
});

export const TaskNode = memo(({ data, selected }: any) => {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <NodeWrapper title={data.title || 'Task'} icon={<CheckSquare size={16} color="var(--node-task)" />} colorVar="--node-task" selected={selected}>
        <div style={{ marginBottom: '4px' }}><strong>Assignee:</strong> {data.assignee || 'Unassigned'}</div>
        <div>{data.description || 'No description'}</div>
      </NodeWrapper>
      <Handle type="source" position={Position.Right} style={{ background: 'var(--node-task)' }} />
    </>
  );
});

export const ApprovalNode = memo(({ data, selected }: any) => {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <NodeWrapper title={data.title || 'Approval'} icon={<UserCheck size={16} color="var(--node-approval)" />} colorVar="--node-approval" selected={selected}>
        <div><strong>Role:</strong> {data.role || 'Not set'}</div>
      </NodeWrapper>
      <Handle type="source" position={Position.Right} style={{ background: 'var(--node-approval)' }} />
    </>
  );
});

export const AutomatedNode = memo(({ data, selected }: any) => {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <NodeWrapper title={data.title || 'Automated Step'} icon={<Zap size={16} color="var(--node-automated)" />} colorVar="--node-automated" selected={selected}>
        <div><strong>Action:</strong> {data.actionId ? data.actionId.replace('_', ' ') : 'Not selected'}</div>
      </NodeWrapper>
      <Handle type="source" position={Position.Right} style={{ background: 'var(--node-automated)' }} />
    </>
  );
});

export const EndNode = memo(({ data, selected }: any) => {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <NodeWrapper title={data.title || 'End'} icon={<Square size={16} color="var(--node-end)" fill="var(--node-end)" />} colorVar="--node-end" selected={selected}>
        <div style={{color: 'var(--text-muted)'}}>{data.endMessage || 'Workflow complete'}</div>
      </NodeWrapper>
    </>
  );
});

export const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
};
