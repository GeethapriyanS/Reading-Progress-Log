import './globals.css';
import NavBar from './components/NavBar';

export const metadata = {
  title: 'Personal Reading Progress Log',
  description: 'Track and manage your reading habits.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}