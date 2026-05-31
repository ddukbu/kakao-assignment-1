const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const messageText = document.getElementById("messageText");

const selectedDateText = document.getElementById("selectedDateText");
const previousWeekButton = document.getElementById("previousWeekButton");
const nextWeekButton = document.getElementById("nextWeekButton");
const weekDateList = document.getElementById("weekDateList");

const filterButtons = document.querySelectorAll(".filter-button");

const TODO_STORAGE_KEY = "vanillaTodoItems";

let todoItems = [];
let currentFilter = "all";
let selectedDate = new Date();

// Date 객체를 복사하는 함수
function copyDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// 날짜를 YYYY-MM-DD 형태의 문자열로 변환하는 함수
function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// 화면에 표시할 날짜 문자열을 만드는 함수
function formatDateText(date) {
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

// 선택된 날짜가 속한 주의 월요일을 구하는 함수
function getStartOfWeek(date) {
  const copiedDate = copyDate(date);
  const day = copiedDate.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;

  copiedDate.setDate(copiedDate.getDate() + mondayOffset);

  return copiedDate;
}

// 현재 선택된 주의 월요일부터 일요일까지 Date 배열을 만드는 함수
function getWeekDates() {
  const startOfWeek = getStartOfWeek(selectedDate);
  const weekDates = [];

  for (let index = 0; index < 7; index++) {
    const weekDate = copyDate(startOfWeek);
    weekDate.setDate(startOfWeek.getDate() + index);
    weekDates.push(weekDate);
  }

  return weekDates;
}

// 특정 날짜에 해당하는 Todo 개수를 반환하는 함수
function getTodoCountByDate(date) {
  const dateKey = formatDateKey(date);

  return todoItems.filter((todoItem) => todoItem.date === dateKey).length;
}

// Todo 배열을 로컬스토리지에 저장하는 함수
function saveTodoItemsToLocalStorage() {
  const todoItemsJson = JSON.stringify(todoItems);

  localStorage.setItem(TODO_STORAGE_KEY, todoItemsJson);
}

// 로컬스토리지에 저장된 Todo 배열을 불러오는 함수
function loadTodoItemsFromLocalStorage() {
  const savedTodoItemsJson = localStorage.getItem(TODO_STORAGE_KEY);

  if (savedTodoItemsJson === null) {
    return [];
  }

  return JSON.parse(savedTodoItemsJson);
}

// 선택된 날짜 텍스트를 화면에 표시하는 함수
function renderSelectedDate() {
  selectedDateText.textContent = formatDateText(selectedDate);
}

// 주간 날짜 목록을 화면에 표시하는 함수
function renderWeekDateList() {
  const weekDates = getWeekDates();
  const todayKey = formatDateKey(new Date());
  const selectedDateKey = formatDateKey(selectedDate);

  weekDateList.innerHTML = "";

  weekDates.forEach((weekDate) => {
    const weekDateKey = formatDateKey(weekDate);
    const todoCount = getTodoCountByDate(weekDate);

    const weekDateButton = document.createElement("button");
    weekDateButton.type = "button";
    weekDateButton.className = "week-date-button";

    if (weekDateKey === selectedDateKey) {
      weekDateButton.classList.add("selected");
    }

    if (weekDateKey === todayKey) {
      weekDateButton.classList.add("today");
    }

    weekDateButton.innerHTML = `
      <span class="week-day-name">
        ${weekDate.toLocaleDateString("ko-KR", { weekday: "short" })}
      </span>
      <span class="week-day-number">
        ${weekDate.getDate()}
      </span>
      <span class="week-todo-count">
        ${todoCount}개
      </span>
    `;

    weekDateButton.addEventListener("click", () => {
      selectedDate = copyDate(weekDate);

      renderSelectedDate();
      renderWeekDateList();
      renderTodoList();
    });

    weekDateList.appendChild(weekDateButton);
  });
}

// 선택된 주를 이동시키는 함수
function moveSelectedWeek(weekAmount) {
  selectedDate.setDate(selectedDate.getDate() + weekAmount * 7);

  renderSelectedDate();
  renderWeekDateList();
  renderTodoList();
}

// 현재 선택된 날짜와 필터에 맞는 Todo 목록을 반환하는 함수
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
    date: formatDateKey(selectedDate),
  };

  todoItems.push(newTodoItem);
  saveTodoItemsToLocalStorage();
  renderWeekDateList();
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

  saveTodoItemsToLocalStorage();
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

  saveTodoItemsToLocalStorage();
  renderTodoList();
}

// Todo를 삭제하는 함수
function deleteTodoItem(todoId) {
  todoItems = todoItems.filter((todoItem) => todoItem.id !== todoId);

  saveTodoItemsToLocalStorage();
  renderWeekDateList();
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

// 폼 제출 시 현재 선택된 날짜의 Todo 생성
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

// 이전 주 버튼 클릭 시 7일 전으로 이동
previousWeekButton.addEventListener("click", () => {
  moveSelectedWeek(-1);
});

// 다음 주 버튼 클릭 시 7일 뒤로 이동
nextWeekButton.addEventListener("click", () => {
  moveSelectedWeek(1);
});

// 필터 탭 클릭 시 현재 필터 상태를 변경
filterButtons.forEach((filterButton) => {
  filterButton.addEventListener("click", () => {
    currentFilter = filterButton.dataset.filter;

    updateFilterButtonStyles();
    renderTodoList();
  });
});

// 앱이 처음 실행될 때 로컬스토리지에서 Todo 데이터를 불러옴
todoItems = loadTodoItemsFromLocalStorage();

// 앱이 처음 실행될 때 오늘 날짜, 주간 날짜 목록, Todo 목록을 화면에 표시
renderSelectedDate();
renderWeekDateList();
renderTodoList();