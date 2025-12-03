import { Handle, Position, NodeProps } from "reactflow";
import { Play } from "lucide-react";
import type { StartNodeData } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

export const StartNode = ({ data }: NodeProps<StartNodeData>) => (
  <Card className="w-32 bg-green-50 border-green-200">
    <Handle type="source" position={Position.Right} />
    <CardContent className="p-2 text-center">
      <Play className="mx-auto h-4 w-4 text-green-600 mb-1" />
      <div className="font-semibold text-xs">{data.title}</div>
    </CardContent>
  </Card>
);
