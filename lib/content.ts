import fs from "fs";
import path from "path";
import matter from "gray-matter";

const WRITING_DIR = path.join(process.cwd(), "content", "writing");

export type WritingFrontmatter = {
  title: string;
  date: string;
  summary?: string;
  door?: "ACCESS" | "EXCELLENCE" | "OPPORTUNITY";
  tags?: string[];
};

export type WritingListItem = WritingFrontmatter & { slug: string };

export function getWritingList(): WritingListItem[] {
  const files = fs.readdirSync(WRITING_DIR).filter((f) => f.endsWith(".mdx"));
  return files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(WRITING_DIR, filename), "utf8");
      const parsed = matter(raw);
      const data = parsed.data as Partial<WritingFrontmatter>;
      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? "1970-01-01",
        summary: data.summary,
        door: data.door,
        tags: data.tags ?? [],
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getWritingBySlug(slug: string) {
  const fullPath = path.join(WRITING_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(fullPath, "utf8");
  const parsed = matter(raw);
  return {
    frontmatter: parsed.data as WritingFrontmatter,
    content: parsed.content,
  };
}

