"use client";
import React, { createContext, useContext } from "react";
import { useWorkflow } from "@/hooks/useWorkflow";
import type { SimulationResult, Workflow } from "@/lib/types";
import type {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  Connection,
} from "reactflow";

interface WorkflowContextType {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  updateNodeData: (nodeId: string, data: any) => void;
  onNodeDelete: (nodeId: string) => void;
  addNode: (type: string, position: { x: number; y: number }) => void;
  simulate: () => Promise<SimulationResult>;
  serializeWorkflow: () => Workflow;
  validateWorkflow: (workflow: Workflow) => string[];
  getAutomations: () => Promise<any>;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(
  undefined
);

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const workflow = useWorkflow();

  return (
    <WorkflowContext.Provider value={workflow}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflowContext() {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error("useWorkflowContext must be used within WorkflowProvider");
  }
  return context;
}
