//import { useState } from "react";
import { useRef } from "react";

function TodoForm({ onAddTodoItem }) {
  const todoInputText = useRef("");

  function handleSubmit(event) {
    event.preventDefault();

    onAddTodoItem(todoInputText.current.value);
    todoInputText.current.value = "";
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        ref={todoInputText}
        placeholder="할 일을 입력하세요"
        className="flex-1 rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-[#672be0]"
      />

      <button
        type="submit"
        className="rounded-xl bg-[#672be0] px-5 font-semibold text-white"
      >
        추가
      </button>
    </form>
  );
}

export default TodoForm;