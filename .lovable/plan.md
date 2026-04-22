
# Fix Arm Circles Video Not Loading

The video file is valid and Vite serves it correctly (HTTP 200, `video/mp4`, 1.4 MB). The problem is on the client: iOS Safari (the user's viewport is iPhone-sized) commonly refuses to autoplay a `<video>` that mounts inside an accordion when React's `muted` prop isn't applied early enough, and the current element has no error/loading affordances so the user just sees nothing.

## Fix

Update `src/components/ExerciseCard.tsx`:

1. **Force muted at the DOM level (iOS autoplay fix).** Use a `ref` and set `videoRef.current.muted = true` in a `useEffect` whenever the card opens. React's `muted` JSX attribute is known to not always reflect to the DOM property in time, which is the #1 cause of silent autoplay failure on iOS.
2. **Call `.play()` explicitly when the card expands**, swallowing the returned promise (so a rejection doesn't bubble up). This guarantees a play attempt right after the user-initiated expand click — which Safari treats as a valid user gesture.
3. **Add `preload="metadata"`, `controls` as a fallback when autoplay is blocked, and `poster` fallback to the first frame.** Keep `autoPlay loop muted playsInline`. Adding native `controls` lets the user tap play if Safari still blocks autoplay.
4. **Add an `onError` handler** that flips local state to show a small "Video unavailable" message instead of an invisible failure, so future issues are visible.

No data or asset changes — the mp4 import and file are correct.

## Files Touched

- `src/components/ExerciseCard.tsx` — add `videoRef`, mount-time `muted` enforcement, explicit `.play()` on open, `controls`, `preload="metadata"`, `onError` fallback.

## Out of Scope

- Re-encoding the video (current H.264/AAC is already broadly compatible).
- Removing the audio track.
- Adding a poster image (would need a separate frame export).
