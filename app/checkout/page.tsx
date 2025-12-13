import { Suspense } from "react";
import CheckoutPageContent from "./CheckoutPageContent";

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading checkout…
      </div>
    }>
      <CheckoutPageContent />
    </Suspense>
  );
}
