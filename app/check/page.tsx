import type { Metadata } from "next";
import CheckClient from "./CheckClient";

export const metadata: Metadata = {
  title:       "Plagiarism Checker — TeenaScript",
  description: "Check your text against all articles in the library using TF-IDF cosine similarity analysis.",
};

export default function CheckPage() {
  return <CheckClient />;
}
