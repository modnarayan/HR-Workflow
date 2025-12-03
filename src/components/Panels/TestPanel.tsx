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

          {result.summary && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                📋 Workflow Summary Report
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-blue-700">Generated:</span>
                  <span className="font-mono text-blue-900">
                    {result.summary.generatedAt}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Status:</span>
                  <span className="font-semibold text-blue-900">
                    {result.summary.workflowStatus.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Steps Completed:</span>
                  <span className="font-semibold text-blue-900">
                    {result.summary.completedSteps} /{" "}
                    {result.summary.totalSteps}
                  </span>
                </div>

                <div className="border-t border-blue-200 pt-2 mt-2">
                  <h5 className="text-blue-900 font-semibold mb-1">
                    Execution Log:
                  </h5>
                  <div className="space-y-1 max-h-32 overflow-y-auto bg-white rounded p-2">
                    {result.summary.executionLog.map(
                      (
                        log: {
                          nodeId: string;
                          nodeTitle: string;
                          nodeType: string;
                          status: string;
                          message: string;
                        },
                        idx: number
                      ) => (
                        <div
                          key={idx}
                          className="text-xs border-b border-gray-200 pb-1 last:border-0"
                        >
                          <div className="flex items-start gap-1">
                            <span
                              className={`px-1.5 py-0.5 rounded text-white text-xs font-semibold whitespace-nowrap ${
                                log.status === "completed"
                                  ? "bg-green-500"
                                  : log.status === "executing"
                                  ? "bg-blue-500"
                                  : "bg-gray-500"
                              }`}
                            >
                              {log.status}
                            </span>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">
                                {log.nodeTitle}
                              </div>
                              <div className="text-gray-600 text-xs">
                                {log.nodeType} • {log.message}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
