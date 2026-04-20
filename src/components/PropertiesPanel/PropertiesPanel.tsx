import { useEffect, useState } from 'react';
import type { Node } from '@xyflow/react';
import { mockApi } from '../../api/mockApi';
import type { AutomatedAction } from '../../api/mockApi';
import { Trash2 } from 'lucide-react';

interface PropertiesPanelProps {
  selectedNode: Node | null;
  updateNodeData: (id: string, newData: any) => void;
  onDeleteNode: (id: string) => void;
}

export const PropertiesPanel = ({ selectedNode, updateNodeData, onDeleteNode }: PropertiesPanelProps) => {
  const [automations, setAutomations] = useState<AutomatedAction[]>([]);

  useEffect(() => {
    mockApi.getAutomations().then(setAutomations);
  }, []);

  if (!selectedNode) {
    return (
      <aside className="properties-panel empty glass-panel shadow-xl">
        <div className="empty-text">
          Select a node on the canvas to edit its properties
        </div>
      </aside>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateNodeData(selectedNode.id, { [name]: value });
  };

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    updateNodeData(selectedNode.id, { [name]: checked });
  };

  const { type, data: rawData } = selectedNode;
  const data = rawData as any;

  return (
    <aside className="properties-panel glass-panel shadow-xl">
      <h2 className="heading-display panel-title">Configuration</h2>
      <p className="panel-subtitle">{type} Node</p>

      <div className="panel-content">
        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            className="form-input"
            name="title"
            value={data.title || ''}
            onChange={handleChange}
            placeholder="Node Title"
          />
        </div>

        {type === 'task' && (
          <>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input textarea"
                name="description"
                value={data.description || ''}
                onChange={handleChange}
                placeholder="Task description"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Assignee</label>
              <input
                className="form-input"
                name="assignee"
                value={data.assignee || ''}
                onChange={handleChange}
                placeholder="e.g. John Doe"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-input"
                name="dueDate"
                value={data.dueDate || ''}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        {type === 'approval' && (
          <>
            <div className="form-group">
              <label className="form-label">Approver Role</label>
              <select
                className="form-input"
                name="role"
                value={data.role || ''}
                onChange={handleChange}
              >
                <option value="">Select a role...</option>
                <option value="Manager">Manager</option>
                <option value="HRBP">HRBP</option>
                <option value="Director">Director</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Auto-approve Threshold</label>
              <input
                type="number"
                className="form-input"
                name="threshold"
                value={data.threshold || ''}
                onChange={handleChange}
                placeholder="e.g. 5 days"
              />
            </div>
          </>
        )}

        {type === 'automated' && (
          <>
            <div className="form-group">
              <label className="form-label">Action</label>
              <select
                className="form-input"
                name="actionId"
                value={data.actionId || ''}
                onChange={handleChange}
              >
                <option value="">Select an action...</option>
                {automations.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>
            
            {data.actionId && (
              <div className="action-params">
                <span className="action-params-title">Action Parameters</span>
                {automations.find(a => a.id === data.actionId)?.params.map((param) => (
                  <div className="form-group small" key={param}>
                    <label className="form-label">{param}</label>
                    <input
                      className="form-input small"
                      name={`param_${param}`}
                      value={data[`param_${param}`] || ''}
                      onChange={handleChange}
                      placeholder={`Enter ${param}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {type === 'end' && (
          <>
            <div className="form-group">
              <label className="form-label">End Message</label>
              <input
                className="form-input"
                name="endMessage"
                value={data.endMessage || ''}
                onChange={handleChange}
                placeholder="Workflow completed."
              />
            </div>
            <div className="form-group flex-row">
              <input
                type="checkbox"
                id="summaryFlag"
                name="summaryFlag"
                checked={data.summaryFlag || false}
                onChange={handleToggle}
                className="checkbox"
              />
              <label htmlFor="summaryFlag" className="form-label inline">Generate Summary Report</label>
            </div>
          </>
        )}

        <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          <button 
            className="btn btn-outline" 
            style={{ width: '100%', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
            onClick={() => onDeleteNode(selectedNode.id)}
          >
            <Trash2 size={16} /> Delete Node
          </button>
        </div>
      </div>
    </aside>
  );
};
