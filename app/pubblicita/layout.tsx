import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pubblicità su Radio Toscana | Raggiungi 298.000 Ascoltatori ogni Settimana',
  description: 'Fai crescere la tua attività in Toscana con spot radiofonici professionali, copertura FM/DAB+ regionale e le evidenze di efficacia dell\'Osservatorio FCP-Assoradio.',
  openGraph: {
    title: 'Radio Toscana Pubblicità | Comunicazione Radiofonica per le Imprese Toscane',
    description: '298.000 ascoltatori settimanali, 61.000 nel giorno medio. Spot audio chiavi in mano, fasce drive-time 7:00-19:00 e certificazione ufficiale delle trasmissioni.',
    url: 'https://radio-toscana-monster-engine.vercel.app/pubblicita',
    siteName: 'Radio Toscana - Ufficio Pubblicità',
    locale: 'it_IT',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PubblicitaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
