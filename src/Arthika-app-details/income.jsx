import React, { useState, useEffect } from "react";

export default function Income() {
  const [incomes, setIncomes] = useState([]);
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("incomes")) || [];
    setIncomes(saved);
  }, []);

  function addIncome() {
    if (!source || !amount || !date) {
      alert("Please fill all fields");
      return;
    }

    const newItem = {
      id: Date.now(),
      source,
      amount: parseFloat(amount),
      date,
    };

    const updated = [...incomes, newItem];
    setIncomes(updated);
    localStorage.setItem("incomes", JSON.stringify(updated));

    setSource("");
    setAmount("");
    setDate("");
  }

  function deleteIncome(id) {
    const updated = incomes.filter((item) => item.id !== id);
    setIncomes(updated);
    localStorage.setItem("incomes", JSON.stringify(updated));
  }

  return (
    <div className="p-6 bg-gray-900 text-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Add Income</h2>

      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          type="text"
          className="p-2 rounded bg-gray-800 border border-gray-700 w-full"
          placeholder="Source (e.g. Salary)"
          value={source}
          onChange={(e) => setSource(e.target.value)}
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
          onClick={addIncome}
          className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
        >
          Add Income
        </button>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="p-2">Source</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Date</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {incomes.map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-800 hover:bg-gray-800/50"
            >
              <td className="p-2">{item.source}</td>
              <td className="p-2">₹{item.amount.toLocaleString("en-IN")}</td>
              <td className="p-2">{item.date}</td>
              <td className="p-2">
                <button
                  onClick={() => deleteIncome(item.id)}
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
