"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface HeroFormProps {
  onHeroCreated?: (hero: any) => void;
  onCancel?: () => void;
  editingHero?: any;
}

export default function HeroForm({
  onHeroCreated,
  onCancel,
  editingHero,
}: HeroFormProps) {
  const [formData, setFormData] = useState({
    name: editingHero?.name || "",
    style: editingHero?.style || "",
    health: editingHero?.health || 1000,
    damage: editingHero?.damage || 10,
    resistance: editingHero?.resistance || 1.0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Client-side validation
      if (!formData.name.trim()) {
        setError("Hero name is required");
        return;
      }

      if (formData.name.length > 50) {
        setError("Hero name must be 50 characters or less");
        return;
      }

      if (!formData.style.trim()) {
        setError("Hero style is required");
        return;
      }

      if (formData.style.length > 255) {
        setError("Hero style must be 255 characters or less");
        return;
      }

      if (formData.health < 1000) {
        setError("Hero health must be at least 1000");
        return;
      }

      if (formData.damage > 100) {
        setError("Hero damage must be 100 or less");
        return;
      }

      if (formData.resistance < 0.0 || formData.resistance > 10.0) {
        setError("Hero resistance must be between 0.0 and 10.0");
        return;
      }

      const url = "/api/heroes";
      const method = editingHero ? "PUT" : "POST";
      const body = editingHero ? { ...formData, id: editingHero.id } : formData;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to save hero");
        return;
      }

      // Reset form if creating new hero
      if (!editingHero) {
        setFormData({
          name: "",
          style: "",
          health: 1000,
          damage: 10,
          resistance: 1.0,
        });
      }

      onHeroCreated?.(data.hero);
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("Hero creation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(""); // Clear error when user starts typing
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{editingHero ? "Edit Hero" : "Create New Hero"}</CardTitle>
        <CardDescription>
          {editingHero
            ? "Update your hero's attributes"
            : "Design your hero with unique attributes"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Hero Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter hero name (max 50 chars)"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              maxLength={50}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="style">Fighting Style</Label>
            <Input
              id="style"
              type="text"
              placeholder="Enter fighting style (max 255 chars)"
              value={formData.style}
              onChange={(e) => handleInputChange("style", e.target.value)}
              maxLength={255}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="health">Health (minimum 1000)</Label>
            <Input
              id="health"
              type="number"
              placeholder="1000"
              value={formData.health}
              onChange={(e) =>
                handleInputChange("health", parseInt(e.target.value) || 1000)
              }
              min="1000"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="damage">Damage (maximum 100)</Label>
            <Input
              id="damage"
              type="number"
              placeholder="10"
              value={formData.damage}
              onChange={(e) =>
                handleInputChange("damage", parseInt(e.target.value) || 10)
              }
              min="1"
              max="100"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resistance">Resistance (0.0 - 10.0)</Label>
            <Input
              id="resistance"
              type="number"
              step="0.1"
              placeholder="1.0"
              value={formData.resistance}
              onChange={(e) =>
                handleInputChange(
                  "resistance",
                  parseFloat(e.target.value) || 1.0
                )
              }
              min="0.0"
              max="10.0"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : editingHero
                ? "Update Hero"
                : "Create Hero"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
