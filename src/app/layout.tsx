import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Makom",
};

/** Root html/body live in [locale]/layout for dir/lang. */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
