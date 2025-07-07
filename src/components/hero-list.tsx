"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import HeroCard from "./hero-card";
import HeroForm from "./hero-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Hero {
  id: number;
  name: string;
  style: string;
  health: number;
  damage: number;
  resistance: number;
  createdAt: string;
  updatedAt: string;
}

export default function HeroList() {
  const { data: session, status } = useSession();
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingHero, setEditingHero] = useState<Hero | null>(null);

  const fetchHeroes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/heroes");

      if (!response.ok) {
        if (response.status === 401) {
          setError("Please sign in to view your heroes");
          return;
        }
        const data = await response.json();
        setError(data.error || "Failed to fetch heroes");
        return;
      }

      const data = await response.json();
      setHeroes(data.heroes || []);
      setError("");
    } catch (error) {
      console.error("Fetch heroes error:", error);
      setError("An error occurred while fetching heroes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status !== "loading") {
      fetchHeroes();
    }
  }, [status]);

  const handleHeroCreated = (hero: Hero) => {
    if (editingHero) {
      // Update existing hero
      setHeroes((prev) => prev.map((h) => (h.id === hero.id ? hero : h)));
      setEditingHero(null);
    } else {
      // Add new hero
      setHeroes((prev) => [...prev, hero]);
    }
    setShowForm(false);
  };

  const handleHeroEdit = (hero: Hero) => {
    setEditingHero(hero);
    setShowForm(true);
  };

  const handleHeroDelete = (heroId: number) => {
    setHeroes((prev) => prev.filter((h) => h.id !== heroId));
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingHero(null);
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading heroes...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Sign In Required</CardTitle>
          <CardDescription>
            Please sign in to create and manage your heroes
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription className="text-red-600">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={fetchHeroes} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Heroes</h2>
          <p className="text-gray-600">
            {heroes.length === 0
              ? "Create your first hero to get started"
              : `You have ${heroes.length} hero${
                  heroes.length !== 1 ? "s" : ""
                }`}
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} disabled={showForm}>
          Create New Hero
        </Button>
      </div>

      {/* Hero Form */}
      {showForm && (
        <div className="flex justify-center">
          <HeroForm
            onHeroCreated={handleHeroCreated}
            onCancel={handleCancelForm}
            editingHero={editingHero}
          />
        </div>
      )}

      {/* Heroes Grid */}
      {heroes.length === 0 && !showForm ? (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>No Heroes Yet</CardTitle>
            <CardDescription>
              Create your first hero to start building your collection!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setShowForm(true)} className="w-full">
              Create Your First Hero
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {heroes.map((hero) => (
            <HeroCard
              key={hero.id}
              hero={hero}
              onEdit={handleHeroEdit}
              onDelete={handleHeroDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
