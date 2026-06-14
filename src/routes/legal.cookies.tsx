import { createFileRoute } from "@tanstack/react-router";

const CONTACT = "nguyenthienbaoflo@gmail.com";
const UPDATED = "June 14, 2026";

export const Route = createFileRoute("/legal/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — IELTS Speaking AI" },
      { name: "description", content: "How IELTS Speaking AI Trainer uses cookies and similar technologies." },
      { property: "og:title", content: "Cookie Policy — IELTS Speaking AI" },
      { property: "og:description", content: "How IELTS Speaking AI Trainer uses cookies and similar technologies." },
    ],
  }),
  component: Cookies,
});

function Cookies() {
  return (
    <article className="prose prose-neutral dark:prose-invert mx-auto max-w-3xl">
      <h1>Cookie Policy</h1>
      <p className="text-sm text-muted-foreground">Last updated: {UPDATED}</p>

      <p>This Cookie Policy explains how we use cookies and similar technologies on the Service.</p>

      <h2>1. What Are Cookies</h2>
      <p>Cookies are small text files stored on your device. We also use localStorage and similar APIs.</p>

      <h2>2. Types We Use</h2>
      <ul>
        <li><strong>Strictly necessary:</strong> authentication session, security, load balancing.</li>
        <li><strong>Preference:</strong> theme (light/dark), language, UI settings.</li>
        <li><strong>Analytics:</strong> aggregate usage to improve the Service.</li>
      </ul>

      <h2>3. Third-Party Cookies</h2>
      <p>Authentication and analytics providers may set their own cookies subject to their privacy policies.</p>

      <h2>4. Managing Cookies</h2>
      <p>You can block or delete cookies in your browser settings. Doing so may break sign-in or core features.</p>

      <h2>5. Contact</h2>
      <p><a href={`mailto:${CONTACT}`}>{CONTACT}</a></p>
    </article>
  );
}
