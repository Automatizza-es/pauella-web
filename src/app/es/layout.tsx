import SiteLayout from "@/components/layout/SiteLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteLayout locale="es">{children}</SiteLayout>;
}
