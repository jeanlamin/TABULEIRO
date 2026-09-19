export function Sidebar() {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-white/10 p-3">
      <div className="px-1 py-2 text-sm font-semibold">Complexity</div>
      <div className="mt-1 px-1 text-xs text-white/50">Workspace</div>
      <nav className="mt-4 flex flex-col gap-1 text-sm text-white/70">
        <span className="rounded px-2 py-1">Sources</span>
      </nav>
    </aside>
  );
}
