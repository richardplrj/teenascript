import type { Metadata } from "next";
import AdminLoginForm from "./AdminLoginForm";

export const metadata: Metadata = {
  title:  "Admin Login — TeenaScript",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminLoginForm />;
}
