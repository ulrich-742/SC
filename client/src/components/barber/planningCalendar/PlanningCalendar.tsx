import { useMemo, useState } from "react";
import "./PlanningCalendar.css";
import type { Appointment } from "../../../types/appointment";

type ViewMode = "day" | "week" | "month";

type CalendarDay = {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
};

type Props = {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  reservations: Appointment[];
};

const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const hours = ["09:00", "11:30", "14:00", "15:30", "17:00"];

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatHour(date: string) {
  return new Date(date).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getMonthDays(year: number, month: number): CalendarDay[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

  const days: CalendarDay[] = [];

  for (let i = startDay; i > 0; i--) {
    const date = new Date(year, month, 1 - i);

    days.push({
      date,
      day: date.getDate(),
      isCurrentMonth: false,
    });
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day);

    days.push({
      date,
      day,
      isCurrentMonth: true,
    });
  }

  while (days.length % 7 !== 0) {
    const date = new Date(year, month, days.length - startDay + 1);

    days.push({
      date,
      day: date.getDate(),
      isCurrentMonth: false,
    });
  }

  return days;
}

function getWeekDays(date: Date): Date[] {
  const day = date.getDay() === 0 ? 6 : date.getDay() - 1;
  const monday = new Date(date);

  monday.setDate(date.getDate() - day);

  return Array.from({ length: 7 }, (_, index) => {
    const weekDate = new Date(monday);
    weekDate.setDate(monday.getDate() + index);

    return weekDate;
  });
}

function isSameDate(dateA: Date, dateB: Date) {
  return (
    dateA.getDate() === dateB.getDate() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getFullYear() === dateB.getFullYear()
  );
}

function PlanningCalendar({ selectedDate, onSelectDate, reservations }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>("month");

  const [currentMonth, setCurrentMonth] = useState(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  );

  const calendarDays = useMemo(() => {
    return getMonthDays(currentMonth.getFullYear(), currentMonth.getMonth());
  }, [currentMonth]);

  const currentWeekDays = useMemo(() => {
    return getWeekDays(selectedDate);
  }, [selectedDate]);

  const monthLabel = currentMonth.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  function handlePreviousMonth() {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  }

  function handleNextMonth() {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  }

  function handleSelectDay(date: Date) {
    onSelectDate(date);

    if (date.getMonth() !== currentMonth.getMonth()) {
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  }

  return (
    <section className={`planning-calendar ${viewMode}`}>
      <header className="planning-topbar">
        <h2>Planning</h2>
      </header>

      <div className="planning-month-navigation">
        <button
          type="button"
          className="circle-button"
          onClick={handlePreviousMonth}
        >
          ‹
        </button>

        <div className="planning-month-label">
          <span>📅</span>
          <strong>{viewMode === "day" ? "Aujourd'hui" : monthLabel}</strong>
        </div>

        <button
          type="button"
          className="circle-button"
          onClick={handleNextMonth}
        >
          ›
        </button>
      </div>

      {viewMode === "day" && (
        <div className="day-week-selector">
          {currentWeekDays.map((date, index) => {
            const selected = isSameDate(date, selectedDate);

            return (
              <button
                key={date.toISOString()}
                type="button"
                className={`day-week-item ${selected ? "selected" : ""}`}
                onClick={() => handleSelectDay(date)}
              >
                <span>{weekDays[index]}</span>
                <strong>{date.getDate()}</strong>
              </button>
            );
          })}
        </div>
      )}

      <div className="planning-tabs">
        <button
          type="button"
          className={viewMode === "day" ? "active" : ""}
          onClick={() => setViewMode("day")}
        >
          Jour
        </button>

        <button
          type="button"
          className={viewMode === "week" ? "active" : ""}
          onClick={() => setViewMode("week")}
        >
          Semaine
        </button>

        <button
          type="button"
          className={viewMode === "month" ? "active" : ""}
          onClick={() => setViewMode("month")}
        >
          Mois
        </button>
      </div>

      {viewMode === "month" && (
        <>
          <div className="calendar-weekdays">
            {weekDays.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="calendar-grid">
            {calendarDays.map((item) => {
              const selected = isSameDate(item.date, selectedDate);

              return (
                <button
                  key={item.date.toISOString()}
                  type="button"
                  onClick={() => handleSelectDay(item.date)}
                  className={`calendar-day ${
                    !item.isCurrentMonth ? "muted" : ""
                  } ${selected ? "selected" : ""}`}
                >
                  <span>{item.day}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {viewMode === "week" && (
        <div className="week-planning">
          <div className="week-planning-header">
            <div />

            {currentWeekDays.map((date, index) => (
              <button
                key={date.toISOString()}
                type="button"
                className={`week-planning-day ${
                  isSameDate(date, selectedDate) ? "selected" : ""
                }`}
                onClick={() => handleSelectDay(date)}
              >
                <span>{weekDays[index]}</span>
                <strong>{date.getDate()}</strong>
              </button>
            ))}
          </div>

          <div className="week-planning-body">
            {hours.map((hour) => (
              <div key={hour} className="week-planning-row">
                <div className="week-planning-hour">{hour}</div>

                {currentWeekDays.map((date) => {
                  const dateKey = formatDateKey(date);

                  const reservation = reservations.find((item) => {
                    const reservationDate = new Date(item.appointment_date);

                    return (
                      formatDateKey(reservationDate) === dateKey &&
                      formatHour(item.appointment_date) === hour
                    );
                  });

                  return (
                    <button
                      key={`${dateKey}-${hour}`}
                      type="button"
                      className={`week-planning-cell ${
                        reservation ? "has-reservation" : ""
                      }`}
                      onClick={() => handleSelectDay(date)}
                    >
                      {reservation && (
                        <div className="week-reservation">
                          <strong>{reservation.customer_firstname}</strong>
                          <span>{reservation.prestation_name}</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default PlanningCalendar;
