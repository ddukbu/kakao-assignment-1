//import { useState } from "react";
import { useRef } from "react";

function TodoItem({
  todoItem,
  isEditing,
  onDeleteTodoItem,
  onToggleTodoCompletion,
  onStartEditingTodoItem,
  onCancelEditingTodoItem,
  onSaveEditedTodoItem,
}) {
  const editedTodoText = useRef(todoItem.text);

  function handleSaveEditedTodo() {
    const editText = editedTodoText.current.value;

    onSaveEditedTodoItem(todoItem.id, editText);
  }


  if (isEditing) {
    return (
      <li className="flex items-center gap-3 rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
        <input
          type="text"
          ref={editedTodoText}
          className="min-w-0 flex-1 rounded-xl border border-[#672be0] bg-white px-3 py-2 text-sm outline-none"
          autoFocus
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSaveEditedTodo}
            className="rounded-xl bg-[#672be0] px-3 py-2 text-xs font-semibold text-white"
          >
            저장
          </button>

          <button
            type="button"
            onClick={onCancelEditingTodoItem}
            className="rounded-xl bg-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-600"
          >
            취소
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="flex items-center gap-3 rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
      <span
        className={`min-w-0 flex-1 break-all text-sm ${
          todoItem.isCompleted ? "text-zinc-400 line-through" : "text-zinc-800"
        }`}
      >
        {todoItem.text}
      </span>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onStartEditingTodoItem(todoItem.id)}
          className="rounded-xl bg-[#ede7ff] px-3 py-2 text-xs font-semibold text-[#672be0]"
        >
          수정
        </button>

        <button
          type="button"
          onClick={() => onToggleTodoCompletion(todoItem.id)}
          className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700"
        >
          {todoItem.isCompleted ? "취소" : "완료"}
        </button>

        <button
          type="button"
          onClick={() => onDeleteTodoItem(todoItem.id)}
          className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600"
        >
          삭제
        </button>
      </div>
    </li>
  );
}

export default TodoItem;