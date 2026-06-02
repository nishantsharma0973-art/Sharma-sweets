import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const id = params.get("id") || "";
  return (
    <div data-testid="order-success-page" className="bg-cream min-h-[60vh] flex items-center">
      <div className="container-x py-24 text-center max-w-xl mx-auto">
        <CheckCircle2 size={64} className="text-saffron mx-auto mb-6" strokeWidth={1.3}/>
        <div className="eyebrow mb-3">Order Confirmed</div>
        <h1 className="text-5xl text-maroon-deep">Thank you!</h1>
        <div className="divider-gold mx-auto mt-6 mb-6"/>
        <p className="text-muted2 leading-relaxed">
          Your order <span className="text-maroon-deep font-semibold">#{id.slice(0,8)}</span> has been placed. We've sent a confirmation to your email and will be in touch shortly via WhatsApp.
        </p>
        <Link to="/menu" data-testid="success-continue" className="btn-primary inline-block mt-8">Continue Shopping</Link>
      </div>
    </div>
  );
}
