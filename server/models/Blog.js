import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, default: "" },
    category: { type: String, required: true },
    author: { type: String, required: true },
    authorRole: { type: String, required: true },
    imageUrl: { type: String, required: true },
    publishedAt: { type: String, required: true },
    readTime: { type: Number, required: true, min: 0 },
    tags: [{ type: String, required: true }],
  },
  { versionKey: false }
);

export const Blog = mongoose.model("Blog", blogSchema);
