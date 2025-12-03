"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useWorkflowContext } from "@/providers/WorkflowProvider";
import { AlertCircle, CheckCircle2, Play } from "lucide-react";

export const TestPanel = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { simulate } = useWorkflowContext();

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await simulate();
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-80 p-4 bg-gray-50 border-t max-h-96 overflow-auto">
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Workflow Simulation</h3>
        <Button
          onClick={runSimulation}
          disabled={loading}
          className="w-full gap-2 cursor-pointer"
        >
          <Play className="h-4 w-4" />
          {loading ? "Simulating..." : "Simulate Workflow"}
        </Button>
      </div>

      {result && (
        <div className="space-y-3">
          <div
            className={`p-3 rounded flex items-start gap-2 ${
              result.valid
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            {result.valid ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            )}
            <div>
              <p
                className={`font-semibold ${
                  result.valid ? "text-green-900" : "text-red-900"
                }`}
              >
                {result.valid ? "Workflow Valid" : "Workflow Invalid"}
              </p>
              {result.errors.length > 0 && (
                <ul className="text-xs mt-2 space-y-1">
                  {result.errors.map((error: string, idx: number) => (
                    <li
                      key={idx}
                      className={
                        result.valid ? "text-green-700" : "text-red-700"
                      }
                    >
                      • {error}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {result.steps.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Execution Steps</h4>
              <div className="space-y-2">
                {result.steps.map((step: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-2 bg-white border rounded text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-white text-xs font-semibold ${
                          step.status === "completed"
                            ? "bg-green-500"
                            : step.status === "executing"
                            ? "bg-blue-500"
                            : "bg-gray-500"
                        }`}
                      >
                        {step.status}
                      </span>
                      <span className="flex-1">{step.message}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
