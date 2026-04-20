export interface AutomatedAction {
  id: string;
  label: string;
  params: string[];
}

const mockAutomations: AutomatedAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'update_status', label: 'Update Status', params: ['employeeId', 'status'] },
  { id: 'slack_message', label: 'Send Slack Msg', params: ['channel', 'message'] },
];

export const mockApi = {
  getAutomations: async (): Promise<AutomatedAction[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockAutomations), 400));
  },
  
  simulateWorkflow: async (workflowJson: any): Promise<any> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { nodes, edges } = workflowJson;
        if (!nodes || nodes.length === 0) {
          resolve({ success: false, error: 'Workflow is empty.', logs: [] });
          return;
        }

        const startNode = nodes.find((n: any) => n.type === 'start');
        if (!startNode) {
          resolve({ success: false, error: 'No Start Node found.', logs: [] });
          return;
        }

        const logs: string[] = [];
        let currentNode = startNode;
        let step = 1;

        // Simple linear traversal simulation map
        const adjacencyList = new Map<string, string[]>();
        edges.forEach((edge: any) => {
          if (!adjacencyList.has(edge.source)) adjacencyList.set(edge.source, []);
          adjacencyList.get(edge.source)?.push(edge.target);
        });

        const visited = new Set<string>();

        while (currentNode) {
          logs.push(`Step ${step}: Executing [${currentNode.type.toUpperCase()}] ${currentNode.data.title || 'unnamed'}`);
          visited.add(currentNode.id);
          
          const nextTargets = adjacencyList.get(currentNode.id) || [];
          
          if (nextTargets.length === 0) {
            if (currentNode.type !== 'end') {
              logs.push(`Warning: Workflow ended abruptly at node ${currentNode.id} (not an End node)`);
            } else {
              logs.push(`Workflow completed successfully: ${currentNode.data.endMessage || 'No message'}`);
            }
            break;
          }

          if (nextTargets.length > 1) {
            logs.push(`Warning: Multiple outgoing edges found. Taking the first path for simulation.`);
          }

          const nextNodeId = nextTargets[0];
          if (visited.has(nextNodeId)) {
            resolve({ success: false, error: 'Cycle detected. Infinite loop prevented.', logs });
            return;
          }

          currentNode = nodes.find((n: any) => n.id === nextNodeId);
          step++;
        }

        resolve({ success: true, logs });
      }, 800);
    });
  }
};
