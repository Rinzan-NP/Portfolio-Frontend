import HeroSection from "@/components/HeroSection";
import ChatDemoSection from "@/components/ChatDemoSection";
import SkillsSection from "@/components/SkillsSection";
import TechStackSection from "@/components/TechStackSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import NotepadNav from "@/components/NotepadNav";

const ChatPage = () => {
    return (
        <main className="min-h-screen">
            <NotepadNav />
            <div className="pt-24">
                <ChatDemoSection />
            </div>

            {/* Footer */}
            <footer className="py-8 px-4 text-center border-t border-border">
                <p className="font-hand text-lg text-muted-foreground">
                    ✏️ Crafted by Rinzan — 2025
                </p>
            </footer>
        </main>
    );
};

export default ChatPage;
