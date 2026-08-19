export type Category = "dsa" | "system-design" | "fullstack";

export type Difficulty =
  | "basic"
  | "intermediate"
  | "advanced"
  | "insane"
  | "fundamentals"
  | "easy"
  | "medium"
  | "hard";

export interface Resource {
  title: string;
  url: string;
  type: "doc" | "video" | "article" | "repo";
}

export interface CodeExample {
  language: string;
  code: string;
  explanation?: string;
}

export interface Question {
  id: string;
  topicId: string;
  difficulty: Difficulty;
  text: string;
  tags?: string[];
  resources?: Resource[];
  examples?: CodeExample[];
  /** id of a visualizer this question links to, e.g. "sorting" */
  visualizer?: string;
}

export interface Topic {
  id: string;
  name: string;
  slug: string;
  category: Category;
  blurb: string;
  icon: string; // emoji for a lightweight, dependency-free icon
  resources?: Resource[];
}

/**
 * A block within a concept explanation. Kept simple and renderer-agnostic:
 * - "text": a paragraph
 * - "heading": a small sub-heading
 * - "list": bullet points
 * - "code": a fenced code snippet
 */
export type ConceptBlock =
  | { type: "text"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; language: string; code: string };

export interface Concept {
  id: string;
  topicId: string;
  title: string;
  summary: string;
  difficulty: Difficulty;
  /** In-house written explanation. */
  body: ConceptBlock[];
  resources?: Resource[];
  /** id of a visualizer this concept links to, e.g. "sorting". */
  visualizer?: string;
}
