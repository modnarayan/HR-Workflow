"use client";
import { useCallback } from "react";
import { Play, Users, CheckCircle, Zap, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface DraggableNodeType {
  type: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const nodeTypes: DraggableNodeType[] = [
  {
    type: "start",
    label: "Start",
    icon: <Play className="h-4 w-4" />,
    color: "bg-green-100 border-green-200",
  },
  {
    type: "task",
    label: "Task",
    icon: <Users className="h-4 w-4" />,
    color: "bg-blue-100 border-blue-200",
  },
  {
    type: "approval",
    label: "Approval",
    icon: <CheckCircle className="h-4 w-4" />,
    color: "bg-purple-100 border-purple-200",
  },
  {
    type: "automated",
    label: "Automated",
    icon: <Zap className="h-4 w-4" />,
    color: "bg-amber-100 border-amber-200",
  },
  {
    type: "end",
    label: "End",
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: "bg-red-100 border-red-200",
  },
];

export const Sidebar = () => {
  const onDragStart = useCallback(
    (event: React.DragEvent, nodeType: string) => {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("application/reactflow", nodeType);
    },
    []
  );

  return (
    <div className="w-48 bg-gray-50 border-r p-4 space-y-4">
      <div>
        <h2 className="font-bold text-lg mb-4">Workflow Nodes</h2>
        <p className="text-xs text-gray-600 mb-4">
          Drag nodes onto the canvas to build your workflow
        </p>
      </div>

      <div className="space-y-2">
        {nodeTypes.map((nodeType) => (
          <Card
            key={nodeType.type}
            draggable
            onDragStart={(e) => onDragStart(e, nodeType.type)}
            className={`p-3 cursor-move hover:shadow-md transition-shadow ${nodeType.color}`}
          >
            <div className="flex items-center gap-2">
              <div className="text-gray-700">{nodeType.icon}</div>
              <span className="font-medium text-sm">{nodeType.label}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 pt-4 border-t">
        <h3 className="text-sm font-semibold mb-2">Tips</h3>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Drag nodes to canvas</li>
          <li>• Click to edit node</li>
          <li>• Connect nodes with edges</li>
          <li>• Use Test to simulate</li>
        </ul>
      </div>
    </div>
  );
};
