import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://n-13-bigshop.vercel.app"),
  title: "N-13 BIGSHOP Goma | Téléphones, Vêtements, Souliers - Commander sur WhatsApp",
  description: "N-13 BIGSHOP à Goma : iPhone XR à 17 Pro Max, Samsung, Tecno, Jordan, Baggy, Air Force. Commande facile sur WhatsApp au 0984 506 008, livraison rapide partout à Goma.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true }, 
  verification: {
    google: "3jM3OT3xYCy1_sHlQm-LH5B7sH3ZW1MmYtOe22QD8fs",
  },
  openGraph: {
    title: "N-13 BIGSHOP | La plus grande boutique de Goma",
    description: "Téléphones, vêtements et souliers à Goma. Commande sur WhatsApp.",
    type: "website",
    locale: "fr_CD",
    siteName: "N-13 BIGSHOP",
    url: "/",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
