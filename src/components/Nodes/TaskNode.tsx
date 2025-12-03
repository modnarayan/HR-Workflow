import { Handle, Position, NodeProps } from "reactflow";
import { Users } from "lucide-react";
import type { TaskNodeData } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

export const TaskNode = ({ data }: NodeProps<TaskNodeData>) => (
  <Card className="w-40 bg-blue-50 border-blue-200">
    <Handle type="target" position={Position.Left} />
    <Handle type="source" position={Position.Right} />
    <CardContent className="p-2 text-center">
      <Users className="mx-auto h-4 w-4 text-blue-600 mb-1" />
      <div className="font-semibold text-xs">{data.title}</div>
      {data.assignee && (
        <div className="text-xs text-gray-600">{data.assignee}</div>
      )}
    </CardContent>
  </Card>
);
