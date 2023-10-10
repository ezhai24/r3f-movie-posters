import "./globals.css";

export const metadata = {
  title: "Emily Zhai | Movie Slider",
  description:
    "An infinite slider of movie posters. A react-three-fiber learning experiment by Emily Zhai.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
