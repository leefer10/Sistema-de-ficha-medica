"use client";

import { useRouter } from "next/navigation";
import { ViewPersonalDataPage } from "@/components/ViewPersonalDataPage";

export default function Page() {
  const router = useRouter();

  return (
    <ViewPersonalDataPage
      onNavigate={(path) => router.push(path)}
    />
  );
}
