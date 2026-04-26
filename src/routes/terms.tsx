import { createFileRoute } from "@tanstack/react-router";
import { PolicyLayout } from "@/components/PolicyLayout";

const TITLE = "Terms of Use — Don't Get Pickled";
const DESC =
  "The terms governing use of the Don't Get Pickled app, operated by Pickleball Grip Doctor.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <PolicyLayout title="Terms of Use" updated="April 26, 2026">
      <p>
        Welcome to Don't Get Pickled (the "Service"), operated by Pickleball
        Grip Doctor ("we," "us," "our"). By creating an account or using the
        Service, you agree to these Terms of Use ("Terms"). If you do not agree,
        do not use the Service.
      </p>

      <h2>1. Eligibility</h2>
      <p>
        You must be at least 13 years old (or the minimum age required in your
        jurisdiction) and able to form a binding contract to use the Service. By
        using the Service, you represent and warrant that you meet these
        requirements.
      </p>

      <h2>2. Your Account</h2>
      <ul>
        <li>You are responsible for keeping your login credentials confidential.</li>
        <li>You are responsible for all activity that occurs under your account.</li>
        <li>Notify us immediately of any unauthorized use or security breach.</li>
        <li>We may suspend or terminate accounts that violate these Terms.</li>
      </ul>

      <h2>3. Health &amp; Fitness Disclaimer</h2>
      <p>
        The Service provides general fitness, warm-up, and pickleball-related
        guidance for informational purposes only. It is not medical advice and
        is not a substitute for consultation with a qualified healthcare
        professional.
      </p>
      <p>
        Consult your physician before starting any exercise program, especially
        if you have an injury, medical condition, or are pregnant. You assume
        all risks associated with using the Service. Stop immediately and seek
        medical attention if you experience pain, dizziness, or discomfort.
      </p>

      <h2>4. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Service for any unlawful purpose or in violation of these Terms.</li>
        <li>Reverse engineer, decompile, or attempt to extract source code from the Service.</li>
        <li>
          Interfere with, disrupt, or attempt to gain unauthorized access to the
          Service or its infrastructure.
        </li>
        <li>Scrape, copy, or redistribute Service content without our written permission.</li>
        <li>Impersonate any person or entity, or misrepresent your affiliation.</li>
      </ul>

      <h2>5. Marketing Emails</h2>
      <p>
        By creating an account, you agree to receive marketing emails from
        Pickleball Grip Doctor (pickleballgripdoctor.com), including product
        updates, tips, and promotions. You may unsubscribe at any time using the
        link in any marketing email. Transactional emails (e.g., password reset,
        account notices) will continue regardless of your marketing preferences.
      </p>

      <h2>6. Intellectual Property</h2>
      <p>
        The Service, including its content, exercises, branding ("Don't Get
        Pickled"), logos, and software, is owned by Pickleball Grip Doctor and
        protected by intellectual property laws. We grant you a limited,
        non-exclusive, non-transferable, revocable license to use the Service
        for your personal, non-commercial use.
      </p>

      <h2>7. User Content</h2>
      <p>
        You retain ownership of any content you submit (e.g., notes, profile
        information). You grant us a worldwide, royalty-free license to host,
        store, and display your content as needed to operate the Service.
      </p>

      <h2>8. Third-Party Services</h2>
      <p>
        The Service may rely on third-party providers (e.g., authentication,
        hosting, email). We are not responsible for the practices of those
        providers. Your use of third-party services is governed by their own
        terms.
      </p>

      <h2>9. Termination</h2>
      <p>
        You may delete your account at any time. We may suspend or terminate
        your access to the Service, with or without notice, if we believe you
        have violated these Terms or for any other reason at our sole
        discretion. Sections that by their nature should survive termination
        (e.g., disclaimers, limitation of liability, indemnity, governing law)
        will continue to apply.
      </p>

      <h2>10. Disclaimers</h2>
      <p className="uppercase text-xs tracking-wide text-neutral-400">
        The Service is provided "as is" and "as available" without warranties of
        any kind, express or implied, including without limitation warranties of
        merchantability, fitness for a particular purpose, and non-infringement.
        We do not warrant that the Service will be uninterrupted, secure, or
        error-free.
      </p>

      <h2>11. Limitation of Liability</h2>
      <p className="uppercase text-xs tracking-wide text-neutral-400">
        To the maximum extent permitted by law, in no event will Pickleball Grip
        Doctor, its affiliates, officers, employees, or agents be liable for any
        indirect, incidental, special, consequential, or punitive damages, or
        any loss of profits, data, or goodwill arising out of your use of the
        Service. Our total liability for any claim related to the Service will
        not exceed one hundred U.S. dollars (US$100).
      </p>

      <h2>12. Indemnification</h2>
      <p>
        You agree to defend, indemnify, and hold harmless Pickleball Grip Doctor
        and its affiliates from any claims, damages, liabilities, costs, and
        expenses (including reasonable attorneys' fees) arising out of your use
        of the Service, your User Content, or your violation of these Terms.
      </p>

      <h2>13. Changes to the Service or Terms</h2>
      <p>
        We may modify or discontinue any part of the Service at any time. We may
        update these Terms from time to time. Material changes will be
        communicated through the app or by email. Continued use of the Service
        after changes take effect means you accept the updated Terms.
      </p>

      <h2>14. Governing Law</h2>
      <p>
        These Terms are governed by the laws of the State of Florida, USA,
        without regard to its conflict-of-laws principles. Any dispute arising
        from these Terms or the Service will be resolved exclusively in the
        state or federal courts located in Florida, and you consent to the
        personal jurisdiction of those courts.
      </p>

      <h2>15. Contact</h2>
      <p>
        Questions about these Terms? Contact us at:
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
