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
    // Simple cycle check (expand from api.ts if needed)
    const visited = new Set();
    const traverse = (nodeId: string) => {
      if (visited.has(nodeId)) return true;
      visited.add(nodeId);
      const children = workflow.edges
        .filter((e) => e.source === nodeId)
        .map((e) => e.target);
      return children.some(traverse);
    };
    workflow.nodes.forEach((n) => {
      if (traverse(n.id)) errors.push("Cycle detected");
    });
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
