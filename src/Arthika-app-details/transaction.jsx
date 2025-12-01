import React, { useState } from "react";

export default function Transaction({ bills, setBills, dark }) {
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

  function addBill(e) {
    e.preventDefault();
    const amountNum = parseFloat(form.amount);

    if (!form.name || !form.dueDate || !amountNum || amountNum <= 0) {
      alert("Please enter name, positive amount and due date.");
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
  }

  function updateField(id, field, value) {
    const updated = bills.map((bill) =>
      bill.id === id
        ? {
            ...bill,
            [field]: field === "amount" ? Number(value) || 0 : value,
          }
        : bill
    );
    setBills(updated);
    localStorage.setItem("bills", JSON.stringify(updated));
  }

  function removeBill(id) {
    const updated = bills.filter((bill) => bill.id !== id);
    setBills(updated);
    localStorage.setItem("bills", JSON.stringify(updated));
  }

  return (
    <div
      className={
        dark
          ? "p-6 bg-gray-900 text-white rounded-2xl shadow-lg"
          : "p-6 bg-white text-gray-900 rounded-2xl shadow-lg"
      }
    >
      <h2 className="text-2xl font-bold mb-4">Manage Bills</h2>

      <form
        onSubmit={addBill}
        className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6"
      >
        <input
          type="text"
          placeholder="Bill name (e.g. Rent)"
          className="p-2 rounded bg-gray-800 border border-gray-700 w-full text-white"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Amount (₹)"
          className="p-2 rounded bg-gray-800 border border-gray-700 w-full text-white"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        <input
          type="date"
          className="p-2 rounded bg-gray-800 border border-gray-700 w-full text-white"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        />
        <div className="flex gap-2">
          <select
            className="flex-1 p-2 rounded bg-gray-800 border border-gray-700 text-white"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 rounded bg-green-600 text-white hover:bg-green-700"
          >
            + Add
          </button>
        </div>
      </form>

      {bills.length === 0 ? (
        <div className="text-sm opacity-80">No bills yet. Add one above.</div>
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="p-2">Name</th>
                <th className="p-2">Category</th>
                <th className="p-2">Amount (₹)</th>
                <th className="p-2">Due Date</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {bills
                .slice()
                .sort(
                  (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
                )
                .map((bill) => (
                  <tr
                    key={bill.id}
                    className="border-b border-gray-800 hover:bg-gray-800/50"
                  >
                    <td className="p-2">
                      <input
                        className="bg-transparent w-full"
                        value={bill.name}
                        onChange={(e) =>
                          updateField(bill.id, "name", e.target.value)
                        }
                      />
                    </td>
                    <td className="p-2">
                      <select
                        className="bg-transparent"
                        value={bill.category}
                        onChange={(e) =>
                          updateField(bill.id, "category", e.target.value)
                        }
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        className="bg-transparent w-full"
                        value={bill.amount}
                        onChange={(e) =>
                          updateField(bill.id, "amount", e.target.value)
                        }
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="date"
                        className="bg-transparent"
                        value={bill.dueDate || ""}
                        onChange={(e) =>
                          updateField(bill.id, "dueDate", e.target.value)
                        }
                      />
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => removeBill(bill.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded"
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
