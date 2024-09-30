import './globals.css';  

export const metadata = {
  title: 'Todo App',
  description: 'A simple todo app using ShadCN and MERN stack',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="container mx-auto py-4">
          {children}
        </main>
      </body>
    </html>
  );
}
