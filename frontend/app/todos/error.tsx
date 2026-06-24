"use client";

type TodoErrorPageProps = {
  error: Error;
  reset: () => void;
};

export default function TodoErrorPage({ error, reset }: TodoErrorPageProps) {
  return (
    <main className="min-h-screen bg-[#f6f3ff] px-5 py-20 text-zinc-900">
      <section className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center shadow-[0_16px_40px_rgba(103,43,224,0.12)]">
        <h1 className="mb-3 text-3xl font-bold text-[#672be0]">
          문제가 발생했어요
        </h1>

        <p className="mb-6 text-sm text-zinc-500">
          Todo 데이터를 처리하는 중 오류가 발생했어요.
        </p>

        <p className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error.message}
        </p>

        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-[#672be0] px-5 py-3 text-sm font-semibold text-white"
        >
          다시 시도
        </button>
      </section>
    </main>
  );
}