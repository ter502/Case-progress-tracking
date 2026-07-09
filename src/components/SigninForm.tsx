"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SigninForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("帳號或密碼錯誤");
      return;
    }

    router.push("/home");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-12"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center gap-1 ">
          <label htmlFor="email" className="text-2xl w-32">
            帳戶名稱
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="border-2 border-gray-700 focus:border-pink-600 rounded-sm px-2 h-10 w-64"
          />
        </div>

        <div className="flex flex-row items-center gap-1">
          <label htmlFor="password" className="text-2xl w-32">
            密碼
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="border-2 border-gray-700 focus:border-pink-600 rounded-sm px-2 h-10 w-64"
          />
        </div>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex flex-row justify-center gap-12">
        <Link
          href="/forgot-password"
          className="text-2xl bg-orange-300 hover:bg-orange-400 rounded-sm w-32 h-10 inline-flex items-center justify-center"
        >
          忘記密碼
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="text-2xl bg-green-300 hover:bg-green-400 disabled:bg-gray-300 rounded-sm w-32 h-10"
        >
          {loading ? "登入中..." : "登入"}
        </button>
      </div>
    </form>
  );
}
