import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { IBM_Plex_Mono, IBM_Plex_Sans, Noto_Sans } from "next/font/google";
import "./globals.css";

const ui = Noto_Sans({
  variable: "--font-ui",
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700"],
});

const data = IBM_Plex_Sans({
  variable: "--font-data",
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-code",
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Turees",
  description:
    "Барилгын материалын түрээс, гэрээ, тооцоо, хүлээлцлийг нэг урсгалд удирдах платформ.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="mn"
      className={`${ui.variable} ${data.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider
          localization={{
            lastAuthenticationStrategy: "",
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
