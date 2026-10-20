import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pubblicità Radio Toscana | Raggiungi 298.000 Ascoltatori • Variante B Performance',
  description: 'Scopri come portare nuovi clienti nella tua attività con la forza di Radio Toscana. ROI di 2€ per ogni 1€ speso (Nielsen 2026), spot inclusi e tracciamento visite.',
  openGraph: {
    title: 'Radio Toscana Pubblicità | Variante B Performance Marketing',
    description: 'Monopolio dell\'ascolto in auto, 298.000 ascoltatori a settimana e pacchetti di prova dedicati alle PMI toscane.',
    url: 'https://radio-toscana-monster-engine.vercel.app/pubblicita-b',
    siteName: 'Radio Toscana Ufficio Commerciale',
    locale: 'it_IT',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PubblicitaBLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
