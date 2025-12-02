const path = require('path');
const fs = require('fs');

const ensureDir = async (dir) => {
  await fs.promises.mkdir(dir, { recursive: true });
};

const saveBuffer = async (buffer, folder, filename) => {
  const uploadsDir = path.join(__dirname, '..', 'uploads', folder);
  await ensureDir(uploadsDir);
  const safeName = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9_.-]/g, '')}`;
  const filePath = path.join(uploadsDir, safeName);
  await fs.promises.writeFile(filePath, buffer);
  const publicUrl = `/uploads/${folder}/${safeName}`;
  return publicUrl;
};

module.exports = saveBuffer;

