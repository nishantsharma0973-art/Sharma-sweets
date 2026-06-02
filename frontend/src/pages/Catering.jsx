import React, { useState } from "react";
import { submitCatering } from "../lib/api";
import { toast } from "sonner";
import { Crown, Building2, Cake, Sparkles } from "lucide-react";

const SERVICES = [
  { icon: Crown, t: "Wedding Catering", d: "Mithai trays, dessert counters, custom shagun boxes for 100 – 5,000 guests." },
  { icon: Cake, t: "Birthday Parties", d: "Themed sweet hampers, cakes, kid-friendly menus and live counters." },
  { icon: Building2, t: "Corporate Events", d: "Branded gifting, festival hampers, bulk dispatch with dedicated coordinator." },
  { icon: Sparkles, t: "Festival Bulk Orders", d: "Diwali / Rakhi / Holi corporate gifting at scale, customised packaging." },
];

export default function Catering() {
  const [form, setForm] = useState({ name:"", email:"", phone:"", event_type:"Wedding", event_date:"", guest_count:"", message:"" });
  const [busy, setBusy] = useState(false);
  const set = (k,v)=>setForm(s=>({...s,[k]:v}));
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await submitCatering({...form, guest_count: Number(form.guest_count)||0});
      toast.success("Inquiry sent! We'll respond within 2 business hours.");
      setForm({ name:"", email:"", phone:"", event_type:"Wedding", event_date:"", guest_count:"", message:"" });
    } catch {
      toast.error("Could not submit. Please try again or WhatsApp us.");
    } finally { setBusy(false); }
  };
  return (
    <div data-testid="catering-page" className="bg-cream">
      <section className="relative overflow-hidden">
        <img src="https://images.pexels.com/photos/32044781/pexels-photo-32044781.jpeg?auto=compress&cs=tinysrgb&w=1600" className="absolute inset-0 w-full h-full object-cover" alt="Catering tray"/>
        <div className="absolute inset-0 bg-maroon-deep/70"/>
        <div className="relative container-x py-24 md:py-36 text-cream">
          <div className="text-xs tracking-[0.3em] uppercase text-gold mb-4">Catering Services</div>
          <h1 className="text-5xl md:text-6xl max-w-3xl leading-tight">Sweetness, scaled to your moment.</h1>
          <div className="divider-gold mt-6"/>
          <p className="text-cream/80 mt-6 max-w-2xl">From an intimate engagement to a 5,000-guest wedding — we craft the menu, design the trays, and deliver, end-to-end.</p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-x grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((s,i)=>(
            <div key={i} className="bg-cream border border-gold/20 p-8 hover-lift">
              <s.icon size={28} strokeWidth={1.3} className="text-saffron"/>
              <div className="font-heading text-2xl text-maroon-deep mt-4">{s.t}</div>
              <p className="text-sm text-muted2 mt-2 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad bg-cream-alt">
        <div className="container-x grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <div className="eyebrow mb-3">Plan with us</div>
            <h2 className="text-4xl md:text-5xl text-maroon-deep">Tell us about your event</h2>
            <div className="divider-gold mt-6 mb-6"/>
            <p className="text-muted2">We'll get back within 2 business hours with a tailored proposal, sample box arrangement and pricing.</p>
          </div>
          <form onSubmit={submit} data-testid="catering-form" className="md:col-span-7 bg-cream border border-gold/30 p-8 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Your Name" id="cat-name" required value={form.name} onChange={(v)=>set("name",v)}/>
              <Field label="Phone" id="cat-phone" required value={form.phone} onChange={(v)=>set("phone",v)}/>
            </div>
            <Field label="Email" id="cat-email" type="email" required value={form.email} onChange={(v)=>set("email",v)}/>
            <div className="grid sm:grid-cols-3 gap-4">
              <Select label="Event Type" id="cat-type" value={form.event_type} onChange={(v)=>set("event_type",v)} options={["Wedding","Birthday","Corporate","Festival Bulk","Other"]}/>
              <Field label="Event Date" id="cat-date" type="date" value={form.event_date} onChange={(v)=>set("event_date",v)}/>
              <Field label="Guests (approx.)" id="cat-guests" type="number" value={form.guest_count} onChange={(v)=>set("guest_count",v)}/>
            </div>
            <Field label="Tell us more" id="cat-msg" textarea value={form.message} onChange={(v)=>set("message",v)}/>
            <button data-testid="catering-submit" disabled={busy} className="btn-primary w-full">{busy?"Sending…":"Request Proposal"}</button>
          </form>
        </div>
      </section>
    </div>
  );
}

function Field({label,id,value,onChange,type="text",required,textarea}){
  return (
    <label className="block">
      <span className="text-[10px] tracking-[0.25em] uppercase text-maroon">{label}{required && " *"}</span>
      {textarea ? (
        <textarea data-testid={id} required={required} value={value} onChange={(e)=>onChange(e.target.value)} rows={4} className="mt-1 w-full bg-transparent border-b border-gold/40 focus:border-saffron outline-none py-2 text-sm"/>
      ) : (
        <input data-testid={id} required={required} type={type} value={value} onChange={(e)=>onChange(e.target.value)} className="mt-1 w-full bg-transparent border-b border-gold/40 focus:border-saffron outline-none py-2 text-sm"/>
      )}
    </label>
  );
}
function Select({label,id,value,onChange,options}){
  return (
    <label className="block">
      <span className="text-[10px] tracking-[0.25em] uppercase text-maroon">{label}</span>
      <select data-testid={id} value={value} onChange={(e)=>onChange(e.target.value)} className="mt-1 w-full bg-transparent border-b border-gold/40 focus:border-saffron outline-none py-2 text-sm">
        {options.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
