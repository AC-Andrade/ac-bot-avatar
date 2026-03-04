const fs = require("fs");
const path = require("path");

const PACKAGES_DIR = path.resolve(__dirname, "..");
const SVGS_DIR = path.resolve(PACKAGES_DIR, "svgs");
const SRC_DIR = path.resolve(PACKAGES_DIR, "src");

const categories = ["eyes", "mouths"];
// 'mouth' dir in svgs, 'mouths' dir in src

// Helper to capitalize first letter
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Helper to convert snake_case to PascalCase
const toPascalCase = (str) => {
  return str.split("_").map(capitalize).join("");
};

// Main processing function
function processCategory(category) {
  const inputDir = path.join(SVGS_DIR, category);
  // Map 'mouth' -> 'mouths' for output directory
  const outputCategory = category === "mouth" ? "mouths" : category;
  const outputDir = path.join(SRC_DIR, outputCategory);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = fs
    .readdirSync(inputDir)
    .filter((file) => file.endsWith(".svg"));
  const exports = [];

  files.forEach((file) => {
    const filePath = path.join(inputDir, file);
    let svgContent = fs.readFileSync(filePath, "utf8");

    // Extract the relevant parts:
    // 1. Remove XML declaration and Doctype
    svgContent = svgContent
      .replace(/<\?xml.*?\?>/g, "")
      .replace(/<!DOCTYPE.*?>/g, "");

    // 2. We want to preserve the viewBox
    const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
    const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 3325 2563";

    // 3. Clean up the content
    // Remove the <svg> tags to get inner content
    let innerContent = svgContent
      .replace(/<svg[^>]*>/, "")
      .replace(/<\/svg>/, "");

    // 4. "React-ify" attributes
    innerContent = innerContent
      .replace(/xmlns:xlink/g, "xmlnsXlink")
      .replace(/xml:space/g, "xmlSpace")
      .replace(/xmlns:serif/g, "xmlnsSerif")
      // .replace(/serif:id/g, 'id') // simplify serif:id - CAUSES DUPLICATE ID
      .replace(/serif:id="[^"]*"/g, "") // remove serif:id
      .replace(/xlink:href/g, "href")
      .replace(/fill-rule/g, "fillRule")
      .replace(/clip-rule/g, "clipRule")
      .replace(/stroke-linejoin/g, "strokeLinejoin")
      .replace(/stroke-miterlimit/g, "strokeMiterlimit")
      .replace(/fill-opacity/g, "fillOpacity")
      .replace(/className=/g, "className=")
      // Remove style strings and replace with objects or just strip them if possible
      .replace(/style="([^"]*)"/g, (match, styleStr) => {
        // Check if this style has opacity 0 or none
        if (
          styleStr.includes("fill-opacity:0") ||
          styleStr.includes("fill:none")
        ) {
          return 'fill="none"';
        }

        // Replace target colors with currentColor
        let newStyle = styleStr;
        const featureColors = [
          /#61f3f7/gi,
          /#5ffbf9/gi,
          /#44ffff/gi,
          /#00f0ff/gi,
          /#b6aef1/gi,
        ]; // Added #b6aef1 as some assets use it for features

        if (category === "emojis") {
          newStyle = newStyle.replace(/#FCBC34/gi, "currentColor");
        } else {
          featureColors.forEach((reg) => {
            newStyle = newStyle.replace(reg, "currentColor");
          });
        }

        // Convert to React style object string
        const styleObj = newStyle.split(";").reduce((acc, rule) => {
          const [key, val] = rule.split(":");
          if (key && val) {
            const reactKey = key
              .trim()
              .replace(/-./g, (x) => x[1].toUpperCase());
            acc += `${reactKey}: '${val.trim()}',`;
          }
          return acc;
        }, "");
        return `style={{${styleObj}}}`;
      })
      // Also handle direct fill/stroke attributes
      .replace(/(fill|stroke)="([^"]+)"/g, (match, attr, colorVal) => {
        const c = colorVal.toLowerCase();
        const featureHexes = [
          "#61f3f7",
          "#5ffbf9",
          "#44ffff",
          "#00f0ff",
          "#b6aef1",
        ];

        if (featureHexes.includes(c)) {
          return `${attr}="currentColor"`;
        }
        // Emoji base color
        if (c === "#fcbc34" && category === "emojis") {
          return `${attr}="currentColor"`;
        }
        return match;
      });

    // 5. Generate Component Name and File Name
    const basename = file.replace(".svg", "");
    const slugName = basename.toLowerCase().replace(/\s+/g, "_");

    let suffix = "";
    if (category === "eyes") suffix = "Eye";
    else if (category === "mouth") suffix = "Mouth";
    else if (category === "emojis") suffix = "Emoji";

    const componentName = toPascalCase(slugName) + suffix;

    // 6. Create File Content
    const fileContent = `import React from 'react';

export const ${componentName} = (props: React.SVGProps<SVGGElement>) => (
  <g
    {...props}
  >
    ${innerContent}
  </g>
);
`;

    fs.writeFileSync(path.join(outputDir, `${slugName}.tsx`), fileContent);

    console.log(`Generated ${componentName} from ${file}`);
    exports.push({ name: slugName, component: componentName });
  });

  // Generate all.tsx map
  const typeMap = {
    eyes: "EyeType",
    mouth: "MouthType",
    emojis: "EmojiType",
  };
  const typeName = typeMap[category] || "string";
  const importType = `import type { ${typeName} } from '@acandrade/ac-bot-avatar-core';`;

  const allContent = `${importType}
import React from 'react';
${exports
  .map((e) => `import { ${e.component} } from './${e.name}';`)
  .join("\n")}

export const ${outputCategory}Map: Record<${typeName}, React.ComponentType<React.SVGProps<SVGGElement>>> = {
${exports.map((e) => `  '${e.name}': ${e.component},`).join("\n")}
};
`;
  fs.writeFileSync(path.join(outputDir, "all.tsx"), allContent);

  // Generate index.ts
  fs.writeFileSync(
    path.join(outputDir, "index.ts"),
    `export * from './all';\n${exports
      .map((e) => `export * from './${e.name}';`)
      .join("\n")}`
  );
}

processCategory("eyes");
processCategory("mouth");

console.log("SVG conversion complete!");
