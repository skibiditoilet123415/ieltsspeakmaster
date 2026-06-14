import { createFileRoute } from "@tanstack/react-router";

const CONTACT = "nguyenthienbaoflo@gmail.com";
const UPDATED = "June 14, 2026";

export const Route = createFileRoute("/legal/refund")({
  head: () => ({
    meta: [
      { title: "Refund Policy — IELTS Speaking AI" },
      { name: "description", content: "Refund terms for IELTS Speaking AI Trainer subscriptions." },
      { property: "og:title", content: "Refund Policy — IELTS Speaking AI" },
      { property: "og:description", content: "Refund terms for IELTS Speaking AI Trainer subscriptions." },
    ],
  }),
  component: Refund,
});

function Refund() {
  return (
    <article className="prose prose-neutral dark:prose-invert mx-auto max-w-3xl">
      <h1>Refund Policy</h1>
      <p className="text-sm text-muted-foreground">Last updated: {UPDATED}</p>

      <h2>1. 7-Day Money-Back Guarantee</h2>
      <p>If you are not satisfied with your first paid subscription, contact us within 7 days of purchase for a full refund.</p>

      <h2>2. Renewals</h2>
      <p>Recurring renewal charges are non-refundable, but you can cancel anytime to stop future billing.</p>

      <h2>3. Exceptions</h2>
      <ul>
        <li>Accounts suspended for violating the Terms of Service are not eligible for refunds.</li>
        <li>Promotional or discounted purchases may be non-refundable; this will be stated at checkout.</li>
      </ul>

      <h2>4. How to Request</h2>
      <p>Email <a href={`mailto:${CONTACT}`}>{CONTACT}</a> from the address on your account with your order details. Refunds are processed within 5–10 business days to the original payment method.</p>

      <h2>5. Contact</h2>
      <p><a href={`mailto:${CONTACT}`}>{CONTACT}</a></p>
    </article>
  );
}
