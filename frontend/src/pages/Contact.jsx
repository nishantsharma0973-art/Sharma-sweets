import React, { useState } from "react";
import { BUSINESS } from "../lib/site";
import { submitContact } from "../lib/api";
import { toast } from "sonner";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name:"", email:"", phone:"", subject:"", message:"" });
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await submitContact(form);
      toast.success("Message received — we'll respond shortly.");
      setForm({ name:"", email:"", phone:"", subject:"", message:"" });
    } catch { toast.error("Could not send message."); }
    finally { setBusy(false); }
  };
  const waMsg = encodeURIComponent("Hi Sharma Sweets, I'd like to enquire about an order.");
  return (
    <div data-testid="contact-page" className="bg-cream">
      <section className="container-x pt-16 pb-12">
        <div className="eyebrow mb-3">Contact</div>
        <h1 className="text-5xl md:text-6xl text-maroon-deep">Let's talk sweets.</h1>
        <div className="divider-gold mt-6"/>
        <p className="text-muted2 mt-6 max-w-2xl">Drop by our store, message on WhatsApp or fill the form — we respond to every enquiry personally.</p>
      </section>

      <section className="container-x pb-20 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5 space-y-6">
          <InfoRow icon={MapPin} label="Visit" value={BUSINESS.address} linkHref={BUSINESS.mapsLink}/>
          <InfoRow icon={Phone} label="Call" value={BUSINESS.phoneDisplay} linkHref={`tel:${BUSINESS.phone}`}/>
          <InfoRow icon={Mail} label="Email" value={BUSINESS.email} linkHref={`mailto:${BUSINESS.email}`}/>
          <InfoRow icon={Clock} label="Hours" value={BUSINESS.hours}/>
          <a
            data-testid="contact-whatsapp"
            href={`https://wa.me/${BUSINESS.whatsapp}?text=${waMsg}`}
            target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] text-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-[#1ebc59] transition-colors"
          >
            <MessageCircle size={16}/> Chat on WhatsApp
          </a>
        </div>
        <form onSubmit={submit} data-testid="contact-form" className="md:col-span-7 bg-cream-alt border border-gold/30 p-8 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Inp label="Name *" id="contact-name" required value={form.name} onChange={(v)=>setForm(s=>({...s,name:v}))}/>
            <Inp label="Phone" id="contact-phone" value={form.phone} onChange={(v)=>setForm(s=>({...s,phone:v}))}/>
          </div>
          <Inp label="Email *" id="contact-email" type="email" required value={form.email} onChange={(v)=>setForm(s=>({...s,email:v}))}/>
          <Inp label="Subject" id="contact-subject" value={form.subject} onChange={(v)=>setForm(s=>({...s,subject:v}))}/>
          <label className="block">
            <span className="text-[10px] tracking-[0.25em] uppercase text-maroon">Message *</span>
            <textarea data-testid="contact-message" required rows={5} value={form.message} onChange={(e)=>setForm(s=>({...s,message:e.target.value}))} className="mt-1 w-full bg-transparent border-b border-gold/40 focus:border-saffron outline-none py-2 text-sm"/>
          </label>
          <button data-testid="contact-submit" disabled={busy} className="btn-primary">{busy?"Sending…":"Send Message"}</button>
        </form>
      </section>

      <section className="border-t border-gold/20">
        <iframe
          data-testid="contact-map"
          title="Sharma Sweets location"
          src={BUSINESS.mapsEmbed}
          className="w-full h-[420px] grayscale-[20%]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </div>
  );
}

function InfoRow({icon:Icon,label,value,linkHref}){
  const inner = (
    <div className="flex gap-4">
      <div className="w-10 h-10 border border-gold/40 flex items-center justify-center text-saffron"><Icon size={18} strokeWidth={1.5}/></div>
      <div>
        <div className="text-[10px] tracking-[0.25em] uppercase text-saffron">{label}</div>
        <div className="text-ink mt-1">{value}</div>
      </div>
    </div>
  );
  return linkHref ? <a href={linkHref} target="_blank" rel="noreferrer" className="block hover:text-saffron transition-colors">{inner}</a> : inner;
}
function Inp({label,id,value,onChange,type="text",required}){
  return (
    <label className="block">
      <span className="text-[10px] tracking-[0.25em] uppercase text-maroon">{label}</span>
      <input data-testid={id} required={required} type={type} value={value} onChange={(e)=>onChange(e.target.value)} className="mt-1 w-full bg-transparent border-b border-gold/40 focus:border-saffron outline-none py-2 text-sm"/>
    </label>
  );
}
