import { Geist, Geist_Mono, Playfair_Display, Outfit, Montserrat, Unbounded, League_Spartan } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
});

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin"],
});

export const metadata = {
  title: "Kanavu — Immersive Experience",
  description: "An immersive 3D web experience built with Next.js, Three.js, and GSAP.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${outfit.variable} ${montserrat.variable} ${unbounded.variable} ${leagueSpartan.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
