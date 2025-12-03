import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ApprovalNodeData } from "@/lib/types";
import { useWorkflowContext } from "@/providers/WorkflowProvider";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  approverRole: z.string().min(1, "Approver role is required"),
  autoApproveThreshold: z.number().min(0).optional(),
});

type ApprovalFormData = z.infer<typeof schema>;

export const ApprovalForm = ({ nodeId }: { nodeId: string }) => {
  const { updateNodeData } = useWorkflowContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApprovalFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      approverRole: "",
      autoApproveThreshold: 0,
    },
  });

  const onSubmit = (data: ApprovalFormData) => updateNodeData(nodeId, data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <Input {...register("title")} placeholder="Approval step title" />
        {errors.title && (
          <p className="text-red-500 text-xs">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Approver Role</label>
        <select
          {...register("approverRole")}
          className="w-full border rounded px-2 py-1 text-sm"
        >
          <option value="">Select a role</option>
          <option value="Manager">Manager</option>
          <option value="HRBP">HRBP (HR Business Partner)</option>
          <option value="Director">Director</option>
          <option value="CFO">CFO</option>
          <option value="Custom">Custom</option>
        </select>
        {errors.approverRole && (
          <p className="text-red-500 text-xs">{errors.approverRole.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">
          Auto-Approve Threshold (%)
        </label>
        <Input
          {...register("autoApproveThreshold", { valueAsNumber: true })}
          type="number"
          min="0"
          max="100"
          placeholder="0"
        />
        <p className="text-gray-500 text-xs mt-1">
          Auto-approve if confidence score exceeds this threshold
        </p>
      </div>

      <Button type="submit" className="w-full">
        Update Approval
      </Button>
    </form>
  );
};
