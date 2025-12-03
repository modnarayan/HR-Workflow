import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TaskNodeData } from "@/lib/types";
import { useWorkflowContext } from "@/providers/WorkflowProvider";
import { X, Plus } from "lucide-react";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  assignee: z.string().min(1, "Assignee is required"),
  dueDate: z.string().optional(),
  customFields: z.record(z.string(), z.string()).optional(),
});

type TaskFormData = z.infer<typeof schema>;

export const TaskForm = ({ nodeId }: { nodeId: string }) => {
  const { updateNodeData } = useWorkflowContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      assignee: "",
      dueDate: "",
      customFields: {},
    },
  });

  const onSubmit = (data: TaskFormData) => updateNodeData(nodeId, data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <Input {...register("title")} placeholder="Task title" />
        {errors.title && (
          <p className="text-red-500 text-xs">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          {...register("description")}
          placeholder="Task description"
          className="w-full border rounded px-2 py-1 text-sm"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Assignee</label>
        <Input {...register("assignee")} placeholder="e.g., john@example.com" />
        {errors.assignee && (
          <p className="text-red-500 text-xs">{errors.assignee.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Due Date</label>
        <Input {...register("dueDate")} type="date" />
      </div>

      <div>
        <label className="block text-sm font-medium">Custom Fields</label>
        <p className="text-xs text-gray-600 mt-1">
          Add custom key-value pairs for this task
        </p>
      </div>

      <Button type="submit" className="w-full">
        Update Task
      </Button>
    </form>
  );
};
