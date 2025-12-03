import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { EndNodeData } from "@/lib/types";
import { useWorkflowContext } from "@/providers/WorkflowProvider";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "End message is required"),
  summary: z.boolean().optional(),
});

type EndFormData = z.infer<typeof schema>;

export const EndForm = ({ nodeId }: { nodeId: string }) => {
  const { updateNodeData } = useWorkflowContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EndFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "Workflow Complete",
      message: "Workflow has been completed successfully.",
      summary: false,
    },
  });

  const onSubmit = (data: EndFormData) => updateNodeData(nodeId, data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <Input {...register("title")} placeholder="End node title" />
        {errors.title && (
          <p className="text-red-500 text-xs">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">End Message</label>
        <textarea
          {...register("message")}
          placeholder="Message to display when workflow completes"
          className="w-full border rounded px-2 py-1 text-sm"
          rows={4}
        />
        {errors.message && (
          <p className="text-red-500 text-xs">{errors.message.message}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          {...register("summary")}
          id="summary"
          className="rounded"
        />
        <label htmlFor="summary" className="text-sm font-medium cursor-pointer">
          Include Summary Report
        </label>
      </div>

      <Button type="submit" className="w-full">
        Update End Node
      </Button>
    </form>
  );
};
