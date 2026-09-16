import { performance } from "node:perf_hooks";
import { composeAvatarColors } from "@acandrade/ac-bot-avatar-utils";

const themes = [
  "robot",
  "face-minimal",
  "terminal",
  "capsule",
  "fruit",
  "emoji",
  "pixel",
  "arcade",
  "neko",
  "square",
  "initial",
];
const fruits = [
  "apple",
  "pear",
  "banana",
  "grape",
  "orange",
  "strawberry",
  "pineapple",
  "watermelon",
  "lemon",
  "mango",
  "cherry",
  "peach",
  "kiwi",
  "coconut",
  "papaya",
  "guava",
  "passionfruit",
  "acai",
];
const capsules = ["default", "antenna", "mohawk", "satellite"];
const backgrounds = ["transparent", "solid", "gradientLinear", "glass"];
const accessories = ["antenna", "headphones", "bow", "stars", "hearts", "none"];
const themesWithoutAccessories = new Set([
  "face-minimal",
  "fruit",
  "capsule",
  "arcade",
]);
const seedsArgument = process.argv.find((argument) =>
  argument.startsWith("--seeds=")
);
const seedsPerTheme = Math.max(
  100,
  Number.parseInt(seedsArgument?.split("=")[1] ?? "100", 10) || 100
);

const totals = {
  generated: 0,
  passedWithoutRepair: 0,
  repaired: 0,
  failed: 0,
};
const durations = [];
const byTheme = {};
const failureSamples = [];

for (const theme of themes) {
  const summary = {
    generated: 0,
    passedWithoutRepair: 0,
    repaired: 0,
    failed: 0,
    averageScore: 0,
    repairRoles: {},
  };
  let scoreTotal = 0;

  for (let index = 0; index < seedsPerTheme; index += 1) {
    const backgroundType = backgrounds[index % backgrounds.length];
    const accessory = accessories[index % accessories.length];
    const hasAccessory =
      !themesWithoutAccessories.has(theme) && accessory !== "none";
    const input = {
      theme,
      themeVariant:
        theme === "fruit"
          ? fruits[index % fruits.length]
          : theme === "capsule"
          ? capsules[index % capsules.length]
          : undefined,
      variant: theme === "face-minimal" ? "face" : "robot",
      background: backgroundType !== "transparent",
      backgroundType,
      eye: index % 7 === 0 ? "heart" : "normal",
      mouth: index % 9 === 0 ? "big_smile_open_tongue" : "smile",
      eyebrows: index % 3 === 0 ? "normal" : "none",
      details: index % 2 === 0 ? "blush" : "freckles",
      accessory,
      hasMouth: true,
      hasEyebrows: index % 3 === 0 && theme !== "capsule",
      hasDetails: theme !== "capsule",
      hasAccessory,
    };
    const startedAt = performance.now();
    const result = composeAvatarColors(`${theme}-audit-${index}`, input);
    durations.push(performance.now() - startedAt);

    totals.generated += 1;
    summary.generated += 1;
    scoreTotal += result.validation.score;
    if (!result.validation.passed) {
      totals.failed += 1;
      summary.failed += 1;
      if (failureSamples.length < 20) {
        failureSamples.push({
          seed: `${theme}-audit-${index}`,
          input,
          result,
        });
      }
    } else if (result.repaired) {
      totals.repaired += 1;
      summary.repaired += 1;
    } else {
      totals.passedWithoutRepair += 1;
      summary.passedWithoutRepair += 1;
    }
    for (const role of result.repairs) {
      summary.repairRoles[role] = (summary.repairRoles[role] ?? 0) + 1;
    }
  }

  summary.averageScore = Number((scoreTotal / summary.generated).toFixed(2));
  byTheme[theme] = summary;
}

durations.sort((left, right) => left - right);
const averageMilliseconds =
  durations.reduce((total, duration) => total + duration, 0) / durations.length;
const p95Milliseconds = durations[Math.floor(durations.length * 0.95)] ?? 0;
const report = {
  seedsPerTheme,
  totals,
  performance: {
    averageMilliseconds: Number(averageMilliseconds.toFixed(4)),
    p95Milliseconds: Number(p95Milliseconds.toFixed(4)),
  },
  failureSamples,
  byTheme,
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
if (totals.failed > 0) process.exitCode = 1;
