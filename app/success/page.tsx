import { Suspense } from "react";
import SuccessPage from "./OnSuccess";

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading confirmation
      </div>
    }>
      <SuccessPage />
    </Suspense>
  );
}
