import mongoose from "mongoose";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { connectDB } from "../config/db";
import { Category } from "../models/Category";
import { Product } from "../models/Product";
import { User } from "../models/User";
import { uniqueSlug, slugify } from "../utils/slugify";
import { deleteFiles } from "../utils/files";

type Demo = { name: string; price: number; stock: number; brand?: string; description: string };

const catalogue: Record<string, Demo[]> = {
  threads: [
    { name: "White Cotton Sewing Thread 500m", price: 3.49, stock: 60, description: "Soft mercerised cotton thread for natural fabrics and hand finishing." },
    { name: "Embroidery Floss Set 50 Colours", price: 12.99, stock: 25, description: "Six-strand cotton floss in 50 bright colours for embroidery and cross stitch." },
    { name: "Overlock Thread Cones Pack of 4", price: 15.99, stock: 18, description: "Strong polyester cones made for sergers and overlock machines." },
  ],
  needles: [
    { name: "Universal Machine Needles Size 90/14", price: 5.49, stock: 40, description: "Pack of 10 needles for woven and knit fabrics on most home machines." },
    { name: "Hand Sewing Needles Assorted 30 pcs", price: 2.99, stock: 75, description: "Sharps, embroidery and darning needles in one handy case." },
    { name: "Leather Needles Pack of 5", price: 4.29, stock: 0, description: "Wedge-point needles that cut clean holes in leather and vinyl." },
  ],
  zippers: [
    { name: "Invisible Zippers 9 inch Pack of 10", price: 6.99, stock: 50, description: "Concealed zippers for dresses and skirts in assorted colours." },
    { name: "Brass Jeans Zippers 7 inch Pack of 5", price: 7.49, stock: 30, description: "Heavy-duty metal zippers with locking sliders for denim." },
    { name: "Separating Jacket Zipper 24 inch", price: 3.99, stock: 22, description: "Open-end zipper for jackets, coats and hoodies." },
  ],
  buttons: [
    { name: "Wooden Buttons 20mm 50 pcs", price: 7.99, stock: 35, description: "Natural wood four-hole buttons for knitwear and casual wear." },
    { name: "White Shirt Buttons 11mm 100 pcs", price: 4.49, stock: 90, description: "Classic resin shirt buttons with a smooth finish." },
    { name: "Gold Metal Blazer Buttons Set", price: 9.99, stock: 12, description: "Set of 12 shank buttons for blazers and suits." },
  ],
  fabrics: [
    { name: "Cotton Poplin White per Yard", price: 6.5, stock: 120, description: "Crisp, breathable cotton ideal for shirts and linings." },
    { name: "Fusible Interfacing Medium 1 Yard", price: 3.75, stock: 80, description: "Iron-on interfacing for collars, cuffs and facings." },
    { name: "Ankara Print Cotton 6 Yards", price: 24, stock: 15, description: "Bold wax print cotton for dresses, shirts and accessories." },
  ],
  "measuring-tools": [
    { name: "Dual Scale Tape Measure 60 inch", price: 1.99, stock: 150, description: "Soft fibreglass tape with inches and centimetres." },
    { name: "Clear Quilting Ruler 6 x 24 inch", price: 13.49, stock: 20, description: "Acrylic ruler with grid lines and angle markings." },
    { name: "Tailor's Chalk Set 4 Colours", price: 3.29, stock: 0, description: "Clay chalk triangles that brush away cleanly." },
  ],
  "scissors-and-cutters": [
    { name: "Fabric Shears 9.5 inch", price: 18.99, stock: 14, description: "Stainless steel shears with comfortable soft-grip handles." },
    { name: "Rotary Cutter 45mm", price: 11.99, stock: 26, description: "Smooth rolling cutter with safety lock for layered fabric." },
    { name: "Thread Snips", price: 3.49, stock: 65, description: "Spring-action snips for quick thread trimming." },
  ],
  "machine-parts": [
    { name: "Bobbins Class 15 Pack of 25", price: 5.99, stock: 45, description: "Clear plastic bobbins that fit most domestic machines." },
    { name: "Snap-on Zipper Foot", price: 4.49, stock: 28, description: "Lets you stitch close to zipper teeth and piping." },
    { name: "Walking Foot Attachment", price: 22.99, stock: 8, description: "Feeds layers evenly for quilting, knits and thick fabrics." },
  ],
  "trims-and-notions": [
    { name: "Knit Elastic 1 inch 5 Yards", price: 4.99, stock: 55, description: "Soft, strong elastic for waistbands." },
    { name: "Hook and Eye Closures 50 Sets", price: 3.99, stock: 70, description: "Nickel-plated closures for waistbands and bodices." },
    { name: "Lace Trim 10 Yards", price: 6.49, stock: 0, description: "Delicate cotton lace for hems and embellishment." },
  ],
};

const colours: Record<string, [string, string]> = {
  threads: ["#ecfdf5", "#047857"],
  needles: ["#eff6ff", "#1d4ed8"],
  zippers: ["#fdf4ff", "#a21caf"],
  buttons: ["#fffbeb", "#b45309"],
  fabrics: ["#fdf2f8", "#be185d"],
  "measuring-tools": ["#f0fdfa", "#0f766e"],
  "scissors-and-cutters": ["#fef2f2", "#b91c1c"],
  "machine-parts": ["#f5f5f4", "#44403c"],
  "trims-and-notions": ["#faf5ff", "#7e22ce"],
};

const escapeXml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const wrap = (text: string, max = 22) => {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    if ((line + " " + word).trim().length > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = (line + " " + word).trim();
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
};

const buildSvg = (name: string, categoryName: string, slug: string) => {
  const [bg, accent] = colours[slug] ?? ["#f5f5f4", "#44403c"];
  const initials = categoryName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const lines = wrap(name)
    .map((line, i) => `<text x="300" y="${420 + i * 34}" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="600" fill="#292524">${escapeXml(line)}</text>`)
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
<rect width="600" height="600" fill="${bg}"/>
<circle cx="300" cy="230" r="120" fill="${accent}" opacity="0.12"/>
<circle cx="300" cy="230" r="78" fill="${accent}" opacity="0.2"/>
<text x="300" y="254" text-anchor="middle" font-family="Arial, sans-serif" font-size="64" font-weight="700" fill="${accent}">${initials}</text>
${lines}
<text x="300" y="560" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" letter-spacing="3" fill="${accent}">${escapeXml(categoryName.toUpperCase())}</text>
</svg>`;
};

const findSeller = async () => {
  const existing = await User.findOne({ role: "seller", status: "active" });
  if (existing) return existing;

  return User.create({
    name: "Becca Demo Store",
    email: "demo-seller@becca.local",
    password: crypto.randomBytes(24).toString("hex"),
    role: "seller",
    status: "active",
  });
};

const run = async () => {
  await connectDB();

  const seller = await findSeller();
  const uploadDir = path.join(process.cwd(), "uploads", "products");
  await fs.mkdir(uploadDir, { recursive: true });

  const oldDemo = await Product.find({ sku: /^DEMO-/ });
  await deleteFiles(oldDemo.flatMap((p) => p.images.map((img) => img.url)));
  await Product.deleteMany({ sku: /^DEMO-/ });

  let created = 0;
  for (const [categorySlug, items] of Object.entries(catalogue)) {
    const category = await Category.findOne({ slug: categorySlug });
    if (!category) {
      console.warn(`Skipping "${categorySlug}": category not found. Run npm run seed-categories first.`);
      continue;
    }

    for (const item of items) {
      const svg = buildSvg(item.name, category.name, categorySlug);
      const imageUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

      await Product.create({
        ...item,
        slug: uniqueSlug(item.name),
        sku: `DEMO-${String(created + 1).padStart(3, "0")}`,
        category: category._id,
        seller: seller._id,
        images: [{ url: imageUrl }],
      });
      created++;
    }
  }

  console.log(`${created} demo products created for seller "${seller.name}"`);
  await mongoose.disconnect();
};

run();