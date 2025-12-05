import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { StartNodeData } from "@/lib/types";
import { useWorkflowContext } from "@/providers/WorkflowProvider";

const schema = z.object({
  title: z.string().min(1),
  metadata: z.record(z.string(), z.string()),
});

export const StartForm = ({ nodeId }: { nodeId: string }) => {
  const { updateNodeData } = useWorkflowContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<
    Omit<StartNodeData, "metadata"> & { metadata: Record<string, string> }
  >({
    resolver: zodResolver(schema),
    defaultValues: { title: "", metadata: {} },
  });

  const onSubmit = (
    data: Omit<StartNodeData, "metadata"> & { metadata: Record<string, string> }
  ) => updateNodeData(nodeId, data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      <Input {...register("title")} placeholder="Start Title" />
      {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      <Button type="submit">Update</Button>
    </form>
  );
};
