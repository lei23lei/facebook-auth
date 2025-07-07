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
import HeroList from "@/components/hero-list";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {session ? (
          // Authenticated user view - Hero System
          <div className="space-y-8">
            {/* User Info Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {session.user?.name}!
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage your hero collection and create powerful warriors
                </p>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => signOut()} variant="outline">
                  Sign Out
                </Button>
              </div>
            </div>

            {/* Hero System */}
            <HeroList />
          </div>
        ) : (
          // Unauthenticated user view - Welcome & Auth
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Welcome to Hero Creator</CardTitle>
                <CardDescription>
                  Create and manage your collection of unique heroes with our
                  powerful system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800">Get Started</h3>
                    <p className="text-blue-700">
                      Sign in to your account or create a new one to start
                      building your hero collection.
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
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
