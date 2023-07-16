import "./globals.css";

export const metadata = {
  title: "Singapore Property Analytics",
  description: "Singapore Property Analytics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <body>{children}</body>
    </html>
  );
}
