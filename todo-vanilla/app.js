const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const messageText = document.getElementById("messageText");
const filterButtons = document.querySelectorAll(".filter-button");

let todoItems = [];
let currentFilter = "all";

// 현재 선택된 필터에 맞는 Todo 목록을 반환하는 함수
function getFilteredTodoItems() {
  if (currentFilter === "active") {
    return todoItems.filter((todoItem) => !todoItem.isCompleted);
  }

  if (currentFilter === "completed") {
    return todoItems.filter((todoItem) => todoItem.isCompleted);
  }

  return todoItems;
}

// Todo 목록을 화면에 다시 그리는 함수
function renderTodoList() {
  todoList.innerHTML = "";

  const filteredTodoItems = getFilteredTodoItems();

  filteredTodoItems.forEach((todoItem) => {
    const todoListItem = document.createElement("li");
    todoListItem.className = "todo-item";

    const todoText = document.createElement("span");
    todoText.className = todoItem.isCompleted
      ? "todo-text completed"
      : "todo-text";
    todoText.textContent = todoItem.text;

    const todoActions = document.createElement("div");
    todoActions.className = "todo-actions";

    const editButton = createTodoButton("수정", "edit-button", () => {
      editTodoItem(todoItem.id);
    });

    const completeButton = createTodoButton("완료", "complete-button", () => {
      toggleTodoCompletion(todoItem.id);
    });

    const deleteButton = createTodoButton("삭제", "delete-button", () => {
      deleteTodoItem(todoItem.id);
    });

    todoActions.append(editButton, completeButton, deleteButton);
    todoListItem.append(todoText, todoActions);
    todoList.appendChild(todoListItem);
  });
}

// Todo 버튼을 생성하는 공통 함수
function createTodoButton(buttonText, buttonClassName, clickHandler) {
  const button = document.createElement("button");

  button.type = "button";
  button.textContent = buttonText;
  button.className = `todo-button ${buttonClassName}`;
  button.addEventListener("click", clickHandler);

  return button;
}

// 현재 선택된 필터 탭의 스타일을 갱신하는 함수
function updateFilterButtonStyles() {
  filterButtons.forEach((filterButton) => {
    const filterType = filterButton.dataset.filter;

    if (filterType === currentFilter) {
      filterButton.classList.add("active");
    } else {
      filterButton.classList.remove("active");
    }
  });
}

// Todo를 추가하는 함수
function addTodoItem(todoText) {
  const newTodoItem = {
    id: Date.now(),
    text: todoText,
    isCompleted: false,
  };

  todoItems.push(newTodoItem);
  renderTodoList();
}

// Todo를 수정하는 함수
function editTodoItem(todoId) {
  const targetTodoItem = todoItems.find((todoItem) => todoItem.id === todoId);

  if (!targetTodoItem) return;

  const editedTodoText = prompt("수정할 내용을 입력하세요.", targetTodoItem.text);

  if (editedTodoText === null) return;

  const trimmedTodoText = editedTodoText.trim();

  if (trimmedTodoText === "") {
    showMessage("수정할 Todo 내용을 입력해주세요.");
    return;
  }

  targetTodoItem.text = trimmedTodoText;
  clearMessage();
  renderTodoList();
}

// Todo 완료 상태를 변경하는 함수
function toggleTodoCompletion(todoId) {
  todoItems = todoItems.map((todoItem) => {
    if (todoItem.id === todoId) {
      return {
        ...todoItem,
        isCompleted: !todoItem.isCompleted,
      };
    }

    return todoItem;
  });

  renderTodoList();
}

// Todo를 삭제하는 함수
function deleteTodoItem(todoId) {
  todoItems = todoItems.filter((todoItem) => todoItem.id !== todoId);
  renderTodoList();
}

// 안내 메시지를 표시하는 함수
function showMessage(message) {
  messageText.textContent = message;
}

// 안내 메시지를 비우는 함수
function clearMessage() {
  messageText.textContent = "";
}

// 폼 제출 시 Todo 생성
todoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const todoText = todoInput.value.trim();

  if (todoText === "") {
    showMessage("Todo 내용을 입력해주세요.");
    return;
  }

  addTodoItem(todoText);
  todoInput.value = "";
  clearMessage();
});

// 필터 탭 클릭 시 현재 필터 상태를 변경하는 이벤트들을 각 필터 버튼에 등록
filterButtons.forEach((filterButton) => {
  filterButton.addEventListener("click", () => {
    currentFilter = filterButton.dataset.filter;

    updateFilterButtonStyles();
    renderTodoList();
  });
});