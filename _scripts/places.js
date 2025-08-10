import fs from "fs";
import fetch from "node-fetch";

export class Places {
  constructor(apiUrl) {
    this.apiURL = `https://poi.javier.computer/api`;
    this.outputDir = "content/_places/";
    this.dataFile = "_data/places.json";
    this.lastUpdatedAt = this.getLastUpdatedAt();
  }

  getLastUpdatedAt() {
    if (fs.existsSync(this.dataFile)) {
      const data = JSON.parse(fs.readFileSync(this.dataFile, "utf8"));
      return new Date(data.updated_at);
    }
    return new Date(0);
  }

  async loadSpinner() {
    const ora = (await import("ora")).default;
    this.spinner = ora({ text: "Loading…", spinner: "dots" });
  }

  async fetchCheckins() {
    const response = await fetch(`${this.apiURL}/checkins`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  createSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  }

  createMarkdownFile(place) {
    const { name, notes, address, lat, lon, category, poi_id } = place;

    const slug = this.createSlug(name);

    const mdContent = `---
layout: place
pid: ${slug}
title: "${name}"
description: "${notes || ""}"
address: "${address || ""}"
category: "${category || ""}"
poi_id: "${poi_id || ""}"
latlng:
- ${lat}
- ${lon}
location: berlin
---`;

    const fileName = `${slug}.md`;

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    fs.writeFileSync(this.outputDir + fileName, mdContent);
    return fileName;
  }

  async processCheckins(existingData) {
    const checkins = await this.fetchCheckins();
    const newPlaces = [];
    const createdFiles = [];

    for (const checkin of checkins) {
      const slug = this.createSlug(checkin.name);

      // Check if place already exists
      const doesPlaceExist = existingData.places.some(
        (place) => place.slug === slug,
      );

      if (!doesPlaceExist) {
        const place = {
          slug,
          name: checkin.name,
          notes: checkin.notes,
          address: checkin.address,
          category: checkin.category,
          poi_id: checkin.poi_id,
          lat: checkin.lat,
          lon: checkin.lon,
          created_at: checkin.created_at,
          checkin_id: checkin.id,
        };

        newPlaces.push(place);
        const fileName = this.createMarkdownFile(place);
        createdFiles.push(fileName);
      }
    }

    return { newPlaces, createdFiles };
  }

  async run() {
    await this.loadSpinner();
    this.spinner.start("Fetching checkins from API");

    try {
      const existingData = fs.existsSync(this.dataFile)
        ? JSON.parse(fs.readFileSync(this.dataFile, "utf8"))
        : { places: [] };

      const { newPlaces, createdFiles } = await this.processCheckins(
        existingData,
      );

      if (newPlaces.length > 0) {
        const updatedPlaces = [...newPlaces, ...existingData.places];
        const updated_at = new Date().toISOString().split("T")[0];
        const outputData = {
          updated_at,
          count: updatedPlaces.length,
          places: updatedPlaces,
        };

        fs.writeFileSync(this.dataFile, JSON.stringify(outputData, null, 2));

        this.spinner.succeed(
          `New places added: ${newPlaces.length}. Total places: ${updatedPlaces.length}`,
        );

        if (createdFiles.length > 0) {
          console.log("Created files:");
          createdFiles.forEach((file) =>
            console.log(`  - ${this.outputDir}${file}`),
          );
        }
      } else {
        this.spinner.succeed("No new places to add.");
      }
    } catch (error) {
      this.spinner.fail(`Error fetching places: ${error.message}`);
      console.error(error);
    }
  }
}
