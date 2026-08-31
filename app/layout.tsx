import type { Metadata } from "next";
import { Roboto, Caveat } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "DearUs — A Little Thing For Someone You Love",
    template: "%s | DearUs",
  },
  description:
    "Create a tiny little thing for someone you love. A sweet personalized question experience, made with care. 💌",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${caveat.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var l=localStorage.getItem('dearus-lang');if(l==='my')document.documentElement.lang='my';}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
