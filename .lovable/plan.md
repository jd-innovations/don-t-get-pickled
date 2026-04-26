## Replace ▶ emoji with Play icon on "Start Guided Session" button

The button in `src/routes/dashboard.tsx` currently uses a text play character (`▶`) which renders as an emoji on mobile. Replace it with the `Play` lucide icon (already used elsewhere in the project, e.g. `GenerateWarmupSheet.tsx`) for consistent rendering across devices.

### Change
**File:** `src/routes/dashboard.tsx`

1. Add `Play` to the existing lucide-react import:
   `import { Home, Calendar, User, Sparkles, Play } from "lucide-react";`

2. Replace the button content:
   - From: `<span aria-hidden>▶</span> START GUIDED SESSION`
   - To: `<Play className="w-4 h-4" /> START GUIDED SESSION`

No other changes.