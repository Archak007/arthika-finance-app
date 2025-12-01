import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import Income from "./income";
import Expense from "./expense";
import Balance from "./balance";
import Transaction from "./transaction";

function safeLoadArray(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [dark, setDark] = useState(true);
  const [page, setPage] = useState("Dashboard");

  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [bills, setBills] = useState([]);

  const [user, setUser] = useState({
    name: localStorage.getItem("userName") || "",
    email: localStorage.getItem("userEmail") || "",
    photo: localStorage.getItem("userPhoto") || "",
  });

  const [showUser, setShowUser] = useState(false);
  const userRef = useRef(null);

  const totalLimit = 10000;
  const usedBalance = 4500;

  useEffect(() => {
    setIncomes(safeLoadArray("incomes"));
    setExpenses(safeLoadArray("expenses"));
    setBills(safeLoadArray("bills"));
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUser(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalIncome = incomes.reduce(
    (sum, i) => sum + (parseFloat(i.amount) || 0),
    0
  );
  const totalExpense = expenses.reduce(
    (sum, e) => sum + (parseFloat(e.amount) || 0),
    0
  );
  const balance = totalIncome - totalExpense;

  const pieData = [
    { name: "Income", value: totalIncome },
    { name: "Expense", value: totalExpense },
  ];
  const colors = ["#34d399", "#f87171"];

  function daysLeft(dStr) {
    const today = new Date();
    const due = new Date(dStr);
    return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  const upcoming = useMemo(
    () =>
      bills
        .slice()
        .sort(
          (a, b) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        )
        .slice(0, 5),
    [bills]
  );

  const dueThisWeek = useMemo(
    () =>
      bills.reduce((sum, bill) => {
        const d = daysLeft(bill.dueDate);
        const amt = Number(bill.amount) || 0;
        return d >= 0 && d <= 7 ? sum + amt : sum;
      }, 0),
    [bills]
  );

  const dueThisMonth = useMemo(
    () =>
      bills.reduce((sum, bill) => {
        const d = daysLeft(bill.dueDate);
        const amt = Number(bill.amount) || 0;
        return d >= 0 && d <= 30 ? sum + amt : sum;
      }, 0),
    [bills]
  );

  function markPaid(id) {
    const bill = bills.find((b) => b.id === id);
    if (!bill) return;

    const updatedBills = bills.filter((b) => b.id !== id);
    setBills(updatedBills);
    localStorage.setItem("bills", JSON.stringify(updatedBills));

    const existing = safeLoadArray("expenses");
    const newExpense = {
      id: Date.now(),
      name: bill.name,
      category: bill.category || "Bills",
      amount: bill.amount,
      date: new Date().toISOString().slice(0, 10),
    };
    const updatedExpenses = [...existing, newExpense];
    setExpenses(updatedExpenses);
    localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
  }

  function saveUser() {
    localStorage.setItem("userName", user.name);
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userPhoto", user.photo);
    alert("Saved");
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) =>
      setUser((prev) => ({ ...prev, photo: ev.target?.result || "" }));
    reader.readAsDataURL(file);
  }

  return (
    <div
      className={
        dark
          ? "min-h-screen flex bg-gray-900 text-white"
          : "min-h-screen flex bg-white text-gray-900"
      }
    >
      <aside className="w-64 p-6 bg-gradient-to-b from-blue-800 to-violet-800">
        <h2 className="text-2xl font-bold mb-8">Arthika</h2>
        <nav className="space-y-3">
          {["Dashboard", "Income", "Expense", "Balance", "Transaction"].map(
            (item) => (
              <button
                key={item}
                onClick={() => setPage(item)}
                className={`w-full text-left p-2 rounded ${
                  page === item ? "bg-blue-600" : "hover:bg-blue-700/50"
                }`}
              >
                {item}
              </button>
            )
          )}
        </nav>
      </aside>

      <main className="flex-1 p-8 relative">
        <div
          className="absolute top-4 right-4 flex items-center gap-3"
          ref={userRef}
        >
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only"
              checked={dark}
              onChange={() => setDark(!dark)}
            />
            <div className="w-12 h-6 bg-gray-300 rounded-full relative">
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition ${
                  dark ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </div>
          </label>

          <img
            src={user.photo || "https://i.pravatar.cc/150?img=3"}
            alt="user"
            className="w-10 h-10 rounded-full cursor-pointer border"
            onClick={() => setShowUser(!showUser)}
          />

          {showUser && (
            <div className="absolute right-0 top-14 w-72 bg-white dark:bg-gray-800 dark:text-white text-black rounded shadow p-4 z-50">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={user.photo || "https://i.pravatar.cc/150?img=3"}
                  alt="avatar"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-semibold">
                    {user.name || "Your Name"}
                  </div>
                  <div className="text-xs opacity-70">
                    {user.email || "you@example.com"}
                  </div>
                </div>
              </div>

              <input
                className="w-full p-2 mb-2 rounded bg-gray-100 dark:bg-gray-700"
                placeholder="Name"
                value={user.name}
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <input
                className="w-full p-2 mb-2 rounded bg-gray-100 dark:bg-gray-700"
                placeholder="Email"
                value={user.email}
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, email: e.target.value }))
                }
              />
              <input
                type="file"
                className="mb-2 w-full text-sm"
                onChange={handleFile}
              />

              <div className="flex justify-between">
                <button
                  onClick={saveUser}
                  className="px-3 py-1 bg-green-600 rounded text-white"
                >
                  Save
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="px-3 py-1 bg-red-600 rounded text-white"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold mb-6">{page}</h1>

        {page === "Dashboard" && (
          <>
            <div className="grid grid-cols-3 gap-6">
              <div className="p-6 rounded bg-gradient-to-r from-blue-700 to-violet-700">
                <div className="text-sm">Balance</div>
                <div className="text-2xl font-bold">
                  ₹{balance.toLocaleString("en-IN")}
                </div>
                <div className="mt-2 text-xs opacity-80">
                  From incomes and expenses
                </div>
              </div>

              <div className="p-6 rounded bg-gradient-to-r from-blue-700 to-violet-700">
                <div className="text-sm">30-Day Limit</div>
                <div className="w-full bg-gray-800 h-3 rounded mt-2">
                  <div
                    className="h-3 rounded bg-green-400"
                    style={{
                      width: `${Math.min(
                        100,
                        ((totalLimit - usedBalance) / totalLimit) * 100
                      )}%`,
                    }}
                  />
                </div>
                <div className="mt-2 text-xs opacity-80">
                  {totalLimit - usedBalance} remaining
                </div>
              </div>

              <div className="p-6 rounded bg-gradient-to-r from-blue-700 to-violet-700">
                <div className="text-sm">Upcoming Bills</div>
                <div className="text-xs opacity-80 mt-1">
                  This week: ₹{dueThisWeek.toLocaleString("en-IN")} • This
                  month: ₹{dueThisMonth.toLocaleString("en-IN")}
                </div>

                {upcoming.length === 0 ? (
                  <div className="mt-4 text-sm">No upcoming bills.</div>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {upcoming.map((bill) => {
                      const d = daysLeft(bill.dueDate);
                      const color =
                        d <= 3 ? "bg-red-500" : d <= 7 ? "bg-yellow-500" : "bg-green-500";
                      return (
                        <li
                          key={bill.id}
                          className="flex justify-between items-center border-b border-gray-300/40 pb-2"
                        >
                          <div>
                            <div className="font-medium">{bill.name}</div>
                            <div className="text-xs opacity-80">
                              Due{" "}
                              {new Date(bill.dueDate).toLocaleDateString(
                                "en-IN"
                              )}{" "}
                              • ₹{bill.amount}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs px-2 py-1 rounded ${color}`}
                            >
                              {d < 0
                                ? "Overdue"
                                : d === 0
                                ? "Today"
                                : `${d}d`}
                            </span>
                            <button
                              onClick={() => markPaid(bill.id)}
                              className="px-2 py-1 bg-gray-900 text-white rounded text-xs"
                            >
                              Paid
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}

                <div className="mt-3 text-xs opacity-80">
                  Manage all bills in the Transaction tab.
                </div>
              </div>
            </div>

            <div className="mt-8 bg-gray-800 p-6 rounded">
              <div className="text-lg mb-3">Income vs Expense</div>
              {pieData.some((p) => p.value > 0) ? (
                <div style={{ height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={index} fill={colors[index]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => `₹ ${v}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="italic text-sm">
                  Add income or expense to view chart.
                </div>
              )}
            </div>
          </>
        )}

        {page === "Income" && <Income />}
        {page === "Expense" && <Expense />}
        {page === "Balance" && <Balance dark={dark} />}
        {page === "Transaction" && (
          <Transaction bills={bills} setBills={setBills} dark={dark} />
        )}
      </main>
    </div>
  );
}