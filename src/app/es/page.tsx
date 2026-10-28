import HomePage from "@/components/home/HomePage";
import { localeMetadata } from "@/lib/locale-seo";

export const metadata = localeMetadata("es");

export default function Page() {
  return <HomePage locale="es" />;
}
