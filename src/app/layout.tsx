import GlobalSpinner from '@components/GlobalSpinner';
import GlobalAlert from './components/alert/GlobalAlert';
import Providers from './provider';
import RouteChangeHandler from '@components/RouteChangeHandler';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s - My App',
    default: 'My App',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <GlobalAlert />
        <GlobalSpinner />
        <RouteChangeHandler />
      </body>
    </html>
  );
}
