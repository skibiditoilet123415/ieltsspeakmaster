import { createFileRoute } from "@tanstack/react-router";

const CONTACT = "nguyenthienbaoflo@gmail.com";
const UPDATED = "June 14, 2026";

export const Route = createFileRoute("/legal/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — IELTS Speaking AI" },
      { name: "description", content: "The rules and terms that govern your use of IELTS Speaking AI Trainer." },
      { property: "og:title", content: "Terms of Service — IELTS Speaking AI" },
      { property: "og:description", content: "The rules and terms that govern your use of IELTS Speaking AI Trainer." },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <article className="prose prose-neutral dark:prose-invert mx-auto max-w-3xl">
      <h1>Terms of Service</h1>
      <p className="text-sm text-muted-foreground">Last updated: {UPDATED}</p>

      <p>By accessing or using IELTS Speaking AI Trainer (the "Service"), you agree to these Terms.</p>

      <h2>1. Eligibility</h2>
      <p>You must be at least 13 years old (or the minimum legal age in your country) to use the Service.</p>

      <h2>2. Account</h2>
      <p>You are responsible for safeguarding your credentials and all activity under your account.</p>

      <h2>3. Acceptable Use</h2>
      <ul>
        <li>No reverse engineering, scraping, or automated abuse.</li>
        <li>No uploading illegal, harmful, or infringing content.</li>
        <li>No attempt to bypass paid features, rate limits, or security.</li>
      </ul>

      <h2>4. AI Output Disclaimer</h2>
      <p>AI band scores and feedback are estimates for practice purposes only. They are not affiliated with,
        endorsed by, or guaranteed to match the official IELTS examination. IELTS is a trademark of its owners.</p>

      <h2>5. Subscriptions & Payment</h2>
      <p>Paid plans renew automatically unless cancelled. Pricing and features may change with notice.</p>

      <h2>6. Intellectual Property</h2>
      <p>The Service, including its software, design, and content, is owned by us or our licensors. You retain
        rights to content you submit, and grant us a limited license to process it to provide the Service.</p>

      <h2>7. Termination</h2>
      <p>We may suspend or terminate accounts that violate these Terms. You may delete your account anytime.</p>

      <h2>8. Disclaimer of Warranties</h2>
      <p>The Service is provided "as is" without warranties of any kind to the maximum extent permitted by law.</p>

      <h2>9. Limitation of Liability</h2>
      <p>To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential damages.</p>

      <h2>10. Governing Law</h2>
      <p>These Terms are governed by the laws of your country of residence unless otherwise required.</p>

      <h2>11. Changes</h2>
      <p>We may update these Terms. Continued use after changes constitutes acceptance.</p>

      <h2>12. Contact</h2>
      <p><a href={`mailto:${CONTACT}`}>{CONTACT}</a></p>
    </article>
  );
}
