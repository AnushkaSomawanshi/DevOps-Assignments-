import { Blog } from "../models/Blog.js";

export async function listBlogs(_req, res) {
  const blogs = await Blog.find().sort({ publishedAt: -1 }).lean();
  res.json(blogs);
}

export async function getBlogById(req, res) {
  const blog = await Blog.findOne({ id: req.params.id }).lean();
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  res.json(blog);
}
