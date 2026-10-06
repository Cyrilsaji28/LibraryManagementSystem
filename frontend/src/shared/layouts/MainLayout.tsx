import type { ReactNode } from "react";
import { motion } from "framer-motion";
import Navbar from "@/shared/components/Navbar";
import Footer from "@/shared/components/Footer";

type Props = {
  children: ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <Navbar />

      <div className="flex min-h-screen flex-col">
        <main className="flex-1 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
          >
            {children}
          </motion.div>
        </main>

        <Footer />
      </div>
    </div>
  );
}