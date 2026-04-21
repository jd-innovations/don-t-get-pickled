import armCirclesImage from "@/assets/exercises/arm-circles.png";

export type Phase = "Warm-Up" | "Mobility" | "Strength";

export interface Exercise {
  id: string;
  number: number;
  name: string;
  muscles: string;
  dose: string;
  phase: Phase;
  shortBenefit: string;
  steps: string[];
  tip: string;
  image?: string;
}

export const exercises: Exercise[] = [
  {
    id: "arm-circles",
    number: 1,
    name: "Arm Circles",
    muscles: "Shoulders · Deltoids · Rotator Cuff",
    dose: "10 Each Direction",
    phase: "Warm-Up",
    shortBenefit: "Warms up the rotator cuff before every overhead shot",
    steps: [
      "Sit tall, extend both arms out to sides at shoulder height.",
      "Make small forward circles, gradually growing larger over 10 reps.",
      "Reverse direction — small to large again.",
      "Finish with 5 big sweeping circles each way.",
    ],
    tip: "Directly warms up the rotator cuff — the #1 injured shoulder structure in pickleball.",
    image: armCirclesImage,
  },
  {
    id: "wrist-circles",
    number: 2,
    name: "Wrist Circles & Flexion",
    muscles: "Wrists · Forearms · Elbow Tendons",
    dose: "10 Each Wrist",
    phase: "Warm-Up",
    shortBenefit: "Prevents pickleball elbow before it starts",
    steps: [
      "Extend right arm forward, elbow slightly bent.",
      "Rotate wrist in a full circle — 10 clockwise, 10 counter-clockwise.",
      "Then flex and extend — 10 up/down pumps.",
      "Switch to left wrist and repeat.",
    ],
    tip: "Harvard Health names wrist prep as essential before any paddle session.",
  },
  {
    id: "torso-twist",
    number: 3,
    name: "Seated Torso Twist",
    muscles: "Obliques · Core · Lower Back",
    dose: "10 Each Side",
    phase: "Mobility",
    shortBenefit: "Builds rotational power for every forehand and backhand",
    steps: [
      "Sit tall, cross arms over chest.",
      "Rotate your entire upper body to the right as far as comfortable.",
      "Hold 1–2 seconds. Return to center. Twist left.",
      "Hips stay locked — all rotation from the torso.",
    ],
    tip: "Every forehand and backhand uses spinal rotation. This builds power without straining your lower back.",
  },
  {
    id: "hip-circles",
    number: 4,
    name: "Seated Hip Circles",
    muscles: "Hip Flexors · Pelvis · Lower Back",
    dose: "8 Each Direction",
    phase: "Mobility",
    shortBenefit: "Opens the hips for low dinks and quick lateral movement",
    steps: [
      "Sit at front edge of chair, hands lightly on thighs.",
      "Draw a slow circle with your pelvis — forward, right, back, left.",
      "Complete 8 circles one way then reverse.",
      "Move slowly — feel the hip joint open.",
    ],
    tip: "Immobile hips force your lower back to compensate on every bent shot.",
  },
  {
    id: "knee-extensions",
    number: 5,
    name: "Seated Knee Extensions",
    muscles: "Quadriceps · Knee Stabilizers",
    dose: "3×12 Each Leg",
    phase: "Strength",
    shortBenefit: "Builds the leg strength to stay low and move fast on court",
    steps: [
      "Sit upright, hands gripping chair sides lightly.",
      "Extend your right knee fully, squeezing the quad at the top. Hold 2 seconds.",
      "Lower slowly — don't drop the leg.",
      "Complete 12 reps right then 12 left. Rest 30 sec between sets.",
    ],
    tip: "Builds quad strength to absorb landing impact and stay low for ground balls.",
  },
  {
    id: "heel-raises",
    number: 6,
    name: "Heel Raises",
    muscles: "Calves · Achilles Tendon · Ankles",
    dose: "3×15 Reps",
    phase: "Strength",
    shortBenefit: "Protects your Achilles for every stop and start on court",
    steps: [
      "Sit upright, feet flat on floor hip-width apart.",
      "Press through balls of feet and raise both heels as high as possible.",
      "Squeeze calves at the top. Hold 1 second. Lower slowly.",
      "Progress: alternate single leg raises for greater challenge.",
    ],
    tip: "Strengthens the calf-Achilles complex — the shock absorber for every direction change on court.",
  },
];

export const phaseColor = (phase: Phase): string => {
  switch (phase) {
    case "Warm-Up":
      return "#f5a623";
    case "Mobility":
      return "#82a0e0";
    case "Strength":
      return "#C8F135";
  }
};
