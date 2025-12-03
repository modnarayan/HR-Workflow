import { Handle, Position, NodeProps } from "reactflow";
import { CheckCircle } from "lucide-react";
import type { ApprovalNodeData } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

export const ApprovalNode = ({
  data,
  selected,
}: NodeProps<ApprovalNodeData>) => (
  <Card
    className={`w-40 bg-purple-50 border-2 transition-all cursor-pointer ${
      selected ? "border-purple-600 shadow-lg" : "border-purple-200"
    }`}
  >
    <Handle type="target" position={Position.Left} />
    <Handle type="source" position={Position.Right} />
    <CardContent className="p-2 text-center">
      <CheckCircle className="mx-auto h-4 w-4 text-purple-600 mb-1" />
      <div className="font-semibold text-xs">{data.title}</div>
      {data.approverRole && (
        <div className="text-xs text-gray-600">{data.approverRole}</div>
      )}
    </CardContent>
  </Card>
);
