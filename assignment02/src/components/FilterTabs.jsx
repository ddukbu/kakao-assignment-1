function FilterTabs({ currentFilter, onChangeTodoFilter }) {
  const filterOptions = [
    {
      label: "전체",
      value: "all",
    },
    {
      label: "진행 중",
      value: "active",
    },
    {
      label: "완료",
      value: "completed",
    },
  ];

  return (
    <div className="mb-5 flex gap-2 rounded-2xl bg-[#f3efff] p-2">
      {filterOptions.map((filterOption) => {
        const isSelected = currentFilter === filterOption.value;

        return (
          <button
            key={filterOption.value}
            type="button"
            onClick={() => onChangeTodoFilter(filterOption.value)}
            className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              isSelected
                ? "bg-[#672be0] text-white shadow-[0_8px_18px_rgba(103,43,224,0.22)]"
                : "text-zinc-500 hover:bg-white/70"
            }`}
          >
            {filterOption.label}
          </button>
        );
      })}
    </div>
  );
}

export default FilterTabs;