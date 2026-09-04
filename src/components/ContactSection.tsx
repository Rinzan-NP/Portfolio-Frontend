import React from "react";
import SketchReveal from "./SketchReveal";
import { useChat } from "@/store/ChatContext";
import { Mail, ExternalLink, MessageSquare, MapPin, Sparkles } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export const ContactSection = () => {
  const { openChat } = useChat();

  const emailAddress = "nprinzan@gmail.com";
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}&su=${encodeURIComponent("Project Inquiry / Collaboration")}`;
  const mailtoUrl = `mailto:${emailAddress}?subject=${encodeURIComponent("Project Inquiry / Collaboration")}`;

  return (
    <section id="contact" className="py-20 px-4 paper-texture relative overflow-hidden">
      <div className="container max-w-5xl mx-auto">
        {/* Section Title */}
        <SketchReveal variant="pencil">
          <h2 className="text-4xl md:text-5xl font-hand font-bold text-center mb-3">📮 Get in Touch</h2>
          <p className="text-center font-sketch text-muted-foreground mb-12 text-lg">
            ~ let's build something remarkable together ~
          </p>
        </SketchReveal>

        {/* 3 Balanced Sticky Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch max-w-5xl mx-auto">
          {/* Card 1: Direct Mailbox */}
          <SketchReveal variant="pop" delay={0.1}>
            <div className="sticky-note sticky-note-yellow p-6 rotate-1 flex flex-col justify-between h-full shadow-md">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-5 h-5 text-primary" />
                  <h3 className="font-hand text-2xl font-bold text-foreground">Direct Mailbox</h3>
                </div>
                <p className="font-sketch text-sm text-pencil mb-5 leading-relaxed">
                  Send a message directly to my inbox for project inquiries or freelance roles.
                </p>

                <div className="space-y-2.5 mb-4">
                  <a
                    href={gmailComposeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("email_click", { method: "gmail", location: "contact_section" })}
                    className="w-full hand-drawn-border py-2.5 px-4 bg-primary text-primary-foreground hover:bg-primary/90 font-hand text-lg font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-sm"
                  >
                    <span>📧 Open in Gmail</span>
                    <ExternalLink className="w-4 h-4 opacity-80" />
                  </a>

                  <a
                    href={mailtoUrl}
                    onClick={() => trackEvent("email_click", { method: "mailto", location: "contact_section" })}
                    className="w-full sketch-border-light py-2 px-4 bg-background/70 hover:bg-card text-foreground font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:scale-102 text-center"
                  >
                    <span>📬 Default Mail App</span>
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 font-sketch text-xs text-pencil pt-3 border-t border-ink/10">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Kerala, India • Available Globally</span>
              </div>
            </div>
          </SketchReveal>

          {/* Card 2: Interactive AI Assistant */}
          <SketchReveal variant="pop" delay={0.2}>
            <div className="sticky-note sticky-note-blue p-6 -rotate-1 flex flex-col justify-between h-full shadow-md">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="font-hand text-2xl font-bold text-foreground">Talk to my AI</h3>
                </div>
                <p className="font-sketch text-sm text-pencil mb-5 leading-relaxed">
                  Want instant answers about my RAG systems, architecture experience, tech stack, or background?
                </p>

                <button
                  onClick={() => {
                    trackEvent("chat_open", { location: "contact_section" });
                    openChat();
                  }}
                  className="w-full hand-drawn-border py-3 px-4 bg-background/80 hover:bg-primary/20 text-foreground font-hand text-lg font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-sm mb-4"
                >
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span>💬 Chat with Rinzan (AI)</span>
                </button>
              </div>

              <div className="font-hand text-xs text-pencil italic pt-3 border-t border-ink/10 text-center">
                * Real-time RAG Agent with Voice *
              </div>
            </div>
          </SketchReveal>

          {/* Card 3: Find Me Online */}
          <SketchReveal variant="pop" delay={0.3}>
            <div className="sticky-note sticky-note-green p-6 rotate-1 flex flex-col justify-between h-full shadow-md">
              <div>
                <h3 className="font-hand text-2xl font-bold text-foreground mb-2">Find Me Online</h3>
                <p className="font-sketch text-sm text-pencil mb-5 leading-relaxed">
                  Explore open-source repositories, connect on LinkedIn, or follow along on social.
                </p>

                <div className="space-y-2.5 mb-4">
                  <a
                    href="https://www.linkedin.com/in/rinzan-np-477154284/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("linkedin_click", { location: "contact_section" })}
                    className="p-2.5 bg-background/70 rounded sketch-border-light hover:bg-primary/15 hover:scale-105 transition-all group font-mono text-xs font-semibold flex items-center justify-center gap-2"
                  >
                    <span>💼 LinkedIn</span>
                    <ExternalLink className="w-3.5 h-3.5 text-pencil opacity-60 group-hover:opacity-100" />
                  </a>

                  <a
                    href="https://github.com/Rinzan-NP"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("github_click", { location: "contact_section" })}
                    className="p-2.5 bg-background/70 rounded sketch-border-light hover:bg-primary/15 hover:scale-105 transition-all group font-mono text-xs font-semibold flex items-center justify-center gap-2"
                  >
                    <span>🐙 GitHub</span>
                    <ExternalLink className="w-3.5 h-3.5 text-pencil opacity-60 group-hover:opacity-100" />
                  </a>

                  <a
                    href="https://instagram.com/_rinzan_np_"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("instagram_click", { location: "contact_section" })}
                    className="p-2.5 bg-background/70 rounded sketch-border-light hover:bg-primary/15 hover:scale-105 transition-all group font-mono text-xs font-semibold flex items-center justify-center gap-2"
                  >
                    <span>📸 Instagram</span>
                    <ExternalLink className="w-3.5 h-3.5 text-pencil opacity-60 group-hover:opacity-100" />
                  </a>
                </div>
              </div>

              <div className="font-sketch text-xs text-pencil pt-3 border-t border-ink/10 text-center">
                Open for full-time & consulting roles
              </div>
            </div>
          </SketchReveal>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
