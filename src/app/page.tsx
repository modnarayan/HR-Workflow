"use client";
import { ReactFlowProvider } from "reactflow";
import { WorkflowCanvas } from "@/components/Canvas/WorkflowCanvas";
import { Sidebar } from "@/components/Canvas/Sidebar";
import { NodePanel } from "@/components/Panels/NodePanel";
import { TestPanel } from "@/components/Panels/TestPanel";
import { WorkflowProvider } from "@/providers/WorkflowProvider";

export default function Home() {
  return (
    <ReactFlowProvider>
      <WorkflowProvider>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 relative">
            <WorkflowCanvas />
          </div>
          <div className="flex flex-col w-80 border-l">
            <NodePanel />
            <TestPanel />
          </div>
        </div>
      </WorkflowProvider>
    </ReactFlowProvider>
  );
}
