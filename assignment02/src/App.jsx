import { useEffect, useState } from "react";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import FilterTabs from "./components/FilterTabs";
import DailyDateNavigator from "./components/DailyDateNavigator";

const TODO_STORAGE_KEY = "todoItems";

function App() {
  const [todoItems, setTodoItems] = useState(() => {
    const savedTodoItems = localStorage.getItem(TODO_STORAGE_KEY);

    if (savedTodoItems === null) {
      return [];
    }

    return JSON.parse(savedTodoItems);
  });

  const [messageText, setMessageText] = useState("");
  const [editingTodoId, setEditingTodoId] = useState(null);

  // 현재 선택된 필터 상태를 useState로 관리
  const [currentFilter, setCurrentFilter] = useState("all");

  // 현재 선택된 날짜를 useState로 관리
  const [selectedDate, setSelectedDate] = useState(new Date());

  // todoItems가 변경될 때마다 로컬스토리지에 자동 저장
  useEffect(() => {
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todoItems));
  }, [todoItems]);

  function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function moveSelectedDate(dayAmount) {
    const nextDate = new Date(selectedDate);

    nextDate.setDate(nextDate.getDate() + dayAmount);
    setSelectedDate(nextDate);
    setEditingTodoId(null);
  }

  function getFilteredTodoItems() {
    const selectedDateKey = formatDateKey(selectedDate);

    let filteredTodoItems = todoItems.filter((todoItem) => {
      return todoItem.date === selectedDateKey;
    });

    if (currentFilter === "active") {
      filteredTodoItems = filteredTodoItems.filter((todoItem) => {
        return !todoItem.isCompleted;
      });
    }

    if (currentFilter === "completed") {
      filteredTodoItems = filteredTodoItems.filter((todoItem) => {
        return todoItem.isCompleted;
      });
    }

    return filteredTodoItems;
  }

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
      date: formatDateKey(selectedDate),
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

  function changeTodoFilter(nextFilter) {
    setCurrentFilter(nextFilter);
    setEditingTodoId(null);
  }

  const filteredTodoItems = getFilteredTodoItems();

  return (
    <main className="min-h-screen bg-[#f6f3ff] px-5 py-20 text-zinc-900">
      <section className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-[0_16px_40px_rgba(103,43,224,0.12)]">
        <header className="mb-7">
          <h1 className="mb-2 text-4xl font-bold text-[#672be0]">Todo</h1>
          <p className="text-sm text-zinc-500">
            날짜별로 오늘 해야 할 일을 관리해보세요.
          </p>
        </header>

        <DailyDateNavigator
          selectedDate={selectedDate}
          onMoveSelectedDate={moveSelectedDate}
        />

        <TodoForm onAddTodoItem={addTodoItem} />

        <p className="my-3 h-6 text-sm text-red-600">{messageText}</p>

        <FilterTabs
          currentFilter={currentFilter}
          onChangeTodoFilter={changeTodoFilter}
        />

        <TodoList
          todoItems={filteredTodoItems}
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