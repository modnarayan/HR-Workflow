import { useCallback } from "react";
import {
  useNodesState,
  useEdgesState,
  Node,
  Connection,
  addEdge,
} from "reactflow";
import type {
  CustomNode,
  CustomEdge,
  Workflow,
  SimulationResult,
} from "@/lib/types";
import { getAutomations, simulateWorkflow } from "@/lib/api";

export const useWorkflow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdge>([]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeDelete = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) =>
        eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
      );
    },
    [setNodes, setEdges]
  );

  const updateNodeData = useCallback(
    (nodeId: string, data: any) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
        )
      );
    },
    [setNodes]
  );

  const serializeWorkflow = useCallback(
    (): Workflow => ({
      nodes: nodes.map((n) => ({
        ...n.data,
        id: n.id,
        type: n.type,
      })),
      edges,
    }),
    [nodes, edges]
  );

  const validateWorkflow = useCallback((workflow: Workflow): string[] => {
    const errors: string[] = [];
    console.log("Validating workflow:", workflow);
    if (!workflow.nodes.some((n) => n.type === "start"))
      errors.push("Missing start node");

    // Cycle check: for each node, traverse its descendants
    const hasCycle = (startNodeId: string): boolean => {
      const visited = new Set<string>();
      const recursionStack = new Set<string>();

      const traverse = (nodeId: string): boolean => {
        if (recursionStack.has(nodeId)) return true; // Cycle detected
        if (visited.has(nodeId)) return false; // Already checked, no cycle

        visited.add(nodeId);
        recursionStack.add(nodeId);

        const children = workflow.edges
          .filter((e) => e.source === nodeId)
          .map((e) => e.target);

        for (const childId of children) {
          if (traverse(childId)) return true;
        }

        recursionStack.delete(nodeId);
        return false;
      };

      return traverse(startNodeId);
    };

    if (workflow.nodes.some((n) => hasCycle(n.id))) {
      errors.push("Cycle detected");
    }

    return errors;
  }, []);

  const simulate = useCallback(async (): Promise<SimulationResult> => {
    const workflow = serializeWorkflow();
    const errors = validateWorkflow(workflow);
    if (errors.length > 0) {
      return { steps: [], valid: false, errors };
    }
    return simulateWorkflow(workflow);
  }, [serializeWorkflow, validateWorkflow]);

  const addNode = useCallback(
    (type: string, position: { x: number; y: number }) => {
      const newNode: Node<CustomNode> = {
        id: `${type}-${Date.now()}`,
        type: type as any,
        position,
        data: {
          title: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
        } as any,
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    updateNodeData,
    onNodeDelete,
    addNode,
    simulate,
    serializeWorkflow,
    validateWorkflow,
    getAutomations,
  };
};
