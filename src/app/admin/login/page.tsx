"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed");
        return;
      }
      router.push("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-900 px-6 text-beige-100">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex flex-col items-center text-center">
          <Image
            src="/images/logo-events-by-marina.avif"
            alt="Events By Marina"
            width={197}
            height={203}
            className="mb-4 h-20 w-auto"
          />
          <p className="mt-1 text-xs uppercase tracking-wide-lg text-beige-100/50">Admin Dashboard</p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4 rounded-lg border border-beige-100/10 bg-beige-100/[0.03] p-8">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wide text-beige-100/50">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-beige-100/15 bg-transparent px-3 py-2.5 text-sm focus:border-brass-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wide text-beige-100/50">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-beige-100/15 bg-transparent px-3 py-2.5 text-sm focus:border-brass-400 focus:outline-none"
            />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-brass-500 py-2.5 text-xs font-medium uppercase tracking-wide-lg text-ink-900 transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] text-beige-100/30">
          Demo: admin@eventsbymarina.com / EventsByMarina2026!
        </p>
      </div>
    </div>
  );
}
