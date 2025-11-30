import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Income from "./income";
import Expense from "./expense";
import Balance from "./balance";

function ManageBills({ bills, setBills, darkMode }) {
  const [form, setForm] = useState({
    name: "",
    amount: "",
    dueDate: "",
    category: "Other",
  });

  const categories = [
    "Mobile Recharge",
    "Credit Card",
    "Electricity",
    "Rent",
    "Internet",
    "Water",
    "Other",
  ];

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddBill = (e) => {
    e.preventDefault();
    if (!form.name || !form.amount || !form.dueDate) {
      alert("Please fill name, amount and due date.");
      return;
    }

    const amountNum = parseFloat(form.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert("Amount must be a positive number.");
      return;
    }

    const newBill = {
      id: Date.now(),
      name: form.name,
      amount: amountNum,
      dueDate: form.dueDate,
      category: form.category,
    };

    const updated = [...bills, newBill];
    setBills(updated);
    localStorage.setItem("bills", JSON.stringify(updated));

    setForm({
      name: "",
      amount: "",
      dueDate: "",
      category: "Other",
    });
  };

  const handleBillFieldChange = (id, field, value) => {
    const updated = bills.map((b) =>
      b.id === id
        ? { ...b, [field]: field === "amount" ? Number(value) || 0 : value }
        : b
    );
    setBills(updated);
    localStorage.setItem("bills", JSON.stringify(updated));
  };

  const handleDeleteBill = (id) => {
    const updated = bills.filter((b) => b.id !== id);
    setBills(updated);
    localStorage.setItem("bills", JSON.stringify(updated));
  };

  return (
    <div
      className={`p-6 rounded-lg shadow-lg ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-blue-900 to-violet-900 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <h2 className="text-2xl font-bold mb-4">Manage Bills</h2>

      <form
        onSubmit={handleAddBill}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      >
        <input
          type="text"
          placeholder="Bill Name (e.g. Rent)"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => handleChange("amount", e.target.value)}
          className="p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="date"
          value={form.dueDate}
          onChange={(e) => handleChange("dueDate", e.target.value)}
          className="p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex gap-2">
          <select
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-400"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white whitespace-nowrap"
          >
            + Add
          </button>
        </div>
      </form>

      {bills.length === 0 ? (
        <p className="text-sm opacity-80">
          No bills added yet. Start by adding a bill above.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-500/40">
                <th className="text-left py-2 pr-2">Name</th>
                <th className="text-left py-2 pr-2">Category</th>
                <th className="text-left py-2 pr-2">Amount (₹)</th>
                <th className="text-left py-2 pr-2">Due Date</th>
                <th className="text-left py-2 pr-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {bills
                .slice()
                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                .map((bill) => (
                  <tr key={bill.id} className="border-b border-gray-600/30">
                    <td className="py-2 pr-2">
                      <input
                        type="text"
                        value={bill.name}
                        onChange={(e) =>
                          handleBillFieldChange(bill.id, "name", e.target.value)
                        }
                        className="w-full bg-transparent border-b border-gray-500 focus:outline-none focus:border-blue-400"
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <select
                        value={bill.category || "Other"}
                        onChange={(e) =>
                          handleBillFieldChange(
                            bill.id,
                            "category",
                            e.target.value
                          )
                        }
                        className="w-full bg-transparent border-b border-gray-500 focus:outline-none focus:border-blue-400"
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        type="number"
                        value={bill.amount}
                        onChange={(e) =>
                          handleBillFieldChange(
                            bill.id,
                            "amount",
                            e.target.value
                          )
                        }
                        className="w-full bg-transparent border-b border-gray-500 focus:outline-none focus:border-blue-400"
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        type="date"
                        value={bill.dueDate || ""}
                        onChange={(e) =>
                          handleBillFieldChange(
                            bill.id,
                            "dueDate",
                            e.target.value
                          )
                        }
                        className="bg-transparent border-b border-gray-500 focus:outline-none focus:border-blue-400"
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <button
                        onClick={() => handleDeleteBill(bill.id)}
                        className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [activePage, setActivePage] = useState("Dashboard");

  const totalLimit = 10000;
  const usedBalance = 4500;

  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);

  useEffect(() => {
    const storedIncome = localStorage.getItem("incomes");
    if (storedIncome) setIncomeData(JSON.parse(storedIncome));

    const storedExpense = localStorage.getItem("expenses");
    if (storedExpense) setExpenseData(JSON.parse(storedExpense));
  }, []);

  const totalIncome = incomeData.reduce(
    (sum, i) => sum + (parseFloat(i.amount) || 0),
    0
  );
  const totalExpense = expenseData.reduce(
    (sum, e) => sum + (parseFloat(e.amount) || 0),
    0
  );

  const pieData = [
    { name: "Income", value: totalIncome },
    { name: "Expense", value: totalExpense },
  ];
  const COLORS = ["#34d399", "#f87171"];

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [user, setUser] = useState({
    name: localStorage.getItem("userName") || "",
    email: localStorage.getItem("userEmail") || "",
    password: localStorage.getItem("userPassword") || "",
    photo: localStorage.getItem("userPhoto") || "",
  });
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [bills, setBills] = useState([]);

  useEffect(() => {
    const storedBills = localStorage.getItem("bills");
    if (storedBills) {
      try {
        setBills(JSON.parse(storedBills));
      } catch (e) {
        console.error("Failed to parse bills from localStorage", e);
      }
    }
  }, []);

  const getDaysLeft = (dueDateStr) => {
    const today = new Date();
    const due = new Date(dueDateStr);
    const diffMs = due - today;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  };

  const upcomingBills = useMemo(
    () =>
      [...bills]
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5),
    [bills]
  );

  const totalDueWeek = useMemo(
    () =>
      bills.reduce((sum, b) => {
        const d = getDaysLeft(b.dueDate);
        const amt = parseFloat(b.amount) || 0;
        return d >= 0 && d <= 7 ? sum + amt : sum;
      }, 0),
    [bills]
  );

  const totalDueMonth = useMemo(
    () =>
      bills.reduce((sum, b) => {
        const d = getDaysLeft(b.dueDate);
        const amt = parseFloat(b.amount) || 0;
        return d >= 0 && d <= 30 ? sum + amt : sum;
      }, 0),
    [bills]
  );

  const handlePaid = (id) => {
    const bill = bills.find((b) => b.id === id);
    if (!bill) return;

    const updatedBills = bills.filter((b) => b.id !== id);
    setBills(updatedBills);
    localStorage.setItem("bills", JSON.stringify(updatedBills));

    let existingExpenses = [];
    const storedExpense = localStorage.getItem("expenses");
    if (storedExpense) {
      try {
        existingExpenses = JSON.parse(storedExpense);
      } catch (e) {
        console.error("Failed to parse expenses", e);
      }
    }

    const newExpense = {
      id: Date.now(),
      name: bill.name,
      category: bill.category || "Bills",
      amount: bill.amount,
      date: new Date().toISOString().slice(0, 10),
    };

    const updatedExpenses = [...existingExpenses, newExpense];
    localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
    setExpenseData(updatedExpenses);
  };

  const handleLogout = () => navigate("/login");

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } min-h-screen flex relative`}
    >
      <div className="w-64 bg-gradient-to-b from-blue-800 to-violet-800 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-8">Arthika</h2>
          <nav className="space-y-4">
            {["Dashboard", "Income", "Expense", "Balance", "Transaction"].map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setActivePage(page)}
                  className={`w-full text-left p-2 rounded ${
                    activePage === page
                      ? "bg-blue-600 text-white"
                      : "hover:bg-blue-700/50"
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </nav>
        </div>
      </div>

      <div
        className="absolute top-4 right-4 flex items-center gap-4"
        ref={dropdownRef}
      >
        <div className="relative">
          <img
            src={user.photo || "https://i.pravatar.cc/150?img=3"}
            alt="User"
            className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300 shadow-sm"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
          />

          {showUserDropdown && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl shadow-lg p-4 space-y-4 transition-all duration-200 z-50">
              <div className="flex items-center gap-3">
                <img
                  src={user.photo || "https://i.pravatar.cc/150?img=3"}
                  alt="User"
                  className="w-12 h-12 rounded-full border-2 border-gray-300 shadow"
                />
                <div>
                  <p className="font-semibold">{user.name || "Your Name"}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email || "you@example.com"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Dark Mode</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                    className="sr-only"
                  />
                  <div className="w-12 h-6 bg-gray-300 rounded-full peer dark:bg-gray-600 transition-colors"></div>
                  <div
                    className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow transform transition-transform ${
                      darkMode ? "translate-x-6" : "translate-x-0"
                    }`}
                  >
                    {darkMode ? (
                      <span className="text-yellow-400 text-sm absolute top-0.5 left-1">
                        🌙
                      </span>
                    ) : (
                      <span className="text-yellow-500 text-sm absolute top-0.5 left-0.5">
                        ☀️
                      </span>
                    )}
                  </div>
                </label>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) =>
                        setUser({ ...user, photo: event.target.result });
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full text-sm"
                />
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => {
                    localStorage.setItem("userName", user.name);
                    localStorage.setItem("userEmail", user.email);
                    localStorage.setItem("userPassword", user.password);
                    localStorage.setItem("userPhoto", user.photo);
                    alert("✅ User info updated!");
                  }}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white transition"
                >
                  Save
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white transition"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 p-8 space-y-6 overflow-y-auto">
        <h1 className="text-3xl font-bold">{activePage}</h1>

        {activePage === "Dashboard" && (
          <>
            <div className="grid grid-cols-3 gap-6">
              <div className="p-6 rounded-lg shadow-lg bg-gradient-to-r from-blue-700 to-violet-700">
                <h2 className="text-xl font-semibold mb-2">Balance</h2>
                <p className="text-2xl font-bold">
                  ₹{(totalIncome - totalExpense).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="p-6 rounded-lg shadow-lg bg-gradient-to-r from-blue-700 to-violet-700">
                <h2 className="text-xl font-semibold mb-2">30-Day Limit</h2>
                <div className="w-full bg-gray-800 h-4 rounded-full">
                  <div
                    className="bg-green-400 h-4 rounded-full"
                    style={{
                      width: `${((totalLimit - usedBalance) / totalLimit) * 100}%`,
                    }}
                  ></div>
                </div>
                <p className="mt-2 text-sm">
                  {totalLimit - usedBalance} remaining
                </p>
              </div>

              <div className="p-6 rounded-lg shadow-lg bg-gradient-to-r from-blue-700 to-violet-700">
                <h2 className="text-xl font-semibold mb-2">Upcoming Bills</h2>

                <p className="text-xs mb-2 opacity-90">
                  This week:{" "}
                  <span className="font-semibold">
                    ₹{totalDueWeek.toLocaleString("en-IN")}
                  </span>{" "}
                  • This month:{" "}
                  <span className="font-semibold">
                    ₹{totalDueMonth.toLocaleString("en-IN")}
                  </span>
                </p>

                {upcomingBills.length === 0 ? (
                  <p className="text-sm text-gray-100">
                    No upcoming bills. 🎉
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {upcomingBills.map((bill) => {
                      const daysLeft = getDaysLeft(bill.dueDate);
                      let badgeColor = "bg-green-500";
                      if (daysLeft <= 3) badgeColor = "bg-red-500";
                      else if (daysLeft <= 7) badgeColor = "bg-yellow-500";

                      return (
                        <li
                          key={bill.id}
                          className="flex items-center justify-between border-b border-gray-400/30 pb-1"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{bill.name}</span>
                            <span className="text-xs text-gray-100">
                              Due:{" "}
                              {new Date(bill.dueDate).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                }
                              )}{" "}
                              • ₹{bill.amount}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${badgeColor}`}
                            >
                              {daysLeft < 0
                                ? "Overdue"
                                : daysLeft === 0
                                ? "Today"
                                : `${daysLeft}d left`}
                            </span>
                            <button
                              onClick={() => handlePaid(bill.id)}
                              className="text-xs bg-gray-900/60 px-2 py-1 rounded hover:bg-gray-900"
                            >
                              Paid
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}

                <p className="mt-4 text-xs text-gray-100 opacity-80">
                  Manage all bills in the <strong>Transaction</strong> tab.
                </p>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-8">
              <h2 className="text-xl font-semibold mb-4">Income vs Expense</h2>
              {pieData.some((d) => d.value > 0) ? (
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) =>
                          `₹ ${value.toLocaleString("en-IN")}`
                        }
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-gray-400 italic">
                  Add some income or expense to see chart 📊
                </p>
              )}
            </div>
          </>
        )}

        {activePage === "Income" && <Income />}
        {activePage === "Expense" && <Expense />}
        {activePage === "Balance" && <Balance />}
        {activePage === "Transaction" && (
          <ManageBills bills={bills} setBills={setBills} darkMode={darkMode} />
        )}
      </div>
    </div>
  );
}