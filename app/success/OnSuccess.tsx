"use client";

import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  return (
  <div className="min-h-screen flex items-center justify-center px-6
    bg-gradient-to-br from-indigo-50 via-white to-purple-50"
  >
    <div className="relative w-full max-w-md bg-white rounded-2xl
      shadow-2xl border border-gray-200 p-10 text-center overflow-hidden"
    >
      {/* Soft glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2
        w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl"
      />

      {/* Icon */}
      <div className="relative mb-6 flex justify-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Payment Successful 🎉
      </h1>

      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed mb-8">
        Your website builder access is now fully unlocked.
        You can build, edit, and export your projects without any limitations.
      </p>

      {/* CTA */}
      <a
        href="/editor"
        className="inline-flex items-center justify-center
          px-8 py-3 rounded-lg font-semibold text-white
          bg-gradient-to-r from-indigo-600 to-purple-600
          hover:from-indigo-700 hover:to-purple-700
          shadow-lg hover:shadow-xl transition-all"
      >
        Go to Website Builder
      </a>

      {/* Footer note */}
      <p className="text-xs text-gray-500 mt-6">
        A confirmation email has been sent to your inbox.
      </p>
    </div>
  </div>
)

}
