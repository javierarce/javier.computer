import fs from "fs";
import Arena from "are.na";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CHANNEL_NAME = "binocular-shot";
const contentDirectory = "content/_binoculars";
let count = 0;

const TEMPLATE = `---
title: "TITLE"
position: POSITION
date: DATE
covers: 
COVERS
videos: 
VIDEOS
layout: binoculars
---
CONTENT
`;

// Function to remove directory recursively
const removeDirectory = async (dir) => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        await removeDirectory(filePath);
      } else {
        fs.unlinkSync(filePath);
      }
    }
    fs.rmdirSync(dir);
  }
};

const createOrUpdateFile = (permalink, content, videoUrl, coverUrl) => {
  const filePath = path.join(contentDirectory, `${permalink}.md`);
  const coverTemplate = `- ${coverUrl}`;

  if (fs.existsSync(filePath)) {
    let existingContent = fs.readFileSync(filePath, "utf8");
    const videoListMatch = existingContent.match(
      /videos:\s*\n([\s\S]*?)(layout: binoculars)/,
    );

    if (videoListMatch) {
      existingContent = existingContent.replace(
        videoListMatch[1],
        `${videoListMatch[1]}- ${videoUrl}\n`,
      );
    }

    const coverListMatch = existingContent.match(
      /covers:\s*\n([\s\S]*?)(videos:)/,
    );
    if (coverListMatch) {
      existingContent = existingContent.replace(
        coverListMatch[1],
        `${coverListMatch[1]}- ${coverUrl}\n`,
      );
    }

    fs.writeFileSync(filePath, existingContent);
    console.log("File updated:", filePath);
  } else {
    const videoTemplate = `- ${videoUrl}`;
    const newContent = content
      .replace("VIDEOS", videoTemplate)
      .replace("COVERS", coverTemplate);
    fs.writeFileSync(filePath, newContent);
    console.log("File created:", filePath);
  }

  count++;
};

const onChannel = (channel) => {
  channel.map((item) => {
    const videoUrl = item.attachment.url;
    const coverUrl = item.image.large.url; // Assuming item.file.large.url holds the cover URL

    const content = TEMPLATE.replace("TITLE", item.title)
      .replace("CONTENT", item.content || "")
      .replace("DATE", item.connected_at)
      .replace("POSITION", item.position);

    const permalink = item.title
      .replace(/[^a-zA-Z0-9]/g, "-")
      .toLowerCase()
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .replace(/:/g, "");
    createOrUpdateFile(permalink, content, videoUrl, coverUrl);
  });
  console.log("Total files created:", count);
};

const arena = new Arena();
removeDirectory(contentDirectory).then(() => {
  fs.mkdirSync(contentDirectory, { recursive: true });
  arena
    .channel(CHANNEL_NAME)
    .contents({ page: 1, per: 300 })
    .then(onChannel)
    .catch((error) => {
      console.error(error);
    });
});
