"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  formatDateKey,
  getTodoItemById,
  type TodoCreateRequest,
  type TodoUpdateRequest,
} from "./lib/todos";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

export async function createTodoAction(formData: FormData) {
  const todoText = formData.get("todoText")?.toString().trim();

  if (!todoText) {
    redirect("/todos/new?error=empty");
  }

  const newTodo: TodoCreateRequest = {
    text: todoText,
    isCompleted: false,
    date: formatDateKey(new Date()),
  };

  const response = await fetch(`${BACKEND_URL}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTodo),
  });

  if (!response.ok) {
    throw new Error("Todo 생성에 실패했습니다.");
  }

  revalidatePath("/todos");
  redirect("/todos");
}

export async function updateTodoAction(todoId: string, formData: FormData) {
  const todoText = formData.get("todoText")?.toString().trim();

  if (!todoText) {
    redirect(`/todos/${todoId}?error=empty`);
  }

  const currentTodo = await getTodoItemById(todoId);

  if (!currentTodo) {
    throw new Error("수정할 Todo를 찾을 수 없습니다.");
  }

  const updatedTodo: TodoUpdateRequest = {
    text: todoText,
    isCompleted: currentTodo.isCompleted,
    date: currentTodo.date,
  };

  const response = await fetch(`${BACKEND_URL}/todos/${todoId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedTodo),
  });

  if (!response.ok) {
    throw new Error("Todo 수정에 실패했습니다.");
  }

  revalidatePath("/todos");
  redirect("/todos");
}

export async function toggleTodoAction(todoId: string) {
  const currentTodo = await getTodoItemById(todoId);

  if (!currentTodo) {
    throw new Error("완료 처리할 Todo를 찾을 수 없습니다.");
  }

  const updatedTodo: TodoUpdateRequest = {
    text: currentTodo.text,
    isCompleted: !currentTodo.isCompleted,
    date: currentTodo.date,
  };

  const response = await fetch(`${BACKEND_URL}/todos/${todoId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedTodo),
  });

  if (!response.ok) {
    throw new Error("Todo 완료 상태 변경에 실패했습니다.");
  }

  revalidatePath("/todos");
}

export async function deleteTodoAction(todoId: string) {
  const response = await fetch(`${BACKEND_URL}/todos/${todoId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Todo 삭제에 실패했습니다.");
  }

  revalidatePath("/todos");
}