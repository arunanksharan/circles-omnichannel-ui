import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Demo | Circles.co Omnichannel Intelligence',
  description:
    'Interactive demo showing how Circles.co resolves fragmented omnichannel data into authoritative temporal facts.',
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
