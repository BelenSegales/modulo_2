export function SkelentonCardProducto() {
  return (
    <article className="card animate-pulse" aria-hidden="true">
      <div className="h-[150px] bg-slate-200" />
      <div className="h-[58px] bg-slate-100" />
      <div className="card-content space-y-3">
        <div className="flex justify-between gap-3">
          <div className="h-4 w-32 rounded bg-slate-200" />
          <div className="h-4 w-16 rounded bg-slate-200" />
        </div>
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-3 w-2/3 rounded bg-slate-100" />
        <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
          <div className="h-6 w-20 rounded bg-slate-200" />
          <div className="ml-auto h-8 w-24 rounded-lg bg-slate-200" />
        </div>
      </div>
    </article>
  );
}
