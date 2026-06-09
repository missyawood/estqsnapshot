import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Snapshot — HVAC Project Readiness',
  description: 'Before you get HVAC quotes, let\'s make sure you\'re looking at the right numbers.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-slate-900">{children}</body>
    </html>
  );
}
