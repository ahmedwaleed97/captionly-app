import './globals.css';

export const metadata = {
  title: 'Captionly',
  description: 'AI-powered captions & hashtags in seconds',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
