"use client";
import { useReactFlow } from "reactflow";
import { StartForm } from "@/components/Forms/StartForm";
import { TaskForm } from "@/components/Forms/TaskForm";
import { ApprovalForm } from "@/components/Forms/ApprovalForm";
import { AutomatedForm } from "@/components/Forms/AutomatedForm";
import { EndForm } from "@/components/Forms/EndForm";
import type { NodeType } from "@/lib/types";
import { useWorkflowContext } from "@/providers/WorkflowProvider";

const formComponents: Record<
  NodeType,
  React.ComponentType<{ nodeId: string }>
> = {
  start: StartForm,
  task: TaskForm,
  approval: ApprovalForm,
  automated: AutomatedForm,
  end: EndForm,
};

export const NodePanel = () => {
  const { nodes } = useWorkflowContext();
  const { getNodes } = useReactFlow();

  // Get selected node from React Flow
  const flowNodes = getNodes();
  const selected = flowNodes.find((n) => n.selected);

  if (!selected) return <div className="w-80 p-4">Select a node to edit</div>;

  const FormComponent = formComponents[selected.type as NodeType];
  if (!FormComponent)
    return <div className="w-80 p-4">No form for this node type</div>;

  return <FormComponent nodeId={selected.id} />;
};
