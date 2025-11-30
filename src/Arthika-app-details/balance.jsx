import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#34D399",
  "#60A5FA",
  "#FBBF24",
  "#F472B6",
  "#A78BFA",
  "#F87171",
  "#2DD4BF",
];

export default function Balance() {
  const [savings, setSavings] = useState({
    Health: 3000,
    Study: 2000,
    Food: 1500,
    Travel: 2500,
    Others: 1000,
  });

  useEffect(() => {
    const saved = localStorage.getItem("userSavings");
    if (saved) setSavings(JSON.parse(saved));
  }, []);

  const savingsData = Object.entries(savings).map(([key, value]) => ({
    name: key,
    value,
  }));

  const [mfSuggestions, setMfSuggestions] = useState([]);
  const [fdSuggestions, setFdSuggestions] = useState([]);
  const [aiMessage, setAiMessage] = useState("");

  useEffect(() => {
    async function fetchInvestments() {
      try {
        const res = await fetch("https://api.mfapi.in/mf");
        const data = await res.json();
        const selectedFunds = data.slice(0, 3).map((fund) => ({
          name: fund.scheme_name,
          note: "Good for medium-term returns",
        }));
        setMfSuggestions(selectedFunds);

        const fds = [
          { bank: "HDFC Bank", rate: 6.6, tenure: "1 year" },
          { bank: "SBI", rate: 6.9, tenure: "2 years" },
          { bank: "ICICI", rate: 7.1, tenure: "3 years" },
        ];
        setFdSuggestions(fds);
      } catch (err) {
        console.error(err);
      }
    }
    fetchInvestments();
  }, []);

  useEffect(() => {
    const total = Object.values(savings).reduce((a, b) => a + b, 0);
    if (total > 10000) {
      setAiMessage(
        "🌟 Great job! You’re saving over ₹10,000 this month. Consider investing in mutual funds for long-term growth."
      );
    } else if (savings.Travel > savings.Health) {
      setAiMessage(
        "✈️ You’re spending more on Travel than Health. Maybe balance your priorities a bit!"
      );
    } else {
      setAiMessage(
        "💰 Keep building your savings! Even small consistent investments in RD/FD can grow steadily."
      );
    }
  }, [savings]);

  const handleChange = (category, value) => {
    const updated = { ...savings, [category]: parseInt(value) || 0 };
    setSavings(updated);
    localStorage.setItem("userSavings", JSON.stringify(updated));
  };

  const handleAddCategory = (category, amount) => {
    if (!category || !amount)
      return alert("Please enter both category name and amount!");
    const updated = { ...savings, [category]: parseInt(amount) };
    setSavings(updated);
    localStorage.setItem("userSavings", JSON.stringify(updated));
  };

  const handleDeleteCategory = (category) => {
    if (
      window.confirm(`Are you sure you want to delete "${category}" savings?`)
    ) {
      const updated = { ...savings };
      delete updated[category];
      setSavings(updated);
      localStorage.setItem("userSavings", JSON.stringify(updated));
    }
  };

  const [newCategory, setNewCategory] = useState("");
  const [newAmount, setNewAmount] = useState("");

  return (
    <div className="p-6 space-y-8">
      {}
      <div className="bg-gray-800 text-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Monthly Savings Breakdown
        </h2>
        <div className="h-80">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={savingsData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {savingsData.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `₹${v.toLocaleString("en-IN")}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {}
      <div className="bg-gray-900 text-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Edit Monthly Savings</h2>

        {}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(savings).map(([category, value]) => (
            <div
              key={category}
              className="relative group bg-gray-800 p-3 rounded-xl hover:bg-gray-700 transition-all duration-200"
            >
              <label className="text-sm mb-1 block">{category}</label>
              <input
                type="number"
                value={value}
                onChange={(e) => handleChange(category, e.target.value)}
                className="p-2 rounded w-full bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500"
              />
              {}
              <button
                onClick={() => handleDeleteCategory(category)}
                className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                ❌
              </button>
            </div>
          ))}
        </div>

        {}
        <div className="mt-6 p-4 bg-gray-800 rounded-xl shadow-inner">
          <h3 className="text-lg font-semibold mb-2">Add New Category</h3>
          <div className="flex flex-col md:flex-row items-center gap-3">
            <input
              type="text"
              placeholder="Category name (e.g. Entertainment)"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="p-2 w-full rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Amount (₹)"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              className="p-2 w-full md:w-40 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => {
                handleAddCategory(newCategory, newAmount);
                setNewCategory("");
                setNewAmount("");
              }}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white transition"
            >
              Add
            </button>
          </div>
        </div>

        <p className="mt-4 text-green-400">{aiMessage}</p>
      </div>

      {}
      <div className="bg-gray-800 text-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          AI Investment Recommendations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {}
          <div className="bg-gray-700 rounded-xl p-4 shadow">
            <h3 className="text-xl font-semibold text-green-400 mb-3">
              💹 Mutual Funds
            </h3>
            {mfSuggestions.length > 0 ? (
              <ul className="space-y-3">
                {mfSuggestions.map((mf, i) => (
                  <li key={i} className="bg-gray-600 p-3 rounded">
                    <p className="font-medium">{mf.name}</p>
                    <p className="text-sm text-gray-300">{mf.note}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Loading suggestions...</p>
            )}
          </div>

          {}
          <div className="bg-gray-700 rounded-xl p-4 shadow">
            <h3 className="text-xl font-semibold text-yellow-400 mb-3">
              🏦 Fixed / Recurring Deposits
            </h3>
            {fdSuggestions.map((fd, i) => (
              <div
                key={i}
                className="bg-gray-600 p-3 mb-3 rounded hover:bg-gray-500 transition-all"
              >
                <p className="font-medium">{fd.bank}</p>
                <p className="text-sm">
                  {fd.tenure} —{" "}
                  <span className="text-green-300">{fd.rate}%</span> p.a.
                </p>
                <p className="text-xs text-gray-400">
                  Ideal for secure, fixed-income planning
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
