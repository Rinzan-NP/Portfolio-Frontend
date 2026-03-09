import ContactSection from "@/components/ContactSection";
import NotepadNav from "@/components/NotepadNav";

const ContactPage = () => {
    return (
        <main className="min-h-screen">
            <NotepadNav />
            <div className="pt-24 flex items-center justify-center min-h-[calc(100vh-80px)]">
                <ContactSection />
            </div>

            {/* Footer */}
            <footer className="py-8 px-4 text-center border-t border-border mt-auto">
                <p className="font-hand text-lg text-muted-foreground">
                    ✏️ Crafted by Rinzan — 2025
                </p>
            </footer>
        </main>
    );
};

export default ContactPage;
