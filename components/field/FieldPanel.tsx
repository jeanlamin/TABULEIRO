export function FieldPanel() {
  return (
    <section className="flex min-w-0 flex-1 flex-col border-r border-white/10">
      <header className="border-b border-white/10 px-3 py-2 text-xs uppercase tracking-wide text-white/50">
        Field
      </header>
      <div className="flex flex-1 items-center justify-center text-sm text-white/40">
        Your field is empty.
      </div>
    </section>
  );
}
