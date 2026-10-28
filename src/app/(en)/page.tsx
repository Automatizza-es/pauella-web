import HomePage from "@/components/home/HomePage";
import { localeMetadata } from "@/lib/locale-seo";

export const metadata = localeMetadata("en");

export default function Page() {
  return <HomePage locale="en" />;
}
