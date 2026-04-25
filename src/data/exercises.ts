import armCirclesImage from "@/assets/exercises/arm-circles.png";
import wristCirclesImage from "@/assets/exercises/wrist-circles.png";
import seatedHamstringReachImage from "@/assets/exercises/seated-hamstring-reach.png";
import seatedTorsoTwistImage from "@/assets/exercises/seated-torso-twist.png";
import chairStandImage from "@/assets/exercises/chair-stand.png";
import reachBackOpenerImage from "@/assets/exercises/reach-back-shoulder-opener.png";
import seatedHipCirclesImage from "@/assets/exercises/seated-hip-circles.png";
import heelRaisesImage from "@/assets/exercises/heel-raises.png";
import shoulderRollsImage from "@/assets/exercises/shoulder-rolls.png";
import seatedMarchImage from "@/assets/exercises/seated-march.png";
import wristPrayerStretchImage from "@/assets/exercises/wrist-prayer-stretch.png";
import ankleCirclesImage from "@/assets/exercises/ankle-circles.png";
import paddleSwingImage from "@/assets/exercises/paddle-swing-simulation.png";
import seatedKneeExtensionsImage from "@/assets/exercises/seated-knee-extensions.png";
import neckSideStretchImage from "@/assets/exercises/neck-side-stretch.png";
import seatedBalanceHoldImage from "@/assets/exercises/seated-balance-hold.png";

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
    image: heelRaisesImage,
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
  {
    id: "shoulder-rolls",
    number: 9,
    name: "Shoulder Rolls",
    muscles: "Shoulders · Upper Traps · Neck",
    dose: "10 Each Direction",
    phase: "Warm-Up",
    shortBenefit: "Releases shoulder tension and primes the upper body for a free swing",
    steps: [
      "Sit tall with feet flat, arms hanging relaxed at your sides.",
      "Lift your shoulders up, roll them back, and lower down — 10 slow reps.",
      "Reverse direction: roll forward, up, back, and down for 10 more.",
      "Move smooth and steady, breathing deep to release tension.",
    ],
    tip: "Loose shoulders restore your full swing arc and help prevent the neck and rotator-cuff strain that builds up from grip and screen time.",
    image: shoulderRollsImage,
  },
  {
    id: "seated-march",
    number: 10,
    name: "Seated March",
    muscles: "Hip Flexors · Core · Quads",
    dose: "20 Total Reps",
    phase: "Warm-Up",
    shortBenefit: "Activates hips and core to prime you for first-step quickness",
    steps: [
      "Sit tall with feet flat, hands at your sides or holding the seat.",
      "Lift one knee up toward your chest with control — drive the opposite arm up.",
      "Lower the leg and switch sides smoothly, keeping a steady rhythm.",
      "Continue alternating for 20 total reps. Breathe steady, stay tall.",
    ],
    tip: "Wakes up the hip flexors, core, and circulation — the exact systems you need firing for first-step quickness and longer rallies.",
    image: seatedMarchImage,
  },
  {
    id: "wrist-prayer",
    number: 11,
    name: "Wrist Prayer Stretch",
    muscles: "Wrists · Forearms · Elbow Tendons",
    dose: "3×15s Holds",
    phase: "Mobility",
    shortBenefit: "The final defense against pickleball elbow",
    steps: [
      "Press your palms together at chest height, elbows bent and out wide.",
      "Gently lower your hands toward your lap, keeping palms pressed together.",
      "Feel the stretch through your wrists and forearms. Hold ~15 seconds.",
      "Breathe deep, release, and repeat for 3 holds.",
    ],
    tip: "Lengthens the forearm flexors that grip the paddle all game — your final defense against pickleball elbow and wrist strain.",
    image: wristPrayerStretchImage,
  },
  {
    id: "ankle-circles",
    number: 12,
    name: "Ankle Circles",
    muscles: "Ankles · Calves · Achilles",
    dose: "10 Each Direction",
    phase: "Warm-Up",
    shortBenefit: "Mobile ankles, quicker you",
    steps: [
      "Lift one foot slightly off the ground and extend your leg.",
      "Rotate your ankle in a smooth circle — keep your knee steady.",
      "After 10 circles, reverse the direction for 10 more.",
      "Switch to the other foot and repeat. Keep movements controlled and consistent.",
    ],
    tip: "Mobile ankles support better footwork, reduce sprain risk, and keep you light on your feet for quick lateral moves.",
    image: ankleCirclesImage,
  },
  {
    id: "paddle-swing",
    number: 13,
    name: "Paddle-Swing Simulation",
    muscles: "Shoulders · Core · Forearms",
    dose: "10 Each Side",
    phase: "Mobility",
    shortBenefit: "Practice the swing, perfect the game",
    steps: [
      "Sit tall with core engaged — feet flat, chest up, shoulders back.",
      "Rotate your torso and draw the paddle (or hand) back as if loading a shot.",
      "Swing forward smoothly, rotating through your core. Keep movement controlled.",
      "Return to ready position. Repeat on both sides to build rhythm and timing.",
    ],
    tip: "Grooves the exact swing pattern your shoulders, core, and hands need on court — better mechanics, better control, fewer injuries.",
    image: paddleSwingImage,
  },
  {
    id: "seated-knee-extensions",
    number: 14,
    name: "Seated Knee Extensions",
    muscles: "Quads · Knees · Hip Flexors",
    dose: "3×10 Each Leg",
    phase: "Strength",
    shortBenefit: "Strong quads, quicker steps, better plays",
    steps: [
      "Sit tall with back straight, core engaged, hands on the sides of the chair.",
      "Straighten one leg until fully extended. Squeeze your quad at the top.",
      "Hold for a moment — keep the leg straight and strong.",
      "Lower with control. Repeat with the other leg, keeping it smooth.",
    ],
    tip: "Builds the quad strength that protects your knees and powers every push-off, lunge, and stop on court.",
    image: seatedKneeExtensionsImage,
  },
  {
    id: "neck-side-stretch",
    number: 15,
    name: "Neck Side Stretch",
    muscles: "Neck · Upper Traps · Shoulders",
    dose: "2×15s Each Side",
    phase: "Mobility",
    shortBenefit: "Loosen up, stay focused, play better",
    steps: [
      "Sit tall with back straight and shoulders relaxed.",
      "Use one hand to gently guide your head toward that shoulder.",
      "Hold ~15 seconds, breathing deep and letting tension release.",
      "Return to center and switch sides. Repeat for 2 holds each side.",
    ],
    tip: "Releases the neck and upper-trap tension that builds up from screen time and tracking the ball — better mobility, sharper focus, smoother turns on court.",
    image: neckSideStretchImage,
  },
  {
    id: "seated-balance-hold",
    number: 16,
    name: "Seated Balance Hold",
    muscles: "Core · Hip Flexors · Stabilizers",
    dose: "3×15s Each Leg",
    phase: "Strength",
    shortBenefit: "Better balance, stronger game",
    steps: [
      "Sit tall with chest up and core tight.",
      "Lift one foot off the ground and find your balance.",
      "Hold the position — breathe and stay in control.",
      "Lower with control and switch legs. Repeat for 3 holds each side.",
    ],
    tip: "Builds the seated core stability that translates to stronger split-steps, lunges, and quick pivots on court.",
    image: seatedBalanceHoldImage,
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
