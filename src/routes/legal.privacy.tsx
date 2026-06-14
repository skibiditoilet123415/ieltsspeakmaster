import { createFileRoute } from "@tanstack/react-router";

const CONTACT = "nguyenthienbaoflo@gmail.com";
const UPDATED = "June 14, 2026";

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — IELTS Speaking AI" },
      { name: "description", content: "How IELTS Speaking AI Trainer collects, uses, and protects your personal data." },
      { property: "og:title", content: "Privacy Policy — IELTS Speaking AI" },
      { property: "og:description", content: "How IELTS Speaking AI Trainer collects, uses, and protects your personal data." },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <article className="prose prose-neutral dark:prose-invert mx-auto max-w-3xl">
      <h1>Privacy Policy</h1>
      <p className="text-sm text-muted-foreground">Last updated: {UPDATED}</p>

      <p>
        IELTS Speaking AI Trainer ("we", "us", "our") respects your privacy. This Privacy Policy explains
        what information we collect, how we use it, and your rights regarding that information when you
        use our website and services (the "Service").
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li><strong>Account data:</strong> name, email address, password (hashed), and authentication provider details.</li>
        <li><strong>Practice data:</strong> answers, transcripts, voice recordings, band scores, vocabulary, and progress.</li>
        <li><strong>Usage data:</strong> device type, browser, IP address, pages viewed, and interaction events.</li>
        <li><strong>Payment data:</strong> processed by third-party payment providers; we do not store full card details.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>Provide, operate, and improve the Service (including AI scoring and feedback).</li>
        <li>Personalize your learning experience and track progress.</li>
        <li>Send transactional emails and, with consent, product updates.</li>
        <li>Detect, prevent, and address fraud, abuse, and security issues.</li>
        <li>Comply with legal obligations.</li>
      </ul>

      <h2>3. AI Processing</h2>
      <p>
        Your spoken or written answers may be sent to third-party AI providers strictly for the purpose of
        scoring and generating feedback. We do not sell your content and we do not use it to train public models.
      </p>

      <h2>4. Sharing</h2>
      <p>We share data only with: authentication, hosting, analytics, payment, and AI providers under contract,
        and when required by law.</p>

      <h2>5. Data Retention</h2>
      <p>We keep your account data while your account is active. You can request deletion at any time.</p>

      <h2>6. Your Rights</h2>
      <p>Depending on your location, you may have rights to access, correct, export, or delete your data, and to
        object to or restrict certain processing (GDPR, CCPA, and similar laws).</p>

      <h2>7. Security</h2>
      <p>We use industry-standard safeguards including encryption in transit, hashed passwords, and row-level
        access controls. No system is 100% secure.</p>

      <h2>8. Children</h2>
      <p>The Service is not directed to children under 13. We do not knowingly collect data from children.</p>

      <h2>9. International Transfers</h2>
      <p>Your data may be processed in countries other than your own. We rely on lawful transfer mechanisms.</p>

      <h2>10. Changes</h2>
      <p>We may update this Policy. Material changes will be announced in the app or by email.</p>

      <h2>11. Contact</h2>
      <p>Questions or requests: <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.</p>
    </article>
  );
}
