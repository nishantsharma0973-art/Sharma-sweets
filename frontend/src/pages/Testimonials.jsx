import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { fetchTestimonials, addTestimonial } from "../lib/api";
import { toast } from "sonner";

export default function Testimonials() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name:"", rating:5, text:"", location:"" });
  const [busy, setBusy] = useState(false);

  const load = () => fetchTestimonials().then(setList).catch(()=>{});
  useEffect(()=>{ load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await addTestimonial(form);
      toast.success("Thank you for the kind words!");
      setForm({ name:"", rating:5, text:"", location:"" });
      load();
    } catch { toast.error("Could not submit."); }
    finally { setBusy(false); }
  };

  return (
    <div data-testid="testimonials-page" className="bg-cream">
      <section className="container-x pt-16 pb-12">
        <div className="eyebrow mb-3">Reviews</div>
        <h1 className="text-5xl md:text-6xl text-maroon-deep">Words from our patrons</h1>
        <div className="divider-gold mt-6"/>
        <div className="mt-8 flex items-center gap-4">
          <div className="flex gap-1 text-saffron">
            {Array.from({length:5}).map((_,i)=><Star key={i} size={18} fill="currentColor" strokeWidth={0}/>)}
          </div>
          <div className="font-heading text-2xl text-maroon-deep">4.9 / 5</div>
          <div className="text-xs uppercase tracking-widest text-muted2">based on 2,400+ Google reviews</div>
        </div>
      </section>

      <section className="container-x pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((t)=>(
            <figure key={t.id} data-testid={`review-${t.id.slice(0,6)}`} className="bg-white border border-gold/20 p-7 hover-lift">
              <div className="flex justify-between items-start">
                <div className="flex gap-1 text-saffron">
                  {Array.from({length:t.rating}).map((_,i)=><Star key={i} size={14} fill="currentColor" strokeWidth={0}/>)}
                </div>
                <span className="text-[10px] tracking-widest uppercase text-muted2">Google</span>
              </div>
              <blockquote className="font-heading text-xl text-maroon-deep leading-snug mt-4">“{t.text}”</blockquote>
              <figcaption className="mt-5 text-xs uppercase tracking-widest text-saffron">{t.name} {t.location && `· ${t.location}`}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="bg-cream-alt section-pad">
        <div className="container-x grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="eyebrow mb-3">Share your moment</div>
            <h2 className="text-4xl text-maroon-deep">Leave a review</h2>
            <div className="divider-gold mt-6"/>
            <p className="text-muted2 mt-6">Your words help other families discover the joy of Sharma Sweets.</p>
          </div>
          <form onSubmit={submit} data-testid="review-form" className="md:col-span-7 bg-cream border border-gold/30 p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-[10px] tracking-[0.25em] uppercase text-maroon">Your Name *</span>
                <input data-testid="review-name" required value={form.name} onChange={(e)=>setForm(s=>({...s, name:e.target.value}))} className="mt-1 w-full bg-transparent border-b border-gold/40 focus:border-saffron outline-none py-2 text-sm"/>
              </label>
              <label className="block">
                <span className="text-[10px] tracking-[0.25em] uppercase text-maroon">Location</span>
                <input data-testid="review-location" value={form.location} onChange={(e)=>setForm(s=>({...s, location:e.target.value}))} className="mt-1 w-full bg-transparent border-b border-gold/40 focus:border-saffron outline-none py-2 text-sm"/>
              </label>
            </div>
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-maroon">Rating</span>
              <div className="flex gap-2 mt-2">
                {[1,2,3,4,5].map(n=>(
                  <button data-testid={`star-${n}`} type="button" key={n} onClick={()=>setForm(s=>({...s, rating:n}))}>
                    <Star size={22} strokeWidth={1.5} fill={n<=form.rating?"#E87A00":"transparent"} className={n<=form.rating?"text-saffron":"text-muted2"}/>
                  </button>
                ))}
              </div>
            </div>
            <label className="block">
              <span className="text-[10px] tracking-[0.25em] uppercase text-maroon">Your Review *</span>
              <textarea data-testid="review-text" required value={form.text} onChange={(e)=>setForm(s=>({...s, text:e.target.value}))} rows={4} className="mt-1 w-full bg-transparent border-b border-gold/40 focus:border-saffron outline-none py-2 text-sm"/>
            </label>
            <button data-testid="review-submit" disabled={busy} className="btn-primary">{busy?"Posting…":"Post Review"}</button>
          </form>
        </div>
      </section>
    </div>
  );
}
