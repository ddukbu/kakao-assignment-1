import { useState } from "react";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";

function App() {
  const [todoItems, setTodoItems] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [editingTodoId, setEditingTodoId] = useState(null);

  function addTodoItem(todoText) {
    const trimmedTodoText = todoText.trim();

    if (trimmedTodoText === "") {
      setMessageText("Todo 내용을 입력해주세요.");
      return;
    }

    const newTodoItem = {
      id: Date.now(),
      text: trimmedTodoText,
      isCompleted: false,
    };

    setTodoItems([...todoItems, newTodoItem]);
    setMessageText("");
  }

  function deleteTodoItem(todoId) {
    setTodoItems(todoItems.filter((todoItem) => todoItem.id !== todoId));

    if (editingTodoId === todoId) {
      setEditingTodoId(null);
    }
  }

  function toggleTodoCompletion(todoId) {
    setTodoItems(
      todoItems.map((todoItem) => {
        if (todoItem.id === todoId) {
          return {
            ...todoItem,
            isCompleted: !todoItem.isCompleted,
          };
        }

        return todoItem;
      })
    );

    if (editingTodoId === todoId) {
      setEditingTodoId(null);
    }
  }

  function startEditingTodoItem(todoId) {
    setEditingTodoId(todoId);
    setMessageText("");
  }

  function cancelEditingTodoItem() {
    setEditingTodoId(null);
    setMessageText("");
  }

  function saveEditedTodoItem(todoId, editedText) {
    const trimmedEditedText = editedText.trim();

    if (trimmedEditedText === "") {
      setMessageText("수정할 Todo 내용을 입력해주세요.");
      return;
    }

    setTodoItems(
      todoItems.map((todoItem) => {
        if (todoItem.id === todoId) {
          return {
            ...todoItem,
            text: trimmedEditedText,
          };
        }

        return todoItem;
      })
    );

    setEditingTodoId(null);
    setMessageText("");
  }

  return (
    <main className="min-h-screen bg-[#f6f3ff] px-5 py-20 text-zinc-900">
      <section className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-[0_16px_40px_rgba(103,43,224,0.12)]">
        <header className="mb-7">
          <h1 className="mb-2 text-4xl font-bold text-[#672be0]">Todo</h1>
          <p className="text-sm text-zinc-500">
            오늘 해야 할 일을 간단하게 관리해보세요.
          </p>
        </header>

        <TodoForm onAddTodoItem={addTodoItem} />

        <p className="my-3 h-6 text-sm text-red-600">{messageText}</p>

        <TodoList
          todoItems={todoItems}
          editingTodoId={editingTodoId}
          onDeleteTodoItem={deleteTodoItem}
          onToggleTodoCompletion={toggleTodoCompletion}
          onStartEditingTodoItem={startEditingTodoItem}
          onCancelEditingTodoItem={cancelEditingTodoItem}
          onSaveEditedTodoItem={saveEditedTodoItem}
        />
      </section>
    </main>
  );
}

export default App;