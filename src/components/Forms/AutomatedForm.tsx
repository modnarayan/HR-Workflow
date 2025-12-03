import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AutomatedNodeData } from "@/lib/types";
import { useWorkflowContext } from "@/providers/WorkflowProvider";
import { useEffect, useState } from "react";
import { getAutomations } from "@/lib/api";
import type { AutomationAction } from "@/lib/types";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  actionId: z.string().min(1, "Action is required"),
  params: z.record(z.string(), z.string()).optional(),
});

type AutomatedFormData = z.infer<typeof schema>;

export const AutomatedForm = ({ nodeId }: { nodeId: string }) => {
  const { updateNodeData } = useWorkflowContext();
  const [actions, setActions] = useState<AutomationAction[]>([]);
  const [selectedAction, setSelectedAction] = useState<AutomationAction | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AutomatedFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      actionId: "",
      params: {},
    },
  });

  const actionId = watch("actionId");

  useEffect(() => {
    getAutomations().then((data) => {
      setActions(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const action = actions.find((a) => a.id === actionId);
    setSelectedAction(action || null);
  }, [actionId, actions]);

  const onSubmit = (data: AutomatedFormData) => updateNodeData(nodeId, data);

  if (loading) return <div className="p-4">Loading actions...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <Input {...register("title")} placeholder="Automated step title" />
        {errors.title && (
          <p className="text-red-500 text-xs">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Action</label>
        <select
          {...register("actionId")}
          className="w-full border rounded px-2 py-1 text-sm"
        >
          <option value="">Select an action</option>
          {actions.map((action) => (
            <option key={action.id} value={action.id}>
              {action.label}
            </option>
          ))}
        </select>
        {errors.actionId && (
          <p className="text-red-500 text-xs">{errors.actionId.message}</p>
        )}
      </div>

      {selectedAction && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Action Parameters
          </label>
          <div className="space-y-2">
            {selectedAction.params.map((param) => (
              <div key={param}>
                <Input
                  {...register(`params.${param}`)}
                  placeholder={`${param}`}
                  className="text-xs"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <Button type="submit" className="w-full">
        Update Automated Step
      </Button>
    </form>
  );
};
