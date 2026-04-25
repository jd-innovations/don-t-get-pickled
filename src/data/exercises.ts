import armCirclesImage from "@/assets/exercises/arm-circles.png";
import wristCirclesImage from "@/assets/exercises/wrist-circles.png";
import seatedHamstringReachImage from "@/assets/exercises/seated-hamstring-reach.png";
import seatedTorsoTwistImage from "@/assets/exercises/seated-torso-twist.png";
import chairStandImage from "@/assets/exercises/chair-stand.png";
import reachBackOpenerImage from "@/assets/exercises/reach-back-shoulder-opener.png";
import seatedHipCirclesImage from "@/assets/exercises/seated-hip-circles.png";

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
  video?: string;
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
    image: wristCirclesImage,
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
    image: seatedTorsoTwistImage,
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
    image: seatedHipCirclesImage,
  },
  {
    id: "knee-extensions",
    number: 5,
    name: "Seated Hamstring Reach",
    muscles: "Hamstrings · Lower Back · Hips",
    dose: "2×15s Each Leg",
    phase: "Strength",
    shortBenefit: "Loosens tight hamstrings that pull on your lower back",
    steps: [
      "Sit at the front edge of your chair, back tall.",
      "Extend your right leg straight out, heel on floor, toes pointing up.",
      "Hinge forward from the hips (not the lower back) and reach toward your toes.",
      "Hold ~15 seconds, feeling the stretch along the back of the thigh. Switch legs and repeat.",
    ],
    tip: "Tight hamstrings tug on the pelvis and overload the lower back — keeping them long protects your spine on every bend.",
    image: seatedHamstringReachImage,
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
  {
    id: "chair-stand",
    number: 7,
    name: "Chair Stand",
    muscles: "Quads · Glutes · Core",
    dose: "3×10 Reps",
    phase: "Strength",
    shortBenefit: "Builds the leg power for explosive starts and stops on court",
    steps: [
      "Sit tall at the front edge of your chair, feet flat hip-width apart, arms crossed over chest.",
      "Lean slightly forward from the hips and drive through your heels to stand all the way up.",
      "Stand tall, squeeze glutes at the top — no hands, no momentum.",
      "Lower slowly under control back to seated. Repeat for 10 reps, rest, then 2 more sets.",
    ],
    tip: "Chair stands rebuild the exact quad and glute power you need to push off, lunge, and stop safely on court — and protect your knees doing it.",
    image: chairStandImage,
  },
  {
    id: "reach-back-opener",
    number: 8,
    name: "Reach-Back Shoulder Opener",
    muscles: "Shoulders · Chest · Upper Back",
    dose: "3×10s Holds",
    phase: "Mobility",
    shortBenefit: "Opens tight shoulders and chest for a fuller swing arc",
    steps: [
      "Sit tall, place both hands behind your head with elbows pointing out wide.",
      "Gently draw your elbows back, opening your chest and squeezing your shoulder blades together.",
      "Breathe deeply and hold for ~10 seconds, feeling the stretch across your chest and front of shoulders. Release and repeat for 3 holds.",
    ],
    tip: "Hours of paddle grip and screen time round the shoulders forward — opening them back restores posture, swing arc, and overhead reach.",
    image: reachBackOpenerImage,
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
