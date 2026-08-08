import { redirect } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { destroySessionCookie } from "~/lib/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const cookie = await destroySessionCookie(request);
  return redirect("/", { headers: { "Set-Cookie": cookie } });
}