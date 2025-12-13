"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

const PLAN_PRICING: Record<string, number> = {
  qT9mF3xL7vB2nP8kS1hD6wR0gC4tY9jM5uA2eZ7rV1cN8pH3lK6fW0dQ4sX9bT5yG2aU7mJ1Z8rK1pV6xT3gM9hS4lC2nW7fB0uJ5yD8qA1cL6tR3mH9vP4kF2wN7jE0sQ5gY8bU1xT6mC3: 49,
  mP4tS9vB2qH7cL1xN6fD0wY5kR8pA3gT9uJ2eV6rC1hM7nF0dX4sW8jQ3yK5aG2bU9tL6paW7fC3gN9tM6yV1sK4pQ8lB2jT5hR0xD7uE3nF9vJ6cL1kS8mA4wP2rG5dH0qX9bU7tY3: 99,
  xC1tL6pN8rJ3yH9bS5kW2uA7fQ4gM0nV6dR1cT8mP3jE9hF5lK2wB7sD4aY0qG8vX1nB5yF2uG8hK1vQ7pD3mT9aL4sP0cW6xE2rJ8tM1kS7gH3lC9wN5qA0jV4dU6bY8: 129,
  R3vH9tP4mS1xL8uJ2cK6qG0yD5bN7gF3pT9lM1hC8wA2rV6eQ4nW0jU5sY7kX9kM2jS7aT4yC9nV5gP1bU8wR3xD6fH0pQ7lE2tJ9cN4mA8hG5rW1dY3sK6vX0: 59,
  tF6wE1pH8lM3qG9uJ5rA2vK7cD0yS4bN8mR1xL6gP3nC9jT5hW2sQ7kU4V9kP4cM7xR2dT8bS1yG6nL0hF5uQ3mJ9rC4tW8pA1eH6sD2jN7gY5
: 69
};

const planMap = {
  qT9mF3xL7vB2nP8kS1hD6wR0gC4tY9jM5uA2eZ7rV1cN8pH3lK6fW0dQ4sX9bT5yG2aU7mJ1Z8rK1pV6xT3gM9hS4lC2nW7fB0uJ5yD8qA1cL6tR3mH9vP4kF2wN7jE0sQ5gY8bU1xT6mC3: "Basic",
  mP4tS9vB2qH7cL1xN6fD0wY5kR8pA3gT9uJ2eV6rC1hM7nF0dX4sW8jQ3yK5aG2bU9tL6paW7fC3gN9tM6yV1sK4pQ8lB2jT5hR0xD7uE3nF9vJ6cL1kS8mA4wP2rG5dH0qX9bU7tY3: "Advanced",
  xC1tL6pN8rJ3yH9bS5kW2uA7fQ4gM0nV6dR1cT8mP3jE9hF5lK2wB7sD4aY0qG8vX1nB5yF2uG8hK1vQ7pD3mT9aL4sP0cW6xE2rJ8tM1kS7gH3lC9wN5qA0jV4dU6bY8: "Premium",
  R3vH9tP4mS1xL8uJ2cK6qG0yD5bN7gF3pT9lM1hC8wA2rV6eQ4nW0jU5sY7kX9kM2jS7aT4yC9nV5gP1bU8wR3xD6fH0pQ7lE2tJ9cN4mA8hG5rW1dY3sK6vX0: "Basic To Advanced",
  tF6wE1pH8lM3qG9uJ5rA2vK7cD0yS4bN8mR1xL6gP3nC9jT5hW2sQ7kU4V9kP4cM7xR2dT8bS1yG6nL0hF5uQ3mJ9rC4tW8pA1eH6sD2jN7gY5
: "Basic To Premium"
} as any

export default function CheckoutPageContent() {
  const params = useSearchParams();
  let plan = params.get("plan") || "";

  // Securely validate plan
  const baseAmount = PLAN_PRICING[plan] ?? null;

  if (!baseAmount) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-lg w-full">
        
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-red-100 text-red-600 flex items-center justify-center rounded-full">
            ⚠️
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Invalid Checkout Link
        </h2>

        <p className="text-gray-600 mb-6 text-lg">
          We couldn’t verify your plan details.  
          This link may have expired or been modified.
        </p>

        <button
          onClick={() => window.location.href = "/editor"}
          className="w-full py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-black transition"
        >
          Return to Resume Builder
        </button>
      </div>
    </div>
  );
}


  // TAX
  const taxRate = 0.05;
  const tax = Math.round(baseAmount * taxRate);
  const total = baseAmount + tax;

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = { name: "", email: "", phone: "" };
    let valid = true;

    if (!form.name.trim()) {
      newErrors.name = "Name is required.";
      valid = false;
    }
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
      valid = false;
    }
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };
  if(plan === "R3vH9tP4mS1xL8uJ2cK6qG0yD5bN7gF3pT9lM1hC8wA2rV6eQ4nW0jU5sY7kX9kM2jS7aT4yC9nV5gP1bU8wR3xD6fH0pQ7lE2tJ9cN4mA8hG5rW1dY3sK6vX0") plan = "mP4tS9vB2qH7cL1xN6fD0wY5kR8pA3gT9uJ2eV6rC1hM7nF0dX4sW8jQ3yK5aG2bU9tL6paW7fC3gN9tM6yV1sK4pQ8lB2jT5hR0xD7uE3nF9vJ6cL1kS8mA4wP2rG5dH0qX9bU7tY3";
  if(plan === "tF6wE1pH8lM3qG9uJ5rA2vK7cD0yS4bN8mR1xL6gP3nC9jT5hW2sQ7kU4V9kP4cM7xR2dT8bS1yG6nL0hF5uQ3mJ9rC4tW8pA1eH6sD2jN7gY5") plan = "xC1tL6pN8rJ3yH9bS5kW2uA7fQ4gM0nV6dR1cT8mP3jE9hF5lK2wB7sD4aY0qG8vX1nB5yF2uG8hK1vQ7pD3mT9aL4sP0cW6xE2rJ8tM1kS7gH3lC9wN5qA0jV4dU6bY8";

  const startPayment = async () => {
    if (!validateForm()) return;

    setLoading(true);

    // Create secure order
    const orderRes = await fetch("/api/order", {
      method: "POST",
      body: JSON.stringify({ amount: total }),
    });

    const order = await orderRes.json();
    setLoading(false);

    if (!order?.id) {
      alert("Failed to create payment order");
      return;
    }
    
    const options = {
      key: process.env.NEXT_PUBLIC_RZP_ID,
      amount: order.amount,
      currency: "INR",
      name: "Resume Builder",
      description: `${planMap[plan]} Plan Purchase (incl. tax)`,
      order_id: order.id,

      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      handler: () => {
        localStorage.setItem("resume_unlocked", plan);
        window.location.href = `/success?plan=${plan}`;
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-4">

        <h1 className="text-3xl font-bold mb-2 text-gray-900 text-center">
          Checkout
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Complete your purchase to unlock your resume.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* FORM */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Your Details</h2>

            <div>
              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.name ? "border-red-500 bg-red-50" : ""
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            <div>
              <input
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.email ? "border-red-500 bg-red-50" : ""
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.phone ? "border-red-500 bg-red-50" : ""
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* SUMMARY */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-inner space-y-4">
            <h2 className="text-xl font-semibold">Order Summary</h2>

            <div className="flex justify-between text-gray-700">
              <span>Plan</span>
              <span className="capitalize">{planMap[plan]}</span>
            </div>

            <div className="flex justify-between text-gray-700">
              <span>Base Price</span>
              <span>₹{baseAmount}</span>
            </div>

            <div className="flex justify-between text-gray-700">
              <span>Tax (5%)</span>
              <span>₹{tax}</span>
            </div>

            <div className="border-t pt-3 flex justify-between font-bold text-gray-900 text-lg">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              onClick={startPayment}
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              {loading ? "Processing..." : `Pay ₹${total}`}
            </button>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Payments are securely processed via Razorpay.
        </p>
      </div>
    </div>
  );
}
