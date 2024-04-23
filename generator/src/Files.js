import 'dotenv/config';
import * as fs from 'fs';
import path from "path";
import { mkdir, writeFile } from "fs/promises";


export async function saveGeneratedFile(imageData) {
  const imageBuffer = Buffer.from(imageData, 'base64');
  const randStr = Math.random().toString(36).substring(7);
  const imageName = `generation_${Date.now()}_${randStr}.png`
  const pwd = process.cwd();
  const savePath = path.join(pwd, '..', 'processor', 'assets', 'generations', imageName);
  // Ensure the directory exists
  await mkdir(path.dirname(savePath), { recursive: true });
  // Write the file to the filesystem
  await writeFile(savePath, imageBuffer);
  return imageName;
}