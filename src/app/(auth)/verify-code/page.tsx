import { Suspense } from "react";
import VerifyCodePage from "@/components/verify-code";

export default function Page() {
  return (
    <Suspense>
      <VerifyCodePage />
    </Suspense>
  );
}
