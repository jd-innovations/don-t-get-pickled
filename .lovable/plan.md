## Renumber + Reorder for Continuous 1–18 with Free Slots at 1–2, 6–7, 13–14

### Goal

Continuous numbering 1–18 across phases, with the first 2 of each phase being free:

- **Warm-Up**: 1–2 free, 3–5 locked
- **Mobility**: 6–7 free, 8–12 locked
- **Strength**: 13–14 free, 15–18 locked

This requires reordering within each phase so the free items render first.

### New Sequence

**Warm-Up**
1. Arm Circles — FREE
2. Shoulder Rolls — FREE
3. Wrist Circles & Flexion — locked
4. Seated March — locked
5. Ankle Circles — locked

**Mobility**
6. Seated Torso Twist — FREE
7. Seated Hip Circles — FREE
8. Reach-Back Shoulder Opener — locked
9. Wrist Prayer Stretch — locked
10. Paddle-Swing Simulation — locked
11. Neck Side Stretch — locked
12. Figure-4 Stretch — locked

**Strength**
13. Chair Stand — FREE
14. Heel Raises — FREE
15. Seated Hamstring Reach — locked
16. Seated Knee Extensions — locked
17. Seated Balance Hold — locked
18. Pelvic Tilts — locked

### Changes

- `src/data/exercises.ts`: reorder the array so each phase lists its 2 free items first, then locked. Update `number` fields to match (1–18). `isFree` flags stay the same per exercise (only 6 free total: Arm Circles, Shoulder Rolls, Torso Twist, Hip Circles, Chair Stand, Heel Raises).

No other files need changes — the landing page already filters by `phase` and respects the array order, and the lock gating already keys off `isFree`.
