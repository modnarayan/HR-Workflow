import { Handle, Position, NodeProps } from "reactflow";
import { CheckCircle2 } from "lucide-react";
import type { EndNodeData } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

export const EndNode = ({ data, selected }: NodeProps<EndNodeData>) => (
  <Card
    className={`w-32 bg-red-50 border-2 transition-all cursor-pointer ${
      selected ? "border-red-600 shadow-lg" : "border-red-200"
    }`}
  >
    <Handle type="target" position={Position.Left} />
    <CardContent className="p-2 text-center">
      <CheckCircle2 className="mx-auto h-4 w-4 text-red-600 mb-1" />
      <div className="font-semibold text-xs">{data.title}</div>
    </CardContent>
  </Card>
);
