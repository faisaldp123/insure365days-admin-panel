import './globals.css';
// import NavBar from '../components/Navbar';

export const metadata = {
  title: 'Insure365days CRM',
  description: 'CRM for insurance leads',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* <NavBar /> */}
        <main style={{ padding: '20px' }}>{children}</main>
      </body>
    </html>
  );
}
