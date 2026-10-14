import { readFile, writeFile } from 'node:fs/promises';
import {
  ColorMode,
  Hierarchical,
  OptimizePreset,
  PathSimplifyMode,
  optimize,
  vectorize,
} from '@neplex/vectorizer';

const sourcePath = new URL('../public/clientes/fama-transportes.png', import.meta.url);
const outputPath = new URL('../public/clientes/fama-transportes.svg', import.meta.url);
const source = await readFile(sourcePath);
const traced = await vectorize(source, {
  colorMode: ColorMode.Color,
  hierarchical: Hierarchical.Stacked,
  filterSpeckle: 4,
  colorPrecision: 6,
  layerDifference: 16,
  mode: PathSimplifyMode.Spline,
  cornerThreshold: 60,
  lengthThreshold: 4,
  maxIterations: 10,
  spliceThreshold: 45,
  pathPrecision: 2,
});
const optimized = await optimize(traced, { preset: OptimizePreset.Safe });
const openingTag = optimized.match(/<svg\b[^>]*>/);
if (!openingTag) throw new Error('Vectorizer did not return a valid SVG root element.');

const accessibleOpeningTag = openingTag[0]
  .replace(/>$/, ' viewBox="0 0 1086 768" role="img" aria-labelledby="fama-logo-title fama-logo-description">');
const accessibleSvg = optimized.replace(
  openingTag[0],
  `${accessibleOpeningTag}<title id="fama-logo-title">Fama Transportes</title><desc id="fama-logo-description">Logo colorida da Fama Transportes.</desc>`,
);
await writeFile(outputPath, accessibleSvg);
console.log(`Generated ${outputPath.pathname} (${Buffer.byteLength(accessibleSvg)} bytes).`);
