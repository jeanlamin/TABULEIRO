export function InspectorPanel() {
  return (
    <section className="flex w-80 shrink-0 flex-col">
      <header className="border-b border-white/10 px-3 py-2 text-xs uppercase tracking-wide text-white/50">
        Inspector
      </header>
      <div className="flex flex-1 items-center justify-center px-4 text-center text-sm text-white/40">
        Select something to inspect.
      </div>
    </section>
  );
}
