import TodoItem from "./TodoItem";

function TodoList({
  todoItems,
  editingTodoId,
  onDeleteTodoItem,
  onToggleTodoCompletion,
  onStartEditingTodoItem,
  onCancelEditingTodoItem,
  onSaveEditedTodoItem,
}) {
  if (todoItems.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-zinc-200 py-8 text-center text-sm text-zinc-400">
        표시할 Todo가 없습니다.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {todoItems.map((todoItem) => (
        <TodoItem
          key={todoItem.id}
          todoItem={todoItem}
          isEditing={todoItem.id === editingTodoId}
          onDeleteTodoItem={onDeleteTodoItem}
          onToggleTodoCompletion={onToggleTodoCompletion}
          onStartEditingTodoItem={onStartEditingTodoItem}
          onCancelEditingTodoItem={onCancelEditingTodoItem}
          onSaveEditedTodoItem={onSaveEditedTodoItem}
        />
      ))}
    </ul>
  );
}

export default TodoList;