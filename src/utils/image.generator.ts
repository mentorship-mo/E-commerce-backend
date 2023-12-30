import { createCanvas } from "canvas";
import slugify from "slugify";
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CNARY_CLOUD_NAME,
  api_key: process.env.CNARY_API_KEY,
  api_secret: process.env.CNARY_API_SECRET,
});

export async function generateImageWithText(name: string): Promise<string> {
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

  // Convert the canvas to a buffer
  const buffer = canvas.toBuffer("image/png");

  // Upload the image to Cloudinary
  const uploadResult: any = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "uploads/images",
          public_id: `${Date.now()}-${slugify(name).toLowerCase()}`,
        },
        (error: any, result: any) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      )
      .end(buffer);
  });

  const publicURL: string = uploadResult.secure_url;
  console.log("Image uploaded to Cloudinary successfully!");
  return publicURL;
}
