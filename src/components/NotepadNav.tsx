import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const navItems = [
    { label: "About", href: "/#about" },
    { label: "Skills", href: "/#skills" },
    { label: "Projects", href: "/#projects" },
    { label: "Experience", href: "/#experience" },
    { label: "Contact", href: "/#contact" },
];

const NotepadNav = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleNavClick = (href: string, label?: string) => {
        trackEvent("nav_click", { target: label || href, location: "notepad_navbar" });
        setIsMenuOpen(false);

        if (href.startsWith("/#") && location.pathname === "/") {
            const id = href.replace("/#", "");
            if (id === "contact") {
                if (window.lenis) {
                    window.lenis.scrollTo(document.body.scrollHeight, { duration: 1.4 });
                } else {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                }
            } else {
                const element = document.getElementById(id);
                if (element) {
                    if (window.lenis) {
                        window.lenis.scrollTo(element, { offset: -85, duration: 1.25 });
                    } else {
                        element.scrollIntoView({ behavior: "smooth" });
                    }
                }
            }
        }
    };

    return (
        <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] md:max-w-fit pointer-events-none">
            <motion.div
                animate={{
                    y: scrolled ? 0 : 4,
                    rotate: scrolled ? 0 : -1,
                    scale: scrolled ? 0.98 : 1
                }}
                className="pointer-events-auto"
            >
                <div className="bg-sticky-yellow sketch-border p-2 md:p-3 flex justify-between md:justify-start gap-4 md:gap-8 items-center shadow-lg transform transition-all relative">
                    {/* Ring Binder Effect */}
                    <div className="absolute top-0 left-0 w-full h-4 flex justify-around -translate-y-2 pointer-events-none">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="w-3 h-3 rounded-full bg-background border border-border" />
                        ))}
                    </div>

                    <div className="font-hand font-bold text-xl md:mr-4 md:border-r border-ink/10 md:pr-6 whitespace-nowrap">
                        Rinzan.txt
                    </div>

                    {/* Desktop Menu */}
                    <ul className="hidden md:flex gap-6">
                        {navItems.map((item) => (
                            <li key={item.label}>
                                <Link
                                    to={item.href}
                                    onClick={() => handleNavClick(item.href, item.label)}
                                    className="font-hand text-xl text-foreground hover:text-primary transition-colors"
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-1 text-ink"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 8, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className="md:hidden absolute top-full left-0 w-full bg-sticky-yellow sketch-border p-6 shadow-2xl origin-top"
                        >
                            <ul className="flex flex-col gap-4">
                                {navItems.map((item) => (
                                    <li key={item.label}>
                                        <Link
                                            to={item.href}
                                            onClick={() => handleNavClick(item.href, item.label)}
                                            className="block font-hand text-2xl text-foreground py-2 border-b border-ink/5"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6 font-sketch text-muted-foreground text-center italic text-sm">
                                ~ flipped to page {navItems.findIndex(i => i.href === location.pathname) + 1} ~
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </nav>
    );
};

export default NotepadNav;
