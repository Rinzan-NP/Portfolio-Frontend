import { useState } from "react";
import SketchReveal from "./SketchReveal";
import axios from "axios";
import { getApiUrl } from "@/lib/api";

const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;

        setIsLoading(true);
        try {
            await axios.post(getApiUrl("/contact/"), formData);
            alert("Thanks for reaching out! Rinzan will get back to you soon. ✏️");
            setFormData({ name: "", email: "", message: "" });
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Something went wrong. Please try again or reach out directly via LinkedIn/Email. ✉️");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="contact" className="py-20 px-4 paper-texture">
            <div className="container max-w-2xl mx-auto">
                <SketchReveal variant="pencil">
                    <h2 className="text-4xl md:text-5xl font-hand font-bold text-center mb-4">📮 Get in Touch</h2>
                    <p className="text-center font-sketch text-muted-foreground mb-12 text-lg">~ leave a note on my desk ~</p>
                </SketchReveal>

                <SketchReveal variant="sticky" delay={0.2}>
                    <form
                        onSubmit={handleSubmit}
                        className="sticky-note sticky-note-green p-6 md:p-10 space-y-4 md:space-y-6 transform rotate-1"
                    >
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block font-hand text-lg md:text-xl font-bold mb-1">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    required
                                    placeholder="Your name..."
                                    className="w-full bg-transparent border-b-2 border-ink/20 focus:border-primary outline-none py-1.5 md:py-2 font-sketch text-base md:text-lg placeholder:opacity-30"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block font-hand text-lg md:text-xl font-bold mb-1">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    placeholder="Your email..."
                                    className="w-full bg-transparent border-b-2 border-ink/20 focus:border-primary outline-none py-1.5 md:py-2 font-sketch text-base md:text-lg placeholder:opacity-30"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block font-hand text-lg md:text-xl font-bold mb-1">Message</label>
                                <textarea
                                    id="message"
                                    required
                                    rows={4}
                                    placeholder="Tell me about your project or just say hi..."
                                    className="w-full bg-transparent border-2 border-ink/10 sketch-border p-2 md:p-3 focus:border-primary outline-none font-sketch text-base md:text-lg placeholder:opacity-30 resize-none custom-scrollbar"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full sketch-border bg-primary text-primary-foreground py-2 md:py-3 text-xl md:text-2xl font-hand font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed shadow-sm"
                        >
                            {isLoading ? "Sending... 🖊️" : "Send Message 🖊️"}
                        </button>

                        <div className="text-center pt-2 md:pt-4 opacity-50 font-hand italic text-sm md:text-base">
                            * I'll get back to you faster than a Llama 3 response *
                        </div>
                    </form>
                </SketchReveal>
            </div>
        </section>
    );
};

export default ContactSection;
