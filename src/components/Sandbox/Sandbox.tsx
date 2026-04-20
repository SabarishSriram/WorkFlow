import { useState } from 'react';
import { Play, X, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { mockApi } from '../../api/mockApi';

interface SandboxProps {
  nodes: any[];
  edges: any[];
  onClose: () => void;
}

export const Sandbox = ({ nodes, edges, onClose }: SandboxProps) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSimulate = async () => {
    setStatus('running');
    setLogs([]);
    setErrorMsg('');

    const workflowJson = { nodes, edges };
    const result = await mockApi.simulateWorkflow(workflowJson);

    if (result.success) {
      setLogs(result.logs);
      setStatus('success');
    } else {
      setLogs(result.logs);
      setErrorMsg(result.error);
      setStatus('error');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel shadow-2xl">
        
        {/* Header */}
        <div className="modal-header">
          <h2 className="heading-display flex-center gap-2">
            <Play size={18} color="var(--brand-primary)" />
            Workflow Sandbox
          </h2>
          <button onClick={onClose} className="icon-btn">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="modal-body custom-scrollbar">
          {status === 'idle' && (
            <div className="status-container">
              <Clock size={48} className="status-icon" color="var(--text-muted)" />
              <p className="status-text">Click the button below to serialize and simulate the current workflow.</p>
            </div>
          )}

          {status === 'running' && (
            <div className="status-container">
              <div className="spinner" />
              <p className="status-text text-brand">Running Simulation...</p>
            </div>
          )}

          {(status === 'success' || status === 'error') && (
            <div className="logs-container">
              {logs.map((log, i) => (
                <div key={i} className="log-item">
                  <span className="log-time">[{new Date().toLocaleTimeString()}]</span>
                  {log}
                </div>
              ))}
              
              {status === 'error' && (
                 <div className="log-item error">
                   <AlertCircle size={18} className="shrink-0" />
                   <div>
                     <div className="log-error-title">Simulation Failed</div>
                     {errorMsg}
                   </div>
                 </div>
              )}
              
              {status === 'success' && (
                <div className="log-item success">
                  <CheckCircle size={18} />
                  <span className="log-success-title">Simulation Completed Successfully</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer flex-end gap-3">
          <button onClick={onClose} className="btn btn-outline">
            Close
          </button>
          <button onClick={handleSimulate} className="btn btn-primary" disabled={status === 'running'}>
            <Play size={16} />
            {status === 'idle' ? 'Start Simulation' : 'Run Again'}
          </button>
        </div>
      </div>
    </div>
  );
};
