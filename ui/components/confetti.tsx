"use client";

import confetti from "canvas-confetti";

var count = 200;
var defaults = {
  origin: { y: 0.7 },
};

export default function Fire() {
  confetti({
    ...defaults,
    spread: 26,
    startVelocity: 55,
    particleCount: Math.floor(count * 0.25),
  });
  confetti({
    ...defaults,
    spread: 60,
    particleCount: Math.floor(count * 0.35),
  });
  confetti({
    ...defaults,
    spread: 100,
    particleCount: Math.floor(count * 0.2),
  });
  confetti({
    ...defaults,
    spread: 120,
    particleCount: Math.floor(count * 0.15),
  });
  confetti({
    ...defaults,
    spread: 120,
    particleCount: Math.floor(count * 0.05),
  });
}
