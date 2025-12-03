import { Handle, Position, NodeProps } from "reactflow";
import { Zap } from "lucide-react";
import type { AutomatedNodeData } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

export const AutomatedNode = ({ data }: NodeProps<AutomatedNodeData>) => (
  <Card className="w-40 bg-amber-50 border-amber-200">
    <Handle type="target" position={Position.Left} />
    <Handle type="source" position={Position.Right} />
    <CardContent className="p-2 text-center">
      <Zap className="mx-auto h-4 w-4 text-amber-600 mb-1" />
      <div className="font-semibold text-xs">{data.title}</div>
      {data.actionId && (
        <div className="text-xs text-gray-600">{data.actionId}</div>
      )}
    </CardContent>
  </Card>
);
