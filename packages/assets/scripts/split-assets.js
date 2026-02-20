const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '../src/ACBotFaceAssets.tsx');
const outputDirEyes = path.join(__dirname, '../src/eyes');
const outputDirMouths = path.join(__dirname, '../src/mouths');

if (!fs.existsSync(outputDirEyes)) fs.mkdirSync(outputDirEyes, { recursive: true });
if (!fs.existsSync(outputDirMouths)) fs.mkdirSync(outputDirMouths, { recursive: true });

const content = fs.readFileSync(inputFile, 'utf8');

function toPascalCase(str) {
    return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

function extractSection(sectionName, outputDir, suffix) {
    const startRegex = new RegExp(`export const ${sectionName}: Record<${sectionName === 'eyes' ? 'EyeType' : 'MouthType'}, React\\.ReactNode> = {`);
    const startIndex = content.search(startRegex);
    if (startIndex === -1) {
        console.error(`Could not find section ${sectionName}`);
        return;
    }

    let nesting = 0;
    let inSection = false;
    let currentKey = null;
    let currentBuffer = '';
    const exportedKeys = [];

    const lines = content.slice(startIndex).split('\n');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.includes(`export const ${sectionName}`)) {
            inSection = true;
            nesting = 1;
            continue;
        }

        if (!inSection) continue;

        // Check for end of section
        if (line.trim() === '};') {
            break;
        }

        // Check for key start: "  key: ("
        const keyMatch = line.match(/^\s+([a-z_]+): \($/);
        if (keyMatch) {
            currentKey = keyMatch[1];
            currentBuffer = '';
            continue;
        }

        // Check for key end: "  ),"
        if (line.trim() === '),' && currentKey) {
            const componentName = toPascalCase(currentKey) + suffix;
            const fileContent = `import React from 'react';\n\nexport const ${componentName} = () => (\n${currentBuffer}\n);\n`;
            fs.writeFileSync(path.join(outputDir, `${currentKey}.tsx`), fileContent);
            exportedKeys.push(currentKey);
            console.log(`Generated ${componentName}`);
            currentKey = null;
            continue;
        }

        if (currentKey) {
            currentBuffer += line + '\n';
        }
    }

    // Generate index.ts
    let indexContent = exportedKeys.map(key => `import { ${toPascalCase(key)}${suffix} } from './${key}';`).join('\n');
    indexContent += `\n\nexport * from './all';\n`;
    indexContent += `\nexport {\n` + exportedKeys.map(key => `  ${toPascalCase(key)}${suffix},`).join('\n') + `\n};\n`;

    // Create all.ts for the record map
    let allContent = `import type { ${sectionName === 'eyes' ? 'EyeType' : 'MouthType'} } from '@ac-andrade/ac-bot-avatar-core/dist/types';\n`;
    allContent += `import React from 'react';\n`;
    allContent += exportedKeys.map(key => `import { ${toPascalCase(key)}${suffix} } from './${key}';`).join('\n');
    allContent += `\n\nexport const ${sectionName}Map: Record<${sectionName === 'eyes' ? 'EyeType' : 'MouthType'}, React.FC> = {\n`;
    allContent += exportedKeys.map(key => `  ${key}: ${toPascalCase(key)}${suffix},`).join('\n');
    allContent += `\n};\n`;

    fs.writeFileSync(path.join(outputDir, 'index.ts'), indexContent);
    fs.writeFileSync(path.join(outputDir, 'all.ts'), allContent);
}

extractSection('eyes', outputDirEyes, 'Eye');
extractSection('mouths', outputDirMouths, 'Mouth');
