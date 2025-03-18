import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.scss";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Textify Notes",
  description: "A simple note-taking app powered AI",
  applicationName: "Textify Notes",
  metadataBase: new URL("https://textify-notes.vercel.app/"),
  keywords: ['AI', 'Textify', 'Notes', 'Note-taking', 'Productivity', 'Writing', 'Text Editor'],
  creator: "josecortezz25",
  openGraph: {
    title: "Textify Notes",
    description: "A simple note-taking app powered AI",
    url: "https://textify-notes.vercel.app/",
    siteName: "Textify Notes"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={montserrat.className}
      lang="en"
      suppressHydrationWarning
    >
      <head />
      <body className="bg-black-pearl-50 text-neutral-950 dark:text-black-pearl-50 dark:bg-black-pearl-950">

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppSidebar />
            {children}
          </SidebarProvider>
        </ThemeProvider>
        <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS_ID as string} />
      </body>
    </html>
  );
}
