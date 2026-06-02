import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { FAQS } from "../lib/site";

export default function FAQ() {
  return (
    <section data-testid="faq-section" className="section-pad bg-cream-alt">
      <div className="container-x grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <div className="eyebrow mb-3">Help & Information</div>
          <h2 className="text-4xl md:text-5xl text-maroon-deep mb-4">Frequently asked</h2>
          <div className="divider-gold mb-6"/>
          <p className="text-muted2 text-sm leading-relaxed">
            Everything you might wonder about our sweets, delivery, customisation and catering. Still unsure? Ping us on WhatsApp.
          </p>
        </div>
        <div className="md:col-span-8">
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} data-testid={`faq-item-${i}`} className="border-gold/30">
                <AccordionTrigger className="font-heading text-lg text-maroon-deep text-left hover:text-saffron">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted2 text-sm leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
