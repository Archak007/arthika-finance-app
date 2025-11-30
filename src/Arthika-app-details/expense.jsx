import React, { useState, useEffect } from "react";

export default function Expense() {
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("expenses")) || [];
    setExpenses(saved);
  }, []);

  function addExpense() {
    if (!category || !amount || !date) {
      alert("Please fill all fields");
      return;
    }

    const newItem = {
      id: Date.now(),
      category,
      amount: parseFloat(amount),
      date,
    };

    const updated = [...expenses, newItem];
    setExpenses(updated);
    localStorage.setItem("expenses", JSON.stringify(updated));

    setCategory("");
    setAmount("");
    setDate("");
  }

  function deleteExpense(id) {
    const updated = expenses.filter((item) => item.id !== id);
    setExpenses(updated);
    localStorage.setItem("expenses", JSON.stringify(updated));
  }

  return (
    <div className="p-6 bg-gray-900 text-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Add Expense</h2>

      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          type="text"
          className="p-2 rounded bg-gray-800 border border-gray-700 w-full"
          placeholder="Category (e.g. Rent, Food)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          type="number"
          className="p-2 rounded bg-gray-800 border border-gray-700 w-full"
          placeholder="Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          type="date"
          className="p-2 rounded bg-gray-800 border border-gray-700 w-full"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button
          onClick={addExpense}
          className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition text-white"
        >
          Add Expense
        </button>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="p-2">Category</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Date</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {expenses.map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-800 hover:bg-gray-800/50"
            >
              <td className="p-2">{item.category}</td>
              <td className="p-2">₹{item.amount.toLocaleString("en-IN")}</td>
              <td className="p-2">{item.date}</td>
              <td className="p-2">
                <button
                  onClick={() => deleteExpense(item.id)}
                  className="text-red-400 hover:text-red-600"
                >
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
