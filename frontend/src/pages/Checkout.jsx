import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder, verifyPayment } from "../lib/api";
import { toast } from "sonner";
import { ShieldCheck, Lock, ShoppingBag } from "lucide-react";

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    customer_name: "", email: "", phone: "", address: "", city: "", pincode: "", notes: "",
  });
  const delivery = subtotal >= 999 ? 0 : 79;
  const total = subtotal + delivery;
  const set = (k,v)=>setForm(s=>({...s,[k]:v}));

  const launchRazorpay = (data) => new Promise((resolve) => {
    if (!window.Razorpay) { resolve({ skipped: true }); return; }
    const options = {
      key: data.razorpay_key_id,
      amount: data.amount,
      currency: "INR",
      name: "Sharma Sweets",
      description: `Order ${data.order.id.slice(0,8)}`,
      order_id: data.razorpay_order_id,
      prefill: { name: form.customer_name, email: form.email, contact: form.phone },
      theme: { color: "#800000" },
      handler: (resp) => resolve({ verified: false, resp }),
      modal: { ondismiss: () => resolve({ cancelled: true }) },
    };
    const rz = new window.Razorpay(options);
    rz.open();
  });

  const submit = async (e) => {
    e.preventDefault();
    if (items.length === 0) { toast.error("Cart is empty"); return; }
    setBusy(true);
    try {
      const data = await createOrder({ ...form, items });
      if (!data.razorpay_enabled) {
        // demo flow — verify with stub
        await verifyPayment({
          order_id: data.order.id,
          razorpay_order_id: data.razorpay_order_id,
          razorpay_payment_id: "demo_pay_" + Date.now(),
          razorpay_signature: "demo",
        });
        toast.success("Order placed (Demo mode — payment gateway pending live keys).");
        clear();
        nav(`/order-success?id=${data.order.id}`);
        return;
      }
      // Live razorpay flow
      const result = await launchRazorpay(data);
      if (result.cancelled || result.skipped) {
        toast("Payment cancelled.", { description: "Your order is saved and pending." });
        return;
      }
      const verify = await verifyPayment({
        order_id: data.order.id,
        razorpay_order_id: result.resp.razorpay_order_id,
        razorpay_payment_id: result.resp.razorpay_payment_id,
        razorpay_signature: result.resp.razorpay_signature,
      });
      if (verify.verified) {
        toast.success("Payment successful!");
        clear();
        nav(`/order-success?id=${data.order.id}`);
      } else {
        toast.error("Payment verification failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.detail || "Could not place order.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div data-testid="checkout-page" className="bg-cream">
      <section className="container-x pt-16 pb-12">
        <div className="eyebrow mb-3">Checkout</div>
        <h1 className="text-5xl md:text-6xl text-maroon-deep">Sweet, securely.</h1>
        <div className="divider-gold mt-6"/>
      </section>

      {items.length === 0 ? (
        <section className="container-x pb-32 text-center">
          <ShoppingBag size={48} className="text-gold mx-auto mb-4" strokeWidth={1}/>
          <div className="font-heading text-2xl text-maroon-deep">Your cart is empty</div>
          <Link to="/menu" data-testid="checkout-empty-cta" className="btn-primary inline-block mt-6">Browse Menu</Link>
        </section>
      ) : (
        <section className="container-x pb-24 grid md:grid-cols-12 gap-10">
          <form onSubmit={submit} data-testid="checkout-form" className="md:col-span-7 bg-white border border-gold/30 p-8 space-y-5">
            <div className="font-heading text-2xl text-maroon-deep">Delivery details</div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Fld label="Full Name *" id="co-name" required value={form.customer_name} onChange={(v)=>set("customer_name",v)}/>
              <Fld label="Phone *" id="co-phone" required value={form.phone} onChange={(v)=>set("phone",v)}/>
            </div>
            <Fld label="Email *" id="co-email" required type="email" value={form.email} onChange={(v)=>set("email",v)}/>
            <Fld label="Address *" id="co-address" required value={form.address} onChange={(v)=>set("address",v)}/>
            <div className="grid sm:grid-cols-2 gap-4">
              <Fld label="City *" id="co-city" required value={form.city} onChange={(v)=>set("city",v)}/>
              <Fld label="Pincode *" id="co-pincode" required value={form.pincode} onChange={(v)=>set("pincode",v)}/>
            </div>
            <label className="block">
              <span className="text-[10px] tracking-[0.25em] uppercase text-maroon">Order notes (optional)</span>
              <textarea data-testid="co-notes" rows={3} value={form.notes} onChange={(e)=>set("notes",e.target.value)} className="mt-1 w-full bg-transparent border-b border-gold/40 focus:border-saffron outline-none py-2 text-sm"/>
            </label>
            <div className="text-xs text-muted2 flex items-center gap-2"><Lock size={12}/> Secure checkout powered by Razorpay (UPI · Cards · Netbanking · Wallets)</div>
            <button data-testid="checkout-pay" disabled={busy} className="btn-primary w-full">{busy?"Processing…":`Pay ₹${total.toLocaleString("en-IN")}`}</button>
          </form>

          <aside data-testid="checkout-summary" className="md:col-span-5 bg-cream-alt border border-gold/30 p-8 h-fit">
            <div className="font-heading text-2xl text-maroon-deep">Order summary</div>
            <div className="divider-gold mt-3 mb-5"/>
            <ul className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {items.map(it=>(
                <li key={it.product_id} className="flex gap-3 text-sm">
                  <img src={it.image} alt="" className="w-14 h-14 object-cover"/>
                  <div className="flex-1">
                    <div className="font-heading text-base text-maroon-deep">{it.name}</div>
                    <div className="text-xs text-muted2">Qty {it.quantity}</div>
                  </div>
                  <div className="font-heading">₹{(it.price*it.quantity).toLocaleString("en-IN")}</div>
                </li>
              ))}
            </ul>
            <div className="border-t border-gold/30 mt-5 pt-5 space-y-2 text-sm">
              <Row k="Subtotal" v={`₹${subtotal.toLocaleString("en-IN")}`}/>
              <Row k="Delivery" v={delivery===0?"FREE":`₹${delivery}`}/>
              <div className="flex justify-between pt-3 border-t border-gold/30 mt-3">
                <span className="font-heading text-lg text-maroon-deep">Total</span>
                <span data-testid="co-total" className="font-heading text-2xl text-maroon-deep">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <div className="text-xs text-muted2 mt-5 flex items-center gap-2"><ShieldCheck size={14} className="text-saffron"/> Fresh, hand-sealed packaging guaranteed.</div>
          </aside>
        </section>
      )}
    </div>
  );
}

function Fld({label,id,value,onChange,type="text",required}){
  return (
    <label className="block">
      <span className="text-[10px] tracking-[0.25em] uppercase text-maroon">{label}</span>
      <input data-testid={id} required={required} type={type} value={value} onChange={(e)=>onChange(e.target.value)} className="mt-1 w-full bg-transparent border-b border-gold/40 focus:border-saffron outline-none py-2 text-sm"/>
    </label>
  );
}
function Row({k,v}){
  return <div className="flex justify-between"><span className="text-muted2">{k}</span><span>{v}</span></div>;
}
