import React, { useState } from "react";
import { registerHospital } from "@/api/api";

export default function RegisterHospital() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerHospital(form);
      alert("Hospital registration submitted for admin approval");
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="form-page">
      <h2>Register as Hospital</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Hospital Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          required
        />

        <button type="submit">Submit for Approval</button>
      </form>
    </div>
  );
}
