import type { AutomationAction, SimulationResult, Workflow } from "@/lib/types";

export const getAutomations = async (): Promise<AutomationAction[]> => {
  // Mock GET /automations
  return [
    { id: "send_email", label: "Send Email", params: ["to", "subject"] },
    {
      id: "generate_doc",
      label: "Generate Document",
      params: ["template", "recipient"],
    },
  ];
};

export const simulateWorkflow = async (
  workflow: Workflow
): Promise<SimulationResult> => {
  // Mock POST /simulate – simple traversal from start
  const { nodes, edges } = workflow;
  const startNode = nodes.find((n) => n.type === "start");
  if (!startNode) return { steps: [], valid: false, errors: ["No start node"] };

  const endNode = nodes.find((n) => n.type === "end") as any;
  const shouldGenerateSummary = endNode?.summary === true;

  const graph = new Map(
    nodes.map((n) => [
      n.id,
      {
        id: n.id,
        type: n.type,
        title: (n as any).title || "Node",
        children: [] as string[],
      },
    ])
  );
  edges.forEach((e) => {
    if (graph.has(e.source)) {
      (graph.get(e.source)!.children as string[]).push(e.target);
    }
  });

  const steps: SimulationResult["steps"] = [];
  const visited = new Set<string>();
  let valid = true;
  const errors: string[] = [];

  const traverse = (nodeId: string, depth = 0): void => {
    if (visited.has(nodeId)) {
      valid = false;
      errors.push("Cycle detected");
      return;
    }
    visited.add(nodeId);

    const node = graph.get(nodeId);
    if (!node) return;

    steps.push({
      nodeId,
      status: "executing",
      message: `Executing ${node.title} (${node.type})`,
    });

    // Mock execution delay
    setTimeout(() => {
      steps[steps.length - 1].status = "completed";
    }, 100 * depth);

    node.children.forEach((childId: string) => traverse(childId, depth + 1));
  };

  traverse(startNode.id);

  // Check connectivity
  const endNodes = nodes.filter((n) => n.type === "end");
  if (endNodes.length === 0) errors.push("No end node");

  const result: SimulationResult = {
    steps,
    valid: valid && errors.length === 0,
    errors,
  };

  // Generate summary if End Node has summary flag enabled
  if (shouldGenerateSummary && result.valid) {
    const completedSteps = steps.filter((s) => s.status === "completed").length;
    result.summary = {
      generatedAt: new Date().toLocaleString(),
      totalSteps: steps.length,
      completedSteps,
      workflowStatus: result.valid ? "success" : "failed",
      executionLog: steps.map((step) => {
        const originalNode = nodes.find((n) => n.id === step.nodeId) as any;
        return {
          nodeId: step.nodeId,
          nodeTitle: originalNode?.title || "Unknown",
          nodeType: originalNode?.type || "unknown",
          status: step.status,
          message: step.message,
        };
      }),
    };
  }

  return result;
};
