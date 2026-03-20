import type { Metadata } from "next";
import UploadForm from "./UploadForm";

export const metadata: Metadata = {
  title:       "Submit an Article — TeenaScript",
  description: "Contribute to the library by uploading a scholarly article. Paste text or upload a .txt file.",
};

export default function UploadPage() {
  return <UploadForm />;
}
