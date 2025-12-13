"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  const params = useSearchParams();
    let plan = params.get("plan") || "";
  
  useEffect(() => {
    // Mark the resume as unlocked
    localStorage.setItem("resume_unlocked", plan);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6 text-center">
      
      {/* Success Icon */}
      <div className="mb-6 animate-bounce">
        <CheckCircle className="w-20 h-20 text-green-600" />
      </div>

      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        Payment Successful 🎉
      </h1>

      <p className="text-gray-700 max-w-md mb-8">
        Your resume is now fully unlocked.  
        You can preview, edit, and export it without any limitations.
      </p>

      {/* Return Button */}
      <a
        href="/editor"
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold shadow hover:bg-indigo-700 transition"
      >
        Go to Resume Builder
      </a>

      {/* Extra Info */}
      <p className="text-sm text-gray-500 mt-6">
        A confirmation has been saved. You won’t be asked to pay again.
      </p>
    </div>
  );
}
