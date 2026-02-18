import type { Metadata } from "next";
import { Syne } from "next/font/google";
import { AuthProvider } from "@/context/auth-context";
import { PanesProvider } from "@/context/panes-context";
import { FileProvider } from "@/context/file-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Panes",
  description: "Upload and preview HTML files in your browser. No servers, no nonsense.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${syne.variable} antialiased`}>
        <AuthProvider>
          <PanesProvider>
            <FileProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </FileProvider>
          </PanesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
