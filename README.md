# HR Workflow Designer Module

A functional prototype of a visual HR Workflow Designer built with React, React Flow, and Next.js. This module allows HR administrators to design, configure, test, and simulate internal workflows such as onboarding, leave approval, and document verification.

## 📋 Features

### ✅ Implemented

- **Drag-and-Drop Canvas**: React Flow-powered canvas for visual workflow design
- **5 Node Types**:
  - **Start Node**: Workflow entry point (green)
  - **Task Node**: Human tasks requiring action (blue)
  - **Approval Node**: Manager/HR approval steps (purple)
  - **Automated Step Node**: System-triggered actions (amber)
  - **End Node**: Workflow completion (red)
- **Node Configuration Forms**:
  - Dynamic form validation using Zod
  - Form-specific fields for each node type
  - Real-time state management with React Hook Form
  - Custom field support for extensibility
  - **Special Note**: End Node includes "Include Summary Report" toggle to generate completion summaries
- **Drag-and-Drop Node Insertion**: Sidebar with all available node types
- **Edge Management**: Connect nodes with automatic edge creation and proper IDs
- **Node Editing Panel**: Select and edit node properties in real-time (click any node to edit)
- **Workflow Simulation & Testing**:
  - Serialize workflow to JSON
  - Mock API simulation endpoint
  - Step-by-step execution logging
  - Validation with error reporting
  - Cycle detection (prevents invalid workflows)
- **Mock API Layer**:
  - `/automations` - Returns available automation actions
  - `/simulate` - Simulates workflow execution with full step tracking
- **UI Components**: Built with shadcn/ui Card, Button, Input components
- **Icons**: Lucide React icons for visual distinction
- **Visual Feedback**: Selected nodes highlight with border and shadow

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Canvas/
│   │   ├── WorkflowCanvas.tsx    # React Flow canvas with all nodes
│   │   └── Sidebar.tsx             # Draggable node palette
│   ├── Forms/
│   │   ├── StartForm.tsx           # Start node configuration
│   │   ├── TaskForm.tsx            # Task node configuration
│   │   ├── ApprovalForm.tsx        # Approval node configuration
│   │   ├── AutomatedForm.tsx       # Automated step configuration
│   │   └── EndForm.tsx             # End node configuration
│   ├── Nodes/
│   │   ├── StartNode.tsx           # Start node visual component
│   │   ├── TaskNode.tsx            # Task node visual component
│   │   ├── ApprovalNode.tsx        # Approval node visual component
│   │   ├── AutomatedNode.tsx       # Automated node visual component
│   │   └── EndNode.tsx             # End node visual component
│   ├── Panels/
│   │   ├── NodePanel.tsx           # Node editing panel
│   │   └── TestPanel.tsx           # Workflow testing/simulation panel
│   └── ui/
│       └── card.tsx                # shadcn Card component
├── hooks/
│   └── useWorkflow.ts              # Main workflow state management hook
├── lib/
│   ├── api.ts                      # Mock API layer
│   ├── types.ts                    # TypeScript type definitions
│   └── utils.ts                    # Utility functions
└── utils/
```

## 🛠 Technology Stack

- **React 18+**: Component framework
- **Next.js**: Full-stack framework with client-side support
- **React Flow**: Workflow canvas and node management
- **React Hook Form**: Efficient form state management
- **Zod**: TypeScript-first schema validation
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: High-quality UI components
- **Lucide React**: Icon library

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd tredence
npm install
```

### Running the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### Creating a Workflow

1. **Add Nodes**: Drag node types from the left sidebar onto the canvas
2. **Position Nodes**: Move nodes to organize your workflow
3. **Configure Nodes**: Click a node to select it and edit its properties in the right panel
4. **Connect Nodes**: Click the output handle on one node and drag to the input handle of another
5. **Test Workflow**: Click "Simulate Workflow" to test and validate

### Node Types & Configuration

#### Start Node

- **Fields**: Title, Metadata (key-value pairs)
- **Color**: Green
- **Icon**: Play
- **Purpose**: Entry point for the workflow

#### Task Node

- **Fields**: Title (required), Description, Assignee (required), Due Date, Custom Fields
- **Color**: Blue
- **Icon**: Users
- **Purpose**: Human tasks that require action

#### Approval Node

- **Fields**: Title (required), Approver Role (Manager/HRBP/Director/Custom), Auto-Approve Threshold
- **Color**: Purple
- **Icon**: Check Circle
- **Purpose**: Approval/decision points in workflow

#### Automated Step Node

- **Fields**: Title (required), Action (from API list), Action Parameters (dynamic)
- **Color**: Amber
- **Icon**: Zap
- **Purpose**: System-triggered actions like sending emails or generating documents
- **Available Actions**:
  - Send Email: `to`, `subject`
  - Generate Document: `template`, `recipient`

#### End Node

- **Fields**: Title, End Message, Include Summary Report (toggle)
- **Color**: Red
- **Icon**: Check Circle 2
- **Purpose**: Workflow completion and final message

### Workflow Validation

The system validates workflows for:

- ✅ Start node exists
- ✅ End node exists
- ❌ Cycles (deadlock prevention)
- ❌ Disconnected components (warnings)

### Testing & Simulation

1. Design your workflow
2. Click "Simulate Workflow" in the Test panel
3. View step-by-step execution log
4. Check validation errors if any

## 🏗 Architecture & Design Decisions

### State Management

- **React Hook Form**: For individual node form state
- **useNodesState/useEdgesState**: From React Flow for canvas state
- **Custom Hook (useWorkflow)**: Centralized workflow operations

**Rationale**: Separates concerns between form state (individual nodes) and graph state (canvas). Makes it easy to update individual nodes without re-rendering the entire canvas.

### Form Design

- Each node type has its own dedicated form component
- Forms use Zod for schema validation
- Type-safe form data with TypeScript interfaces
- Extensible for new fields without modifying core logic

**Rationale**: Maintains scalability. Adding a new node type requires:

1. Add type definition in `types.ts`
2. Create form component in `Forms/`
3. Create node visual in `Nodes/`
4. Register in `NodePanel.tsx` and `WorkflowCanvas.tsx`

### Mock API Layer

- Centralized in `lib/api.ts`
- Returns mock data synchronously (can be extended to real HTTP)
- Supports workflow simulation with step-by-step execution

**Rationale**: Decouples UI from backend concerns. Easy to swap with real API endpoints. Demonstrates async patterns and data layer abstraction.

### Node Component Structure

- Each node is a React component that receives `NodeProps<NodeData>`
- Nodes include drag handles (target/source)
- Minimal UI with essential info (title, key metadata)
- Styled with Tailwind + Card component for consistency

**Rationale**: React Flow's node component pattern is flexible and composable. Easy to extend with additional data or styling.

## 🔄 Data Flow

```
Sidebar (Drag)
    ↓
WorkflowCanvas (onDrop)
    ↓
useWorkflow.addNode()
    ↓
setNodes (update canvas state)
    ↓
Node Visual Renders
    ↓
Click to Select → NodePanel Shows Form
    ↓
Form Update → useWorkflow.updateNodeData()
    ↓
Canvas Reflects Changes
    ↓
TestPanel → simulate() → Mock API
    ↓
Validation Results Displayed
```

## 📝 Type Safety

All major entities are type-defined in `lib/types.ts`:

```typescript
export interface StartNodeData extends BaseNodeData {
  metadata?: Record<string, string>;
}

export interface TaskNodeData extends BaseNodeData {
  description?: string;
  assignee: string;
  dueDate?: string;
  customFields?: Record<string, string>;
}

// ... more types
```

**Benefit**: TypeScript catches errors at compile time. IDE autocomplete for node properties.

## 🎯 Completed Requirements

| Requirement      | Status | Notes                               |
| ---------------- | ------ | ----------------------------------- |
| Drag-drop canvas | ✅     | React Flow with sidebar             |
| 5 node types     | ✅     | All implemented with icons          |
| Node forms       | ✅     | Dynamic, validated, extensible      |
| Form fields      | ✅     | All specified fields implemented    |
| Mock API         | ✅     | getAutomations, simulateWorkflow    |
| Workflow testing | ✅     | TestPanel with step-by-step log     |
| Validation       | ✅     | Start/end nodes, cycle detection    |
| Architecture     | ✅     | Modular, scalable, clear separation |
| TypeScript       | ✅     | Full type coverage                  |

## 🚀 Future Enhancements (Not Implemented - Time Constraint)

- **Export/Import**: Save workflows as JSON and reload
- **Node Templates**: Pre-built workflow templates
- **Undo/Redo**: History management
- **Advanced Validation**: Visual error markers on nodes
- **Auto-Layout**: Automatic node positioning
- **Database Persistence**: Save workflows to backend
- **User Roles**: Permission-based form access
- **Conditional Flows**: If/else branches
- **Parallel Execution**: Fork/join patterns
- **Workflow Versioning**: Track changes over time

## 🐛 Known Limitations

1. **Simulation Timing**: Uses setTimeout (0-based delays) instead of real async execution
2. **Cycle Detection**: Basic implementation; could be more sophisticated
3. **Error Display**: No visual markers on canvas for validation errors
4. **No Persistence**: Workflows exist only in session memory
5. **Mock Data Only**: No real email, document generation, or approval tracking

## 🧪 Testing

To test the workflow designer:

1. **Add nodes**: Drag 5-6 nodes from sidebar
2. **Configure**: Click each node and fill in forms
3. **Connect**: Draw edges between nodes
4. **Simulate**: Click "Simulate Workflow" to see execution log
5. **Validate**: Check for error messages

### Example Workflow

```
Start (Onboarding)
  → Task (Collect Documents - assigned to HR)
  → Approval (Manager Review)
  → Automated (Send Welcome Email)
  → End (Welcome Complete)
```

## 📚 Development Notes

### Adding a New Node Type

1. **Define Type** (`lib/types.ts`):

```typescript
export interface MyNodeData extends BaseNodeData {
  customField: string;
}
```

2. **Create Form** (`components/Forms/MyForm.tsx`):

```typescript
export const MyForm = ({ nodeId }: { nodeId: string }) => {
  // Form implementation
};
```

3. **Create Node** (`components/Nodes/MyNode.tsx`):

```typescript
export const MyNode = ({ data }: NodeProps<MyNodeData>) => {
  // Node visual
};
```

4. **Register** in `NodePanel.tsx` and `WorkflowCanvas.tsx`

### Extending Mock API

Update `lib/api.ts`:

```typescript
export const myCustomAction = async () => {
  // Custom logic
};
```

## 📄 How to Run

```bash
npm install
npm run dev
```

Navigate to `http://localhost:3000` to use the workflow designer.

## 👤 Author

GitHub Copilot / Assistance-based Development

## 📞 Support

For issues or questions, refer to:

- [React Flow Documentation](https://reactflow.dev)
- [React Hook Form Documentation](https://react-hook-form.com)
- [Zod Documentation](https://zod.dev)
- Tailwind for styling, inspired by ref images (flow + metrics panels).

## Completed

- All 5 nodes with forms.
- Canvas actions (drag, connect, delete, edit).
- Mock API + simulation log.
- Basic validation.

## Future

- JSON export: Add button to download serializeWorkflow().
- Visual errors: Highlight invalid nodes.
- Auto-layout: Integrate dagre.

Assumptions: Simple date input (no picker). No cycles in small graphs.
