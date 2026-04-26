import { createFileRoute } from "@tanstack/react-router";
import { PolicyLayout } from "@/components/PolicyLayout";

const TITLE = "Privacy Policy — Don't Get Pickled";
const DESC =
  "How Don't Get Pickled, operated by Pickleball Grip Doctor, collects, uses, and protects your information.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PolicyLayout title="Privacy Policy" updated="April 26, 2026">
      <p>
        This Privacy Policy explains how Don't Get Pickled ("we," "us," or
        "our"), an app operated by Pickleball Grip Doctor (
        <a
          href="https://pickleballgripdoctor.com"
          target="_blank"
          rel="noreferrer"
        >
          pickleballgripdoctor.com
        </a>
        ), collects, uses, and protects your information when you use our app
        and related services (the "Service").
      </p>

      <h2>1. Information We Collect</h2>
      <h3>Account information</h3>
      <p>
        When you create an account, we collect your email address, password
        (stored securely as a hash), and an optional display name.
      </p>
      <h3>Profile and warm-up data</h3>
      <p>
        To personalize your warm-up plan, we collect the information you provide
        during onboarding, including biological sex, age range, fitness level,
        play frequency, current injuries or pain points, and goals.
      </p>
      <h3>Usage and session data</h3>
      <p>
        We store your completed warm-up sessions, exercises, schedule
        preferences, and progress so you can sync across devices.
      </p>
      <h3>Technical data</h3>
      <p>
        We automatically collect basic technical information such as device
        type, browser, IP address, and approximate location for security,
        analytics, and abuse prevention.
      </p>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>Provide, personalize, and improve your warm-up experience.</li>
        <li>Authenticate your account and keep it secure.</li>
        <li>Sync your sessions and progress across devices.</li>
        <li>
          Send transactional emails (account confirmation, password reset,
          important service updates).
        </li>
        <li>
          Send marketing emails about products, tips, and offers from Pickleball
          Grip Doctor (pickleballgripdoctor.com) — see Section 3.
        </li>
        <li>
          Diagnose issues, prevent fraud, and comply with legal obligations.
        </li>
      </ul>

      <h2>3. Marketing Emails</h2>
      <p>
        By creating an account, you agree that we may send you marketing emails
        from Pickleball Grip Doctor (pickleballgripdoctor.com), including
        product news, training tips, promotions, and special offers.
      </p>
      <p>
        You can unsubscribe at any time by clicking the "unsubscribe" link at
        the bottom of any marketing email, or by contacting us at the address in
        Section 11. Unsubscribing from marketing emails does not affect
        transactional emails required to operate your account.
      </p>

      <h2>4. How We Share Information</h2>
      <p>
        We do not sell your personal information. We share information only
        with:
      </p>
      <ul>
        <li>
          Service providers who help us operate the app (hosting,
          authentication, email delivery, analytics) under confidentiality
          obligations.
        </li>
        <li>
          Pickleball Grip Doctor for the marketing communications described in
          Section 3.
        </li>
        <li>
          Authorities when required by law, subpoena, or to protect rights,
          safety, or property.
        </li>
        <li>
          A successor entity in the event of a merger, acquisition, or sale of
          assets.
        </li>
      </ul>

      <h2>5. Data Retention</h2>
      <p>
        We keep your account and profile data for as long as your account is
        active. If you delete your account, we delete or anonymize your personal
        data within a reasonable period, except where retention is required by
        law (e.g., tax, fraud prevention).
      </p>

      <h2>6. Security</h2>
      <p>
        We use industry-standard safeguards including encryption in transit
        (HTTPS), secure password hashing, and access controls. No system is 100%
        secure, and you use the Service at your own risk.
      </p>

      <h2>7. Your Rights</h2>
      <p>
        Depending on where you live, you may have rights to access, correct,
        delete, export, or restrict use of your personal information. To
        exercise these rights, contact us at the address in Section 11. We will
        respond within the time required by applicable law.
      </p>

      <h2>8. Children's Privacy</h2>
      <p>
        The Service is not directed to children under 13 (or the minimum age
        required in your jurisdiction). We do not knowingly collect personal
        information from children. If you believe a child has provided us with
        personal information, contact us and we will delete it.
      </p>

      <h2>9. International Users</h2>
      <p>
        Your information may be processed in the United States or other
        countries where we or our service providers operate. By using the
        Service, you consent to such transfers.
      </p>

      <h2>10. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The "Last updated"
        date at the top reflects the latest version. Material changes will be
        communicated through the app or by email.
      </p>

      <h2>11. Contact Us</h2>
      <p>
        Questions, requests, or unsubscribe issues? Contact us at:
        <br />
        Pickleball Grip Doctor
        <br />
        Website:{" "}
        <a
          href="https://pickleballgripdoctor.com"
          target="_blank"
          rel="noreferrer"
        >
          pickleballgripdoctor.com
        </a>
        <br />
        Email:{" "}
        <a href="mailto:support@pickleballgripdoctor.com">
          support@pickleballgripdoctor.com
        </a>
      </p>
    </PolicyLayout>
  );
}
