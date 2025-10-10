import React, { useState } from "react";
import { register } from "../api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    address: "",
    aadharCardNumber: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await register(form);
    if (res.success) {
      alert("Registration successful!");
      window.location.href = "/login";
    } else {
      setMessage(res.error || "Registration failed");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-xl rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {message && <p className="text-red-500 text-sm mb-3">{message}</p>}
        {["name", "age", "address", "aadharCardNumber", "password"].map((f) => (
          <input
            key={f}
            name={f}
            type={f === "password" ? "password" : "text"}
            placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
            className="border p-2 mb-3 w-full rounded"
            value={form[f]}
            onChange={handleChange}
          />
        ))}
        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white w-full py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}
