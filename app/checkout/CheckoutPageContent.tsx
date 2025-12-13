"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { sendSuccessEmail } from "@/app/actions/sendSuccessEmail";

const PLAN_PRICING: Record<string, number> = {
  "basic": 249,
  "pro": 499,
  "lifetime": 699
}

function setCookie(name: string, value: string) {
  let expires = ""

  // basic & pro → 30 days
  if (value === "basic" || value === "pro") {
    const date = new Date()
    date.setDate(date.getDate() + 30)
    expires = `; expires=${date.toUTCString()}`
  }

  // premium → no expiry (session-like, effectively forever)
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Lax`
}


export default function CheckoutPageContent() {
  const params = useSearchParams()
  let plan = params.get("plan") || ""

  // Securely validate plan
  const baseAmount = PLAN_PRICING[plan] ?? null

  const [form, setForm] = useState({ name: "", email: "", phone: "" })
  const [errors, setErrors] = useState({ name: "", email: "", phone: "" })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validateForm = () => {
    const newErrors = { name: "", email: "", phone: "" }
    let valid = true

    if (!form.name.trim()) {
      newErrors.name = "Name is required."
      valid = false
    }
    if (!form.email.trim()) {
      newErrors.email = "Email is required."
      valid = false
    }
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required."
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const startPayment = async () => {
    if (!validateForm()) return

    setLoading(true)

    // Create secure order
    const orderRes = await fetch("/api/order", {
      method: "POST",
      body: JSON.stringify({ amount: total }),
    })

    const order = await orderRes.json()
    setLoading(false)

    if (!order?.id) {
      alert("Failed to create payment order")
      window.location.href = "../"
      return
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RZP_ID,
      amount: order.amount,
      currency: "INR",
      name: "BuildIT Website Builder",
      description: `${plan} Plan Purchase (incl. tax)`,
      order_id: order.id,

      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      handler: async () => {
        setCookie("BuildIT_unlocked", plan)
        try {
          await sendSuccessEmail(form.email, form.name, plan)
        } catch (e) {
          console.error("Email failed:", e)
        }

        window.location.href = `/success?plan=${plan}`
      }

    }

    const razorpay = new (window as any).Razorpay(options)
    razorpay.open()
  }

  if (!baseAmount) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-gray-50">
        <div className="bg-white shadow-lg rounded-2xl p-10 max-w-lg w-full">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-red-100 text-red-600 flex items-center justify-center rounded-full">⚠️</div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Checkout Link</h2>

          <p className="text-gray-600 mb-6 text-lg">
            We couldn't verify your plan details. This link may have expired or been modified.
          </p>

          <button
            onClick={() => (window.location.href = "/editor")}
            className="w-full py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-black transition"
          >
            Return to Resume Builder
          </button>
        </div>
      </div>
    )
  }

  // TAX
  const taxRate = 0.08
  const tax = baseAmount * taxRate;
  const total = baseAmount + tax

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-8 pb-6 text-center border-b border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900">Secure Checkout</h1>
          <p className="text-gray-600 mt-1">
            Complete your purchase to unlock premium features.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
          {/* FORM */}
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Your Details
            </h2>

            {[
              { name: "name", placeholder: "Full Name", error: errors.name },
              { name: "email", placeholder: "Email Address", error: errors.email },
              { name: "phone", placeholder: "Phone Number", error: errors.phone },
            ].map((field) => (
              <div key={field.name}>
                <input
                  name={field.name}
                  placeholder={field.placeholder}
                  value={form[field.name]}
                  onChange={handleChange}
                  className={`
      w-full px-4 py-3 rounded-lg border text-sm outline-none transition
      bg-white
      text-gray-900
      placeholder:text-gray-400
      ${field.error
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    }
    `}
                />
                {field.error && (
                  <p className="text-red-500 text-xs mt-1">
                    {field.error}
                  </p>
                )}
              </div>

            ))}
          </div>

          {/* SUMMARY */}
          <div className="relative rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-6 border border-gray-200 space-y-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-700">
                <span>Plan</span>
                <span className="font-medium capitalize">
                  {plan}
                </span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span>Base Price</span>
                <span>₹{baseAmount}</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span>Tax (8%)</span>
                <span>₹{tax}</span>
              </div>
            </div>

            <div className="border-t border-gray-300 pt-4 flex justify-between text-lg font-semibold text-gray-900">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              onClick={startPayment}
              disabled={loading}
              className="mt-2 w-full py-3 rounded-lg font-semibold text-white
              bg-gradient-to-r from-indigo-600 to-purple-600
              hover:from-indigo-700 hover:to-purple-700
              disabled:opacity-60 disabled:cursor-not-allowed
              transition-all"
            >
              {loading ? "Processing Payment…" : `Pay ₹${total}`}
            </button>

            <div className="text-center text-xs text-gray-500 pt-2">
              Secured by Razorpay • SSL Encrypted
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 text-center">
          <p className="text-xs text-gray-500">
            By completing this purchase, you agree to our Terms & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )

}
