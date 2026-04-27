const fs = require("fs/promises");
const path = require("path");

const dataDir = path.join(__dirname, "..", "data");

async function readJsonFile(fileName) {
  const filePath = path.join(dataDir, fileName);
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw || "[]");
}

async function writeJsonFile(fileName, data) {
  const filePath = path.join(dataDir, fileName);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

module.exports = {
  readJsonFile,
  writeJsonFile
};
