"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
} from "lucide-react";
import { loginAction } from "@/lib/actions/auth";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-textPrimary flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Back button */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-sm text-textSecondary hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-surface border border-transparent hover:border-border"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </Link>
      </div>

      <div className="w-full max-w-md" data-aos="fade-up">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-textPrimary">
            Admin Dashboard
          </h1>
          <p className="text-sm text-textSecondary mt-1">
            Sign in to manage projects & tech stack
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface/80 backdrop-blur-xl border border-border p-8 rounded-2xl shadow-2xl">
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-textSecondary uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-textSecondary">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="admin@https://www.madaputra.my.id/"
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-textPrimary placeholder:text-textSecondary/50 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-textSecondary uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-textSecondary">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-background border border-border rounded-lg text-textPrimary placeholder:text-textSecondary/50 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-textSecondary hover:text-textPrimary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
