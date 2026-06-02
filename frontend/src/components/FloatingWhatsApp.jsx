import React from "react";
import { MessageCircle } from "lucide-react";
import { BUSINESS } from "../lib/site";

export default function FloatingWhatsApp() {
  const msg = encodeURIComponent(
    "Hi Sharma Sweets! I'd like to know more about your sweets."
  );
  return (
    <a
      data-testid="floating-whatsapp"
      href={`https://wa.me/${BUSINESS.whatsapp}?text=${msg}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed z-40 bottom-6 left-6 bg-[#25D366] hover:scale-110 transition-transform shadow-lg w-14 h-14 rounded-full flex items-center justify-center text-white"
    >
      <MessageCircle size={26} strokeWidth={2} />
      <span className="absolute right-full mr-3 hidden md:block bg-maroon-deep text-cream text-xs px-3 py-1 uppercase tracking-widest whitespace-nowrap">Chat with us</span>
    </a>
  );
}
