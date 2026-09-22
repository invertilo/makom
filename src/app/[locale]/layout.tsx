import { Rubik, DM_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Toaster } from "sonner";
import { routing, isRtl, type Locale } from "@/i18n/routing";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { AuthProvider } from "@/components/auth/auth-provider";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { ServiceWorkerRegister } from "@/components/layout/sw-register";
import "../globals.css";

/** Rubik covers Latin + Hebrew; DM Mono for tabular status/counts. */
const rubik = Rubik({
  subsets: ["latin", "latin-ext", "hebrew", "cyrillic"],
  variable: "--font-body",
  display: "swap",
});

const rubikDisplay = Rubik({
  subsets: ["latin", "latin-ext", "hebrew", "cyrillic"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = (await import(`../../messages/${locale}.json`)).default as {
    brand: { name: string; tagline: string };
  };
  return {
    title: {
      default: messages.brand.name,
      template: `%s · ${messages.brand.name}`,
    },
    description: messages.brand.tagline,
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      title: messages.brand.name,
      statusBarStyle: "default",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = isRtl(locale as Locale) ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${rubik.variable} ${rubikDisplay.variable} ${dmMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans antialiased">
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <AuthProvider>
              <AppHeader />
              <main className="flex-1 pb-20 md:pb-0">{children}</main>
              <BottomNav />
              <Toaster richColors position="bottom-center" />
              <ServiceWorkerRegister />
            </AuthProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
