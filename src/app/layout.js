import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title:
    "FreedomBuild AI — From Script to Screen, Instantly - with powerful specialized AI Agents.",
  description:
    "FreedomBuild AI is your all-in-one platform for generating ad campaigns, short films, and full-length movies using the power of artificial intelligence. From scriptwriting to visuals, voice, and editing — everything is automated to help creators, marketers, and filmmakers bring their visions to life faster, cheaper, and smarter. Whether you're building brand stories or cinematic experiences, FreedomBuild AI turns your creativity into production-ready content — effortlessly.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <QueryProvider>
            {children}
            <Toaster richColors />
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
