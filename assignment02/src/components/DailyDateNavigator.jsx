function DailyDateNavigator({ selectedDate, onMoveSelectedDate }) {
  function formatDateText(date) {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  }

  return (
    <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl bg-[#f3efff] p-3">
      <button
        type="button"
        onClick={() => onMoveSelectedDate(-1)}
        className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-[#672be0]"
      >
        이전
      </button>

      <strong className="text-center text-md font-bold text-[#672be0]">
        {formatDateText(selectedDate)}
      </strong>

      <button
        type="button"
        onClick={() => onMoveSelectedDate(1)}
        className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-[#672be0]"
      >
        다음
      </button>
    </div>
  );
}

export default DailyDateNavigator;