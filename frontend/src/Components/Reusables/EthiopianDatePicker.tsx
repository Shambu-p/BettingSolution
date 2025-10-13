import React, { useState, useEffect } from "react";
import * as ethiopianDate from "ethiopian-date";
import FieldTypes from "../../Enums/FiedTypes";


// === Ethiopian DateTime Picker ===
export default function EthiopianDateTimePicker({ value, type, onChange, readOnly }: {readOnly?: boolean, value: string, type?: string, onChange?: (date: string) => void}) {
  const monthNames = [
    "Meskerem", "Tikimt", "Hidar", "Tahsas", "Tir", "Yekatit",
    "Megabit", "Miyazya", "Ginbot", "Sene", "Hamle", "Nehase", "Pagume"
  ];

  const [selected, setSelected] = useState<any>({ year: 2015, month: 1, day: 1 });
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState<any>({ year: 2015, month: 1, day: 1 });

  // Parse incoming value
  useEffect(() => {
    if (!value || (type == FieldTypes.DATETIME && !value.includes("T")) || (type == FieldTypes.DATE && value == "")) {

      setSelected({
        year: "YY",
        month: "MM",
        day: "DD"
      });

      let dt = new Date();
      let ethDate = ethiopianDate.toEthiopian(dt.getFullYear(), (dt.getMonth() + 1), dt.getDate());
      setCurrentDate({
        year: ethDate[0],
        month: ethDate[1],
        day: ethDate[2]
      });

      console.log("current date ", {
        year: ethDate[0],
        month: ethDate[1],
        day: ethDate[2]
      });

    } else {

      let [datePart, timePart] = ["", ""];

      if( type == FieldTypes.DATETIME) {
        [datePart, timePart] = value.split("T");
      } else {
        datePart = value;
        timePart = "00:00";
      }

      const [gYear, gMonth, gDay] = datePart.split("-").map(Number);
      const [h, m] = timePart.split(":").map(Number);

      const ethDate = ethiopianDate.toEthiopian(gYear, gMonth, gDay);
      setSelected({
        year: ethDate[0],
        month: ethDate[1],
        day: ethDate[2]
      });
      setHour(h);
      setMinute(m);

    }
  }, [value]);

  const daysInMonth = (m, y) => (m === 13 ? (y % 4 === 3 ? 6 : 5) : 30);

  const handleApply = () => {
    const gregDate = ethiopianDate.toGregorian(selected.year, selected.month, selected.day);
    const formatted = `${gregDate[0]}-${String(gregDate[1]).padStart(2, "0")}-${String(gregDate[2]).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    onChange && onChange(formatted);
    setShowCalendar(false);
  };

  const fixDatePick = (pick: any) => {
    if (pick.year === "YY" || pick.month === "MM" || pick.day === "DD") {
      return {
        year: currentDate.year,
        month: currentDate.month,
        day: currentDate.day
      };
    }
    return pick;
  };

  return (
    <div className="rounded w-100" style={{ position: "relative", display: "inline-block" }}>
      <input
        type="text"
        value={`${selected.year} / ${String(selected.month).padStart(2, "0")} / ${String(selected.day).padStart(2, "0")},  ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`}
        readOnly
        onClick={() => setShowCalendar(!showCalendar)}
        style={{ cursor: "pointer" }}
        className="form-control form-control-sm zinput mx-2 py-1"
        disabled={readOnly} // Added readOnly prop
      />

      {showCalendar && (
        <div
          style={{
            position: "absolute",
            background: "white",
            border: "1px solid #ccc",
            padding: "8px",
            width: "300px",
            zIndex: 999,
          }}
          className="zpanel rounded"
        >
          {/* Year & Month Selectors */}
          <div  style={{ marginBottom: "8px" }}>
            <div className="d-flex mb-2">
              <button 
                className="btn btn-sm zbtn-outline"
                onClick={(e) => setSelected((prev) => ({ ...(fixDatePick(prev)), month: ((prev.year > 1) ? (prev.year - 1) : (new Date().getFullYear())) }))}
                disabled={!selected.year}
              >
                <i className='bx bxs-chevron-left'></i>
              </button>
              <select
                className="form-select zinput form-select-sm mx-2"
                style={{ padding: "2px" }}
                value={selected.year}
                onChange={(e) => setSelected((prev) => ({ ...(fixDatePick(prev)), year: Number(e.target.value), day: 1 }))}
              >
                {Array.from({ length: 50 }, (_, i) => ((typeof selected.year == "number" ? selected.year : currentDate.year ) - 25 + i)).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <button
                className="btn btn-sm zbtn-outline"
                onClick={(e) => setSelected((prev) => ({ ...(fixDatePick(prev)), year: ((prev.year > 1) ? (prev.year + 1) : (new Date().getFullYear())) }))}
                disabled={!selected.year}
              >
                <i className='bx bxs-chevron-right' ></i>
              </button>
            </div>
            <div className="d-flex">
              <button 
                className="btn btn-sm zbtn-outline"
                onClick={(e) => setSelected((prev) => ({ ...(fixDatePick(prev)), month: ((prev.month > 1) ? (prev.month - 1) : 1) }))}
                disabled={!selected.month || selected.month == 1}
              >
                <i className='bx bxs-chevron-left'></i>
              </button>
              <select
                value={selected.month}
                onChange={(e) => setSelected((prev) => ({ ...(fixDatePick(prev)), month: Number(e.target.value), day: 1 }))}
                className="form-select form-control zinput form-select-sm mx-2 px-2"
                style={{ padding: "2px" }}
              >
                {monthNames.map((name, idx) => (
                  <option key={idx} value={idx + 1}>{name}</option>
                ))}
              </select>
              <button
                className="btn btn-sm zbtn-outline"
                onClick={(e) => setSelected((prev) => ({ ...(fixDatePick(prev)), month: ((prev.month < 13) ? (prev.month + 1) : 1) }))}
                disabled={!selected.month || selected.month == 13}
              >
                <i className='bx bxs-chevron-right' ></i>
              </button>
            </div>
          </div>

          {/* Calendar Days */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
            {Array.from({ length: daysInMonth(selected.month, selected.year) }, (_, i) => (
              <div
                key={i}
                onClick={() => setSelected((prev) => ({ ...(fixDatePick(prev)), day: i + 1 }))}
                className={`rounded ${selected.day === i + 1 ? "zbtn" : "zbtn-outline"}`}
                style={{
                  padding: "4px",
                  textAlign: "center",
                  cursor: "pointer",
                  // background: "var(--button-bg)" selected.day === i + 1 ? "#007bff" : "transparent",
                  // color: "var(--text_color)",
                  borderRadius: "4px",
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>

          {/* Time Picker */}
          <div style={{ marginTop: "8px", display: "flex", gap: "4px" }}>
            <select
              className="zinput border rounded"
              value={hour}
              onChange={(e) => setHour(Number(e.target.value))}
              style={{ padding: "2px" }}
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{String(i).padStart(2, "0")}</option>
              ))}
            </select>
            :
            <select
              value={minute}
              onChange={(e) => setMinute(Number(e.target.value))}
              className="zinput border rounded"
              style={{ padding: "2px" }}
            >
              {Array.from({ length: 60 }, (_, i) => (
                <option key={i} value={i}>{String(i).padStart(2, "0")}</option>
              ))}
            </select>
          </div>

          {/* Apply Button */}
          <button className="btn zbtn w-100" style={{ marginTop: "8px", padding: "2px", width: "100%" }} onClick={handleApply}>
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
