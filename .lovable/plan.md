# Add /privacy + /terms routes and signup consent

Create dedicated SSR-friendly routes for the policies and a required acknowledgement checkbox on signup.

## New files

### `src/components/PolicyLayout.tsx`
Shared layout for both policy pages: black sticky header with `BrandLogo` and "Back" link, centered max-w-3xl content area with `font-display` h1, "Last updated" sub-line in `#C8F135`, prose styling (h2/h3/ul/links) via `[&_h2]:...` Tailwind selectors, and a footer linking back to `/privacy`, `/terms`, and `/`.

### `src/routes/privacy.tsx`
TanStack route at `/privacy` with its own `head()` (title, description, og:title, og:description). Renders the full 11-section Privacy Policy from the docx — same wording — using `<PolicyLayout>`. Section 3 explicitly covers marketing emails from pickleballgripdoctor.com and the unsubscribe right.

### `src/routes/terms.tsx`
Route at `/terms` with its own `head()`. Renders the full 15-section Terms of Use, including the Health & Fitness Disclaimer, marketing-emails clause (Section 5), and Florida governing law.

## Edits to `src/routes/auth.tsx`

1. Add state: `const [acceptedPolicies, setAcceptedPolicies] = useState(false);`
2. In `handleSubmit`, when `mode === "signup"`, guard:
   ```ts
   if (!acceptedPolicies) {
     setError("Please accept the Terms of Use and Privacy Policy to continue.");
     setBusy(false);
     return;
   }
   ```
3. In the form JSX, render the checkbox **only when `mode === "signup"`**, just above the submit button:
   ```tsx
   <label className="flex items-start gap-2 text-[11px] text-neutral-400 leading-snug">
     <input
       type="checkbox"
       checked={acceptedPolicies}
       onChange={(e) => setAcceptedPolicies(e.target.checked)}
       className="mt-0.5 accent-[#C8F135]"
     />
     <span>
       I agree to the{" "}
       <Link to="/terms" className="text-[#C8F135] hover:underline">Terms of Use</Link>{" "}
       and{" "}
       <Link to="/privacy" className="text-[#C8F135] hover:underline">Privacy Policy</Link>,
       and I understand I'll receive marketing emails from pickleballgripdoctor.com (unsubscribe anytime).
     </span>
   </label>
   ```
4. Disable the submit button on signup until the box is checked: `disabled={busy || (mode === "signup" && !acceptedPolicies)}`.
5. When toggling between signin/signup, reset `acceptedPolicies` to `false` along with the existing error/info reset.

## Footer links (optional polish)

Add subtle `Privacy` and `Terms` links to the bottom of `src/routes/auth.tsx` (under the existing "Continue without an account" link) so the policies are reachable from the auth screen without scrolling.

## Why separate routes (not modal/anchor)

Per TanStack route architecture: `/privacy` and `/terms` need their own SSR HTML, distinct `<title>`/`<meta description>`, and shareable URLs (legal review, app stores, email footers all link directly). Hash anchors on `/auth` would not be crawlable or shareable.

## Verification

- `/privacy` and `/terms` load standalone with their own page titles and headers.
- On `/auth`, switching to "Create account" reveals the consent checkbox; submit is disabled until checked; checkbox state resets when switching back to sign-in.
- Both checkbox links open in-app to the policy routes.
