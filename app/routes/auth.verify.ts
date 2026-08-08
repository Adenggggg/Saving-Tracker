import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { consumeMagicLinkToken } from "~/lib/auth.server";
import { createUserSessionCookie } from "~/lib/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return redirect("/login");
  }

  const userId = await consumeMagicLinkToken(token);

  if (!userId) {
    return redirect("/login?expired=1");
  }

  const cookie = await createUserSessionCookie(userId);
  return redirect("/", { headers: { "Set-Cookie": cookie } });
}