import { useState } from "react";
import { useFetcher } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { Mail, Gift } from "lucide-react";
import { findUserByEmail, createMagicLinkToken } from "~/lib/auth.server";
import { sendMagicLinkEmail } from "~/lib/email.server";
import { db } from "../../db/client";
import { groups } from "../../db/schema";

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const email = String(form.get("email") || "").trim();

  if (!email) {
    return { ok: false, reason: "Please enter your email." };
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return { ok: false, reason: "That email isn't registered to this fund." };
  }

  const group = (await db.select().from(groups).limit(1))[0];
  const token = await createMagicLinkToken(user.id);

  const origin = new URL(request.url).origin;
  const link = `${origin}/auth/verify?token=${token}`;

  await sendMagicLinkEmail(user.email, user.name, group?.name ?? "the fund", link);

  return { ok: true, reason: `We sent a login link to ${user.email}. It expires in 15 minutes.` };
}

export default function Login() {
  const fetcher = useFetcher<{ ok: boolean; reason?: string }>();
  const [email, setEmail] = useState("");

  const sent = fetcher.state === "idle" && fetcher.data?.ok;

  return (
    <div className="flex h-screen items-center justify-center p-4" style={{ background: "#f7f6f2" }}>
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col items-center text-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "#0e3d2c" }}>
            <Gift size={20} color="#ffffff" />
          </div>
          <p className="text-sm font-semibold" style={{ color: "#0e3d2c" }}>
            Member Login
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Only registered members of this fund can log in.
          </p>
        </div>

        {sent ? (
          <div className="rounded-xl p-4 text-center" style={{ background: "#eef4ef" }}>
            <Mail size={20} className="mx-auto mb-2" style={{ color: "#0e3d2c" }} />
            <p className="text-sm" style={{ color: "#0e3d2c" }}>
              {fetcher.data?.reason}
            </p>
          </div>
        ) : (
          <fetcher.Form method="post" className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold" style={{ color: "#0e3d2c" }}>
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border-2 px-3 py-2 text-sm outline-none"
                style={{ borderColor: "#d8d2c2" }}
              />
            </div>

            {fetcher.data?.ok === false && (
              <p className="text-xs" style={{ color: "#b23b3b" }}>
                {fetcher.data.reason}
              </p>
            )}

            <button
              type="submit"
              disabled={fetcher.state !== "idle"}
              className="w-full rounded-full py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: "#0e3d2c" }}
            >
              {fetcher.state !== "idle" ? "Sending…" : "Send Login Link"}
            </button>
          </fetcher.Form>
        )}
      </div>
    </div>
  );
}