import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from "lucide-react";
import { BUSINESS } from "../lib/site";
import { subscribeNewsletter } from "../lib/api";
import { toast } from "sonner";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const onSub = async (e) => {
    e.preventDefault();
    if (!email) return;
    setBusy(true);
    try {
      await subscribeNewsletter(email);
      toast.success("Subscribed! Festive offers coming your way.");
      setEmail("");
    } catch {
      toast.error("Could not subscribe. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <footer data-testid="site-footer" className="bg-maroon-deep text-cream mt-32 grain relative">
      <div className="container-x py-20 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <div className="font-heading text-3xl mb-3">{BUSINESS.name}</div>
          <div className="divider-gold mb-4" />
          <p className="text-cream/70 text-sm leading-relaxed mb-6">
            Hand-crafted Indian sweets, festival hampers and bespoke wedding catering. Crafted with tradition, served with love.
          </p>
          <div className="flex gap-3">
            <a href={BUSINESS.social.instagram} aria-label="Instagram" className="w-9 h-9 border border-gold/40 hover:bg-gold/20 flex items-center justify-center transition-colors">
              <Instagram size={16} />
            </a>
            <a href={BUSINESS.social.facebook} aria-label="Facebook" className="w-9 h-9 border border-gold/40 hover:bg-gold/20 flex items-center justify-center transition-colors">
              <Facebook size={16} />
            </a>
          </div>
        </div>
        <div className="md:col-span-3">
          <div className="text-gold text-xs uppercase tracking-[0.25em] mb-4">Explore</div>
          <ul className="space-y-2 text-sm">
            {["Home","Menu","Catering","Gallery","About","Contact"].map(x=>(
              <li key={x}><Link data-testid={`footer-link-${x.toLowerCase()}`} to={x==="Home"?"/":`/${x.toLowerCase()}`} className="text-cream/70 hover:text-gold">{x}</Link></li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-5">
          <div className="text-gold text-xs uppercase tracking-[0.25em] mb-4">Visit & Contact</div>
          <ul className="space-y-3 text-sm text-cream/80">
            <li className="flex gap-3"><MapPin size={16} className="text-gold mt-1 flex-shrink-0"/><span>{BUSINESS.address}</span></li>
            <li className="flex gap-3"><Phone size={16} className="text-gold mt-1"/><a href={`tel:${BUSINESS.phone}`}>{BUSINESS.phoneDisplay}</a></li>
            <li className="flex gap-3"><Mail size={16} className="text-gold mt-1"/><a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a></li>
            <li className="flex gap-3"><Clock size={16} className="text-gold mt-1"/><span>{BUSINESS.hours}</span></li>
          </ul>
          <form onSubmit={onSub} className="mt-8">
            <div className="text-gold text-xs uppercase tracking-[0.25em] mb-3">Festival offers in your inbox</div>
            <div className="flex border border-gold/40">
              <input
                data-testid="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-transparent px-4 py-3 outline-none text-cream placeholder:text-cream/40"
              />
              <button
                data-testid="newsletter-submit"
                disabled={busy}
                type="submit"
                className="bg-saffron hover:bg-gold hover:text-maroon-deep text-cream px-6 text-xs uppercase tracking-widest transition-colors"
              >
                {busy?"…":"Join"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="border-t border-gold/20 py-6 text-center text-xs text-cream/50 tracking-wider">
        © {new Date().getFullYear()} {BUSINESS.name}. Crafted with love in Dausa, Rajasthan.
      </div>
    </footer>
  );
}
