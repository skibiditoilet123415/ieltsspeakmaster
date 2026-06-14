import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { AuthProvider } from "@/lib/auth";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsent } from "@/components/CookieConsent";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "IELTS Speaking AI Trainer — Band 7+ with AI" },
      { name: "description", content: "Practice IELTS Speaking with an AI examiner, instant band scoring, smart vocabulary, and spaced-repetition flashcards." },
      { property: "og:title", content: "IELTS Speaking AI Trainer — Band 7+ with AI" },
      { property: "og:description", content: "Practice IELTS Speaking with an AI examiner, instant band scoring, smart vocabulary, and spaced-repetition flashcards." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "IELTS Speaking AI Trainer — Band 7+ with AI" },
      { name: "twitter:description", content: "Practice IELTS Speaking with an AI examiner, instant band scoring, smart vocabulary, and spaced-repetition flashcards." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a675e088-3b8d-409a-bd92-7f47fd1c0ea6/id-preview-181ae16a--e529426a-e196-470e-9a72-b1f817eb7906.lovable.app-1777381730110.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a675e088-3b8d-409a-bd92-7f47fd1c0ea6/id-preview-181ae16a--e529426a-e196-470e-9a72-b1f817eb7906.lovable.app-1777381730110.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/logo.png" },
      { rel: "apple-touch-icon", href: "/logo.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <Outlet />
          <Toaster />
          <CookieConsent />
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
