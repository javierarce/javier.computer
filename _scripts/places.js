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

  extractLocation(checkin) {
    if (checkin.addr_city) {
      return this.createSlug(checkin.addr_city);
    }

    return "unknown";
  }

  createSlug(name) {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  createMarkdownFile(place) {
    const { name, notes, address, lat, lon, category, location } = place;

    const slug = this.createSlug(name);

    const mdContent = `---
layout: place
pid: ${slug}
title: "${name}"
description: "${notes || ""}"
address: "${address || ""}"
category: "${category || ""}"
latlng:
- ${lat}
- ${lon}
location: ${location}
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
        const location = this.extractLocation(checkin);

        const place = {
          slug,
          name: checkin.name,
          notes: checkin.notes,
          address: checkin.address,
          category: checkin.category,
          lat: checkin.lat,
          lon: checkin.lon,
          location,
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
