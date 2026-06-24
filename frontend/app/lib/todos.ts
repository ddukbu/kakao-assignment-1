export type Todo = {
  id: number;
  text: string;
  isCompleted: boolean;
  date: string;
};

export type TodoCreateRequest = {
  text: string;
  isCompleted: boolean;
  date: string;
};

export type TodoUpdateRequest = {
  text: string;
  isCompleted: boolean;
  date: string;
};

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

export function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export async function getTodoItems() {
  const response = await fetch(`${BACKEND_URL}/todos`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Todo 목록을 불러오지 못했습니다.");
  }

  return response.json() as Promise<Todo[]>;
}

export async function getTodoItemById(todoId: string) {
  const todoItems = await getTodoItems();

  return todoItems.find((todoItem) => String(todoItem.id) === todoId);
}