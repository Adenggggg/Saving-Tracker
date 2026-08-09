import { useEffect, useState } from "react";
import { BellRing } from "lucide-react";
import { useToast } from "~/components/Toast";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string;

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function PushOptIn() {
  const { showToast } = useToast();
  const [status, setStatus] = useState<"unsupported" | "default" | "granted" | "denied" | "loading">(
    "default"
  );

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported");
      return;
    }
    setStatus(Notification.permission as "default" | "granted" | "denied");
  }, []);

  async function handleEnable() {
    setStatus("loading");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission as "denied" | "default");
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      await fetch("/api/push-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: subscription.toJSON() }),
      });

      setStatus("granted");
      showToast("Notifications enabled.", "success");
    } catch (err) {
      console.error("Push subscription failed:", err);
      setStatus("default");
      showToast("Couldn't enable notifications.", "error");
    }
  }

  if (status === "unsupported" || status === "granted") return null;

  return (
    <button
      onClick={handleEnable}
      disabled={status === "loading" || status === "denied"}
      className="mb-4 flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      style={{ background: "#0f3d2e" }}
      title={status === "denied" ? "Notifications blocked in browser settings" : undefined}
    >
      <BellRing size={13} />
      {status === "loading"
        ? "Enabling…"
        : status === "denied"
        ? "Notifications blocked"
        : "Enable notifications"}
    </button>
  );
}