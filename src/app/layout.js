import "../app/globals.css"; // Tailwind CSS dosyasını dahil et

export const metadata = {
  title: "Next.js - Kişisel Bütçe Uygulaması",
  description: "Gelir ve giderlerinizi takip edin.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-r from-orange-400 via-yellow-500 to-red-500 min-h-screen text-white">
        {/* Uygulamanın genel yapısını saracak div */}
        <div className="flex flex-col min-h-screen">{children}</div>
      </body>
    </html>
  );
}
