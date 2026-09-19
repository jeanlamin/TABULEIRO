import { FieldPanel } from "@/components/field/FieldPanel";
import { InspectorPanel } from "@/components/inspector/InspectorPanel";
import { LineagePanel } from "@/components/lineage/LineagePanel";
import { ReaderPanel } from "@/components/reader/ReaderPanel";
import { Sidebar } from "@/components/shell/Sidebar";

/**
 * Structural shell only. Layout regions are final; visual refinement is
 * deferred to the Canonical UI Baseline slice.
 */
export function ProductShell() {
  return (
    <div className="flex h-dvh w-full bg-background text-foreground">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1">
          <FieldPanel />
          <ReaderPanel />
          <InspectorPanel />
        </div>
        <LineagePanel />
      </div>
    </div>
  );
}
