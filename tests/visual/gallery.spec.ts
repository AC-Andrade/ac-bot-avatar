import { expect, test } from "@playwright/test";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const expectedBySize = 204;

test.setTimeout(60_000);

test("renders every asset at 32, 64 and 128 px without layout clipping", async ({
  page,
}) => {
  await page.goto(pathToFileURL(resolve("docs", "gallery", "index.html")).href);

  for (const size of [32, 64, 128]) {
    const cards = page.locator(`[data-size="${size}"]`);
    await expect(cards).toHaveCount(expectedBySize);

    for (const svg of await cards.locator("svg").all()) {
      const box = await svg.boundingBox();
      expect(box, `${size}px avatar is visible`).not.toBeNull();
      expect(box?.width).toBe(size);
      expect(box?.height).toBe(size);
    }
  }

  const fittedFaces = page.locator('[data-category="fruit-face-fit"]');
  await expect(fittedFaces).toHaveCount(54);

  const intelligentColors = page.locator(
    '[data-category="color-composition-v3"]'
  );
  await expect(intelligentColors).toHaveCount(132);

  for (const card of await fittedFaces.all()) {
    const fruitKind = await card.getAttribute("data-asset");
    const size = await card.getAttribute("data-size");
    const label = `${fruitKind} Fruit Bot at ${size}px`;
    const screen = await card
      .locator("[data-fruit-kind] > g > path:last-child")
      .boundingBox();
    const face = await card.locator('[data-ac-bot-part="face"]').boundingBox();
    const eyes = await card
      .locator('[data-ac-bot-face-part="eyes"]')
      .boundingBox();
    const mouth = await card
      .locator('[data-ac-bot-face-part="mouth"]')
      .boundingBox();

    expect(screen, `${label} visor is visible`).not.toBeNull();
    expect(face, `${label} face is visible`).not.toBeNull();
    expect(eyes, `${label} eyes are visible`).not.toBeNull();
    expect(mouth, `${label} mouth is visible`).not.toBeNull();

    const marginX = screen!.width * 0.04;
    const marginY = screen!.height * 0.04;
    const minimumGap = screen!.height * 0.04;
    for (const [name, part] of [
      ["face", face],
      ["eyes", eyes],
      ["mouth", mouth],
    ] as const) {
      expect(
        part!.x,
        `${label} ${name} has left visor clearance`
      ).toBeGreaterThanOrEqual(screen!.x + marginX);
      expect(
        part!.y,
        `${label} ${name} has top visor clearance`
      ).toBeGreaterThanOrEqual(screen!.y + marginY);
      expect(
        part!.x + part!.width,
        `${label} ${name} has right visor clearance`
      ).toBeLessThanOrEqual(screen!.x + screen!.width - marginX);
      expect(
        part!.y + part!.height,
        `${label} ${name} has bottom visor clearance`
      ).toBeLessThanOrEqual(screen!.y + screen!.height - marginY);
    }
    expect(
      mouth!.y - (eyes!.y + eyes!.height),
      `${label} eyes and mouth keep a vertical safety gap`
    ).toBeGreaterThanOrEqual(minimumGap);
  }

  const arcadeCards = page.locator('[data-category="arcade-colors"]');
  await expect(arcadeCards).toHaveCount(12);

  for (const card of await arcadeCards.all()) {
    const screen = await card
      .locator("[data-arcade-source] > path:last-child")
      .boundingBox();
    const face = await card.locator('[data-ac-bot-part="face"]').boundingBox();
    const eyes = await card
      .locator('[data-ac-bot-face-part="eyes"]')
      .boundingBox();
    const mouth = await card
      .locator('[data-ac-bot-face-part="mouth"]')
      .boundingBox();

    expect(screen, "Arcade visor is visible").not.toBeNull();
    expect(face, "Arcade face is visible").not.toBeNull();
    expect(eyes, "Arcade eyes are visible").not.toBeNull();
    expect(mouth, "Arcade mouth is visible").not.toBeNull();

    const marginX = screen!.width * 0.04;
    const marginY = screen!.height * 0.04;
    const minimumGap = screen!.height * 0.04;
    for (const [name, part] of [
      ["face", face],
      ["eyes", eyes],
      ["mouth", mouth],
    ] as const) {
      expect(
        part!.x,
        `${name} has left Arcade clearance`
      ).toBeGreaterThanOrEqual(screen!.x + marginX);
      expect(
        part!.y,
        `${name} has top Arcade clearance`
      ).toBeGreaterThanOrEqual(screen!.y + marginY);
      expect(
        part!.x + part!.width,
        `${name} has right Arcade clearance`
      ).toBeLessThanOrEqual(screen!.x + screen!.width - marginX);
      expect(
        part!.y + part!.height,
        `${name} has bottom Arcade clearance`
      ).toBeLessThanOrEqual(screen!.y + screen!.height - marginY);
    }
    expect(
      mouth!.y - (eyes!.y + eyes!.height),
      "Arcade eyes and mouth keep a vertical safety gap"
    ).toBeGreaterThanOrEqual(minimumGap);
  }

  const fittedCapsuleFaces = page.locator('[data-category="capsule-face-fit"]');
  await expect(fittedCapsuleFaces).toHaveCount(12);

  for (const card of await fittedCapsuleFaces.all()) {
    const capsuleKind = await card.getAttribute("data-asset");
    const screen = await card.locator("[data-capsule-visor]").boundingBox();
    const face = await card.locator('[data-ac-bot-part="face"]').boundingBox();
    const eyes = await card
      .locator('[data-ac-bot-face-part="eyes"]')
      .boundingBox();
    const mouth = await card
      .locator('[data-ac-bot-face-part="mouth"]')
      .boundingBox();

    expect(screen, `${capsuleKind} Capsule visor is visible`).not.toBeNull();
    expect(face, `${capsuleKind} Capsule face is visible`).not.toBeNull();
    expect(eyes, `${capsuleKind} Capsule eyes are visible`).not.toBeNull();
    expect(mouth, `${capsuleKind} Capsule mouth is visible`).not.toBeNull();

    const marginX = screen!.width * 0.04;
    const marginY = screen!.height * 0.04;
    const minimumGap = screen!.height * 0.04;
    for (const [name, part] of [
      ["face", face],
      ["eyes", eyes],
      ["mouth", mouth],
    ] as const) {
      expect
        .soft(part!.x, `${capsuleKind} ${name} has left Capsule clearance`)
        .toBeGreaterThanOrEqual(screen!.x + marginX);
      expect
        .soft(part!.y, `${capsuleKind} ${name} has top Capsule clearance`)
        .toBeGreaterThanOrEqual(screen!.y + marginY);
      expect
        .soft(
          part!.x + part!.width,
          `${capsuleKind} ${name} has right Capsule clearance`
        )
        .toBeLessThanOrEqual(screen!.x + screen!.width - marginX);
      expect
        .soft(
          part!.y + part!.height,
          `${capsuleKind} ${name} has bottom Capsule clearance`
        )
        .toBeLessThanOrEqual(screen!.y + screen!.height - marginY);
    }
    expect
      .soft(
        mouth!.y - (eyes!.y + eyes!.height),
        `${capsuleKind} eyes and mouth keep a vertical safety gap`
      )
      .toBeGreaterThanOrEqual(minimumGap);
  }

  const classicRobotFaces = page.locator('[data-category="robot-face-safety"]');
  await expect(classicRobotFaces).toHaveCount(9);

  for (const card of await classicRobotFaces.all()) {
    const theme = await card.getAttribute("data-asset");
    const screen = await card.locator("[data-ac-bot-visor]").boundingBox();
    const eyes = await card
      .locator('[data-ac-bot-face-part="eyes"]')
      .boundingBox();
    const mouth = await card
      .locator('[data-ac-bot-face-part="mouth"]')
      .boundingBox();

    expect(screen, `${theme} visor is visible`).not.toBeNull();
    expect(eyes, `${theme} eyes are visible`).not.toBeNull();
    expect(mouth, `${theme} mouth is visible`).not.toBeNull();

    const marginX = screen!.width * 0.04;
    const marginY = screen!.height * 0.04;
    const minimumGap = screen!.height * 0.04;
    const left = Math.min(eyes!.x, mouth!.x);
    const right = Math.max(eyes!.x + eyes!.width, mouth!.x + mouth!.width);

    expect(
      left,
      `${theme} face has left visor clearance`
    ).toBeGreaterThanOrEqual(screen!.x + marginX);
    expect(
      right,
      `${theme} face has right visor clearance`
    ).toBeLessThanOrEqual(screen!.x + screen!.width - marginX);
    expect(
      eyes!.y,
      `${theme} face has top visor clearance`
    ).toBeGreaterThanOrEqual(screen!.y + marginY);
    expect(
      mouth!.y + mouth!.height,
      `${theme} face has bottom visor clearance`
    ).toBeLessThanOrEqual(screen!.y + screen!.height - marginY);
    expect(
      mouth!.y - (eyes!.y + eyes!.height),
      `${theme} eyes and mouth keep a vertical safety gap`
    ).toBeGreaterThanOrEqual(minimumGap);
  }

  for (const [category, expectedCount, visorSelector] of [
    ["robot-face-gap", 9, "[data-ac-bot-visor]"],
    ["arcade-face-gap", 3, "[data-arcade-source] > path:last-child"],
    ["capsule-face-gap", 12, "[data-capsule-visor]"],
    ["fruit-face-gap", 54, "[data-fruit-kind] > g > path:last-child"],
  ] as const) {
    const cards = page.locator(`[data-category="${category}"]`);
    await expect(cards).toHaveCount(expectedCount);

    for (const card of await cards.all()) {
      const asset = await card.getAttribute("data-asset");
      const screen = await card.locator(visorSelector).boundingBox();
      const eyes = await card
        .locator('[data-ac-bot-face-part="eyes"]')
        .boundingBox();
      const mouth = await card
        .locator('[data-ac-bot-face-part="mouth"]')
        .boundingBox();
      const label = `${category}:${asset}`;

      expect(screen, `${label} visor is visible`).not.toBeNull();
      expect(eyes, `${label} eyes are visible`).not.toBeNull();
      expect(mouth, `${label} mouth is visible`).not.toBeNull();

      const marginX = screen!.width * 0.04;
      const marginY = screen!.height * 0.04;
      const left = Math.min(eyes!.x, mouth!.x);
      const right = Math.max(eyes!.x + eyes!.width, mouth!.x + mouth!.width);

      expect(left, `${label} has left visor clearance`).toBeGreaterThanOrEqual(
        screen!.x + marginX
      );
      expect(right, `${label} has right visor clearance`).toBeLessThanOrEqual(
        screen!.x + screen!.width - marginX
      );
      expect(
        eyes!.y,
        `${label} has top visor clearance`
      ).toBeGreaterThanOrEqual(screen!.y + marginY);
      expect(
        mouth!.y + mouth!.height,
        `${label} has bottom visor clearance`
      ).toBeLessThanOrEqual(screen!.y + screen!.height - marginY);
      expect(
        mouth!.y - (eyes!.y + eyes!.height),
        `${label} keeps the minimum eye-to-mouth gap`
      ).toBeGreaterThanOrEqual(marginY);
    }
  }

  await expect(page).toHaveScreenshot("asset-gallery.png", {
    fullPage: true,
    animations: "disabled",
    maxDiffPixelRatio: 0.001,
  });
});
