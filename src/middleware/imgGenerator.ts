import { createCanvas } from "canvas";
import fs from "fs";
import path from "path";
import slugify from "slugify";

export function generateImageWithText(name: string): string {
  // Create a canvas with a width and height
  const canvas = createCanvas(300, 150);
  const context = canvas.getContext("2d");

  // Set the background color
  context.fillStyle = "#e0e0e0";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Set the text properties
  context.fillStyle = "#000";
  context.font = "30px Arial";
  context.textAlign = "center";
  context.textBaseline = "middle";

  // Position the text in the center
  const textX = canvas.width / 2;
  const textY = canvas.height / 2;

  // Only use the first character of the name and convert it to uppercase
  const firstChar = name.charAt(0).toUpperCase();

  // Draw the text on the canvas
  context.fillText(firstChar, textX, textY);

  // Specify the upload directory
  const uploadDir = path.join(__dirname, "../uploads/images");

  // Create the directories recursively if they don't exist
  fs.mkdirSync(uploadDir, { recursive: true });

  // Use the user name as the file name
  const fileName: string = `${slugify(name).toLowerCase()}-${Date.now()}.png`;
  const filePath: string = path.join(uploadDir, fileName);

  // Save the canvas as an image file
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(filePath, buffer);

  console.log("Image generated successfully!");
  return fileName;
}
