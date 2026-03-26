const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const inputDir = "./public/sequence";

fs.readdirSync(inputDir).forEach(file => {
  if (file.endsWith(".png")) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(
      inputDir,
      file.replace(".png", ".webp")
    );

    sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath)
      .then(() => console.log(`Converted: ${file}`))
      .catch(err => console.error(err));
  }
});