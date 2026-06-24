import Link from "next/link";
import { notFound } from "next/navigation";
import { updateTodoAction } from "../../actions";
import { getTodoItemById } from "../../lib/todos";

type TodoEditPageProps = {
  params: Promise<{
    todoId: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function TodoEditPage({
  params,
  searchParams,
}: TodoEditPageProps) {
  const { todoId } = await params;
  const { error } = await searchParams;

  const todoItem = await getTodoItemById(todoId);

  if (!todoItem) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f6f3ff] px-5 py-20 text-zinc-900">
      <section className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-[0_16px_40px_rgba(103,43,224,0.12)]">
        <header className="mb-7">
          <h1 className="mb-2 text-4xl font-bold text-[#672be0]">
            Todo 수정
          </h1>
          <p className="text-sm text-zinc-500">
            선택한 Todo 내용을 수정해요.
          </p>
        </header>

        <form
          action={updateTodoAction.bind(null, String(todoItem.id))}
          className="flex flex-col gap-3"
        >
          <input
            name="todoText"
            type="text"
            defaultValue={todoItem.text}
            className="rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-[#672be0]"
          />

          {error === "empty" && (
            <p className="text-sm text-red-600">
              수정할 Todo 내용을 입력해주세요.
            </p>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-xl bg-[#672be0] px-5 py-3 text-sm font-semibold text-white"
            >
              저장
            </button>

            <Link
              href="/todos"
              className="rounded-xl bg-zinc-100 px-5 py-3 text-sm font-semibold text-zinc-600"
            >
              취소
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}