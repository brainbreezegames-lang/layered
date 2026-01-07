import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LevelProvider } from "@/components/LevelContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Layered - Learn English Through the News",
  description: "Beautiful news articles adapted to your English level, with exercises you can download or print.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <LevelProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LevelProvider>
      </body>
    </html>
  );
}
