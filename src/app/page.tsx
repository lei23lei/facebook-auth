"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Lab6</CardTitle>
              <CardDescription>
                Authentication system with ShadCN, SQLite, and NextAuth
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {session ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800">
                      Welcome back!
                    </h3>
                    <p className="text-green-700">
                      You are signed in as{" "}
                      <span className="font-medium">{session.user?.name}</span>
                    </p>
                    <p className="text-sm text-green-600">
                      Email: {session.user?.email}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={() => signOut()} variant="outline">
                      Sign Out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800">Get Started</h3>
                    <p className="text-blue-700">
                      Sign in to your account or create a new one to continue.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button asChild>
                      <Link href="/auth/signin">Sign In</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/auth/signup">Sign Up</Link>
                    </Button>
                  </div>
                </div>
              )}

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">Features</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✅ ShadCN UI components</li>
                  <li>✅ SQLite database with Drizzle ORM</li>
                  <li>✅ NextAuth.js with Facebook login</li>
                  <li>✅ Username/email/password authentication</li>
                  <li>✅ Responsive design</li>
                </ul>

                <div className="mt-4 p-3 bg-gray-50 border rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Quick Test:
                  </p>
                  <p className="text-xs text-gray-600">
                    Try the test credentials - Username:{" "}
                    <span className="font-mono">admin</span>, Password:{" "}
                    <span className="font-mono">admin</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
