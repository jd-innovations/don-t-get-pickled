# Bug Fix Plan

Apply three targeted fixes across the codebase.

## Bug 1 — Remove fake registration form (`src/routes/onboarding.tsx`)

The "register" stage renders a fake form (uncontrolled inputs, no auth call). Real auth lives in `/auth`, so remove this dead UI entirely.

- Line 36: change `type Stage = "register" | "questions" | "done"` → `type Stage = "questions" | "done"`.
- Line 87: change `useState<Stage>(isEdit ? "questions" : "register")` → `useState<Stage>("questions")`.
- Lines 140–151 (`back()`): in the `step === 0` branch, remove the inner `isEdit` check and always navigate away — `navigate({ to: isEdit ? search.from : "/dashboard" })`. This eliminates the orphaned `setStage("register")` call.
- Lines 194–196: delete the `{stage === "register" && <RegistrationForm ... />}` block.
- Lines 422–472: delete the entire `RegistrationForm` component.

## Bug 2 — Fix stale closure in keyboard shortcuts (`src/components/GuidedSession.tsx`)

The `useEffect` at lines 332–347 depends only on `[open]` but calls `skipExercise` and `handleClose`, which capture `exIdx`/state at mount time. Pressing `ArrowRight` always advances from index 0.

- Move the `skipExercise` `useCallback` (currently lines 349–351) to immediately before the keyboard `useEffect`.
- Add ref-mirrors right before the keyboard effect:
  ```ts
  const skipExRef = useRef(skipExercise);
  useEffect(() => { skipExRef.current = skipExercise; }, [skipExercise]);
  const handleCloseRef = useRef(handleClose);
  useEffect(() => { handleCloseRef.current = handleClose; }, [handleClose]);
  ```
- In the keyboard effect, call `skipExRef.current()` and `handleCloseRef.current()` and remove the `eslint-disable-next-line react-hooks/exhaustive-deps` comment. Dep array stays `[open]`, but it's now safe because refs always read the latest values.

## Bug 3 — Replace stale "Sign-in coming soon" copy (`src/components/GenerateWarmupSheet.tsx`)

Auth already exists. Replace the bottom paragraph with a real link to `/auth`.

- Add `import { Link } from "@tanstack/react-router";` to the imports.
- Replace the final `<p>Sign-in coming soon — your sessions will sync across devices.</p>` with:
  ```tsx
  <p className="text-[10px] text-neutral-600 text-center pt-2">
    <Link to="/auth" className="text-[#C8F135] hover:underline">Sign in</Link>
    {" "}to sync your sessions across devices.
  </p>
  ```

## Verification

- Onboarding loads straight into the questions stage; pressing Back on step 0 navigates to `/dashboard` (or `search.from` when editing).
- In a guided session, pressing `ArrowRight` advances exercises sequentially (1 → 2 → 3…), not always from 1.
- The Generate Warm-Up sheet shows a clickable "Sign in" link routing to `/auth`.
