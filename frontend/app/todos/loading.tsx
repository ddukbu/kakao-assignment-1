export default function TodoLoadingPage() {
  return (
    <main className="min-h-screen bg-[#f6f3ff] px-5 py-20 text-zinc-900">
      <section className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-[0_16px_40px_rgba(103,43,224,0.12)]">
        <div className="mb-7">
          <div className="mb-3 h-9 w-32 animate-pulse rounded-xl bg-[#ede7ff]" />
          <div className="h-4 w-64 animate-pulse rounded-lg bg-zinc-100" />
        </div>

        <div className="flex flex-col gap-3">
          <div className="h-14 animate-pulse rounded-2xl bg-zinc-100" />
          <div className="h-14 animate-pulse rounded-2xl bg-zinc-100" />
          <div className="h-14 animate-pulse rounded-2xl bg-zinc-100" />
        </div>
      </section>
    </main>
  );
}