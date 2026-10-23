import mongoose from "mongoose";
import { connectDB } from "../config/db";
import { Category } from "../models/Category";
import { slugify } from "../utils/slugify";

const categories = [
  { name: "Threads", description: "Sewing, embroidery and overlock threads" },
  { name: "Needles", description: "Hand and machine needles" },
  { name: "Zippers", description: "Metal, plastic and invisible zippers" },
  { name: "Buttons", description: "Shirt, coat and decorative buttons" },
  { name: "Fabrics", description: "Cotton, lining, interfacing and more" },
  { name: "Measuring Tools", description: "Tapes, rulers and marking tools" },
  { name: "Scissors and Cutters", description: "Shears, snips and rotary cutters" },
  { name: "Machine Parts", description: "Presser feet, bobbins and spare parts" },
  { name: "Trims and Notions", description: "Elastic, lace, hooks and fasteners" },
];

const run = async () => {
  await connectDB();

  for (const item of categories) {
    const slug = slugify(item.name);
    await Category.updateOne({ slug }, { $setOnInsert: { ...item, slug } }, { upsert: true });
  }

  console.log(`${categories.length} categories ready`);
  await mongoose.disconnect();
};

run();