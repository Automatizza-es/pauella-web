import ClassesPage from "@/components/classes/ClassesPage";
import { classMetadata } from "@/lib/classes/seo";
export const metadata = classMetadata("en");
export default function Page() { return <ClassesPage locale="en" />; }
