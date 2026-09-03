import React, { useState } from "react";
import SketchReveal from "./SketchReveal";
import axios from "axios";
import { getApiUrl } from "@/lib/api";
import { useChat } from "@/store/ChatContext";
import { toast } from "sonner";
import { Mail, Send, ExternalLink, MessageSquare, MapPin, Sparkles } from "lucide-react";

export const ContactSection = () => {
  const { openChat } = useChat();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const emailAddress = "nprinzan@gmail.com";
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}&su=${encodeURIComponent("Project Inquiry / Collaboration")}`;
  const mailtoUrl = `mailto:${emailAddress}?subject=${encodeURIComponent("Project Inquiry / Collaboration")}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const senderEmail = formData.email;
    setIsLoading(true);
    try {
      await axios.post(getApiUrl("/contact/"), formData);
      setFormData({ name: "", email: "", message: "" });

      // Trigger animated airmail toast
      toast.custom((t) => (
        <div className="bg-[#faf8f5] text-foreground p-4 rounded-xl sketch-border shadow-2xl border-2 border-ink flex items-start gap-3.5 max-w-md w-full relative overflow-hidden select-none animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-11 h-11 rounded-full bg-sticky-yellow flex items-center justify-center text-2xl shrink-0 sketch-border shadow-sm animate-bounce">
            ✈️
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                AIR MAIL • DELIVERED
              </span>
            </div>
            <h4 className="font-hand text-xl font-bold text-foreground mt-1">
              ✉️ Message Stamped & Sent!
            </h4>
            <p className="font-sketch text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Thanks for reaching out! Rinzan will get back to you shortly.
            </p>
          </div>
        </div>
      ), { duration: 5000 });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Couldn't send airmail right now. Please reach out directly to nprinzan@gmail.com! ✉️");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-4 paper-texture relative overflow-hidden">
      <div className="container max-w-5xl mx-auto">
        {/* Section Title */}
        <SketchReveal variant="pencil">
          <h2 className="text-4xl md:text-5xl font-hand font-bold text-center mb-3">📮 Get in Touch</h2>
          <p className="text-center font-sketch text-muted-foreground mb-14 text-lg">
            ~ send an airmail note or connect directly ~
          </p>
        </SketchReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Airmail Letter / Postcard Form (7 cols) */}
          <SketchReveal variant="sticky" className="lg:col-span-7">
            <div className="relative bg-card rounded-lg sketch-border p-6 md:p-8 shadow-md border-t-8 border-t-primary">
              {/* Airmail Envelope Header with Stamp */}
              <div className="flex justify-between items-start border-b-2 border-dashed border-ink/15 pb-4 mb-6">
                <div>
                  <span className="font-mono text-xs text-primary font-bold tracking-widest uppercase bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                    AIR MAIL • PAR AVION ✈️
                  </span>
                  <h3 className="font-hand text-2xl font-bold text-foreground mt-2">
                    To: Rinzan NP
                  </h3>
                  <p className="font-sketch text-xs text-pencil">AI Systems Architect & Backend Engineer</p>
                </div>

                {/* Postage Stamp Doodle */}
                <div className="w-16 h-20 bg-sticky-yellow sketch-border p-1 text-center rotate-3 shadow-sm select-none hidden sm:block">
                  <div className="border border-dashed border-ink/30 h-full flex flex-col items-center justify-center">
                    <span className="text-xl">🚀</span>
                    <span className="font-mono text-[9px] font-bold text-primary mt-1">FAST AI</span>
                    <span className="font-mono text-[8px] text-pencil">2025</span>
                  </div>
                </div>
              </div>

              {/* The Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="contact-name" className="block font-hand text-lg font-bold text-foreground mb-1">
                    Your Name <span className="text-primary">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="e.g. Sarah Connor"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-background/60 border-2 border-ink/15 focus:border-primary rounded px-3.5 py-2 font-sketch text-base text-foreground outline-none transition-colors placeholder:text-pencil/40"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block font-hand text-lg font-bold text-foreground mb-1">
                    Your Email <span className="text-primary">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="e.g. sarah@skynet-solutions.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-background/60 border-2 border-ink/15 focus:border-primary rounded px-3.5 py-2 font-sketch text-base text-foreground outline-none transition-colors placeholder:text-pencil/40"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block font-hand text-lg font-bold text-foreground mb-1">
                    Your Message <span className="text-primary">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    placeholder="Tell me about your project, LLM workflow, or just say hello..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-background/60 border-2 border-ink/15 focus:border-primary rounded p-3.5 font-sketch text-base text-foreground outline-none transition-colors placeholder:text-pencil/40 resize-none custom-scrollbar"
                  />
                </div>

                {/* Submit CTA Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sketch-border bg-primary text-primary-foreground py-3 px-6 text-xl font-hand font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Send className="w-5 h-5 animate-pulse" />
                      <span>Sending note... 🖊️</span>
                    </>
                  ) : (
                    <>
                      <span>✉️ Stamp & Send Message</span>
                    </>
                  )}
                </button>

                <div className="text-center pt-2 font-hand text-xs md:text-sm text-pencil italic">
                  * I'll respond faster than an uncached LLM response *
                </div>
              </form>
            </div>
          </SketchReveal>

          {/* Right Column: Direct Channels & Interactive Sticky Notes (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Note 1: Direct Mailbox (Opens directly in Gmail or Mail Client) */}
            <SketchReveal variant="pop" delay={0.15}>
              <div className="sticky-note sticky-note-yellow p-6 rotate-1">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-5 h-5 text-primary" />
                  <h4 className="font-hand text-2xl font-bold text-foreground">Direct Mailbox</h4>
                </div>
                <p className="font-sketch text-sm text-pencil mb-4">
                  Prefer sending directly via your email client?
                </p>

                <div className="space-y-2.5 mb-4">
                  <a
                    href={gmailComposeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full hand-drawn-border py-2.5 px-4 bg-primary text-primary-foreground hover:bg-primary/90 font-hand text-lg font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-sm"
                  >
                    <span>📧 Open in Gmail</span>
                    <ExternalLink className="w-4 h-4 opacity-80" />
                  </a>

                  <a
                    href={mailtoUrl}
                    className="w-full sketch-border-light py-2 px-4 bg-background/70 hover:bg-card text-foreground font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:scale-102"
                  >
                    <span>📬 Default Mail App ({emailAddress})</span>
                  </a>
                </div>

                <div className="flex items-center gap-2 font-sketch text-xs text-pencil">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Kerala, India • Available for Global / Remote Roles</span>
                </div>
              </div>
            </SketchReveal>

            {/* Note 2: Interactive AI Assistant Card */}
            <SketchReveal variant="pop" delay={0.3}>
              <div className="sticky-note sticky-note-blue p-6 -rotate-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h4 className="font-hand text-2xl font-bold text-foreground">Talk to my AI</h4>
                </div>
                <p className="font-sketch text-sm text-pencil mb-4 leading-relaxed">
                  Want immediate answers about my architecture experience, tech stack, or availability?
                </p>

                <button
                  onClick={openChat}
                  className="w-full hand-drawn-border py-2.5 px-4 bg-background/80 hover:bg-primary/20 text-foreground font-hand text-lg font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
                >
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span>💬 Chat with Rinzan (AI)</span>
                </button>
              </div>
            </SketchReveal>

            {/* Note 3: Social & Code Hub Links */}
            <SketchReveal variant="pop" delay={0.45}>
              <div className="sticky-note sticky-note-green p-6 rotate-1">
                <h4 className="font-hand text-xl font-bold text-foreground mb-3">Find Me Online</h4>
                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href="https://www.linkedin.com/in/rinzan-np-477154284/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-background/70 rounded sketch-border-light hover:bg-primary/15 hover:scale-105 transition-all text-center group font-mono text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <span>💼 LinkedIn</span>
                    <ExternalLink className="w-3 h-3 text-pencil opacity-60 group-hover:opacity-100" />
                  </a>

                  <a
                    href="https://github.com/Rinzan-NP"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-background/70 rounded sketch-border-light hover:bg-primary/15 hover:scale-105 transition-all text-center group font-mono text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <span>🐙 GitHub</span>
                    <ExternalLink className="w-3 h-3 text-pencil opacity-60 group-hover:opacity-100" />
                  </a>
                </div>
              </div>
            </SketchReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
