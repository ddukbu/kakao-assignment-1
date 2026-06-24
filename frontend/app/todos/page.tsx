import Link from "next/link";
import { deleteTodoAction, toggleTodoAction } from "../actions";
import { getTodoItems } from "../lib/todos";

export default async function TodoListPage() {
  const todoItems = await getTodoItems();

  return (
    <main className="min-h-screen bg-[#f6f3ff] px-5 py-20 text-zinc-900">
      <section className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-[0_16px_40px_rgba(103,43,224,0.12)]">
        <header className="mb-7 flex items-center justify-between gap-4">
          <div>
            <h1 className="mb-2 text-4xl font-bold text-[#672be0]">Todo</h1>
            <p className="text-sm text-zinc-500">
              FastAPI 서버에서 Todo 목록을 불러와요.
            </p>
          </div>

          <Link
            href="/todos/new"
            className="rounded-xl bg-[#672be0] px-4 py-3 text-sm font-semibold text-white"
          >
            새 Todo
          </Link>
        </header>

        {todoItems.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-zinc-200 py-8 text-center text-sm text-zinc-400">
            등록된 Todo가 없습니다.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {todoItems.map((todoItem) => (
              <li
                key={todoItem.id}
                className="flex items-center gap-3 rounded-2xl border border-zinc-100 bg-zinc-50 p-4"
              >
                <span
                  className={`min-w-0 flex-1 break-all text-sm ${
                    todoItem.isCompleted
                      ? "text-zinc-400 line-through"
                      : "text-zinc-800"
                  }`}
                >
                  {todoItem.text}
                </span>

                <div className="flex gap-2">
                  <Link
                    href={`/todos/${todoItem.id}`}
                    className="rounded-xl bg-[#ede7ff] px-3 py-2 text-xs font-semibold text-[#672be0]"
                  >
                    수정
                  </Link>

                  <form action={toggleTodoAction.bind(null, String(todoItem.id))}>
                    <button
                      type="submit"
                      className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700"
                    >
                      {todoItem.isCompleted ? "취소" : "완료"}
                    </button>
                  </form>

                  <form action={deleteTodoAction.bind(null, String(todoItem.id))}>
                    <button
                      type="submit"
                      className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600"
                    >
                      삭제
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}