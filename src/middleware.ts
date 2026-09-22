import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/", "/(en|he|es|pt|fr|de|ru|yi|ar|it|nl|hu|fa|tr|uk|pl|am)/:path*"],
};
