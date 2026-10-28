import { createCookingClassHandler } from "@/lib/cooking-class-handler";
import { emailRows, sendNotificationEmail } from "@/lib/email";
export const POST = createCookingClassHandler(sendNotificationEmail, emailRows);
