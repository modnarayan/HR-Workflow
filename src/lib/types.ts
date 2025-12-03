import { Node, Edge } from "reactflow";

export type NodeType = "start" | "task" | "approval" | "automated" | "end";

export interface BaseNodeData {
  title: string;
}

export interface StartNodeData extends BaseNodeData {
  metadata?: Record<string, string>;
}

export interface TaskNodeData extends BaseNodeData {
  description?: string;
  assignee: string;
  dueDate?: string;
  customFields?: Record<string, string>;
}

export interface ApprovalNodeData extends BaseNodeData {
  approverRole: string;
  autoApproveThreshold?: number;
}

export interface AutomatedNodeData extends BaseNodeData {
  actionId: string;
  params: Record<string, string>;
}

export interface EndNodeData extends BaseNodeData {
  message: string;
  summary: boolean;
}

export type CustomNode = Node<
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData
>;

export type CustomEdge = Edge;

export interface Workflow {
  nodes: CustomNode[];
  edges: CustomEdge[];
}

export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

export interface SimulationStep {
  nodeId: string;
  status: "pending" | "executing" | "completed" | "error";
  message: string;
}

export interface SimulationResult {
  steps: SimulationStep[];
  valid: boolean;
  errors: string[];
}
