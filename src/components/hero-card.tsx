"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

interface HeroCardProps {
  hero: Hero;
  onEdit?: (hero: Hero) => void;
  onDelete?: (heroId: number) => void;
}

export default function HeroCard({ hero, onEdit, onDelete }: HeroCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${hero.name}?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/heroes?id=${hero.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || "Failed to delete hero");
        return;
      }

      onDelete?.(hero.id);
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting the hero");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Function to get stat color based on value
  const getStatColor = (stat: string, value: number) => {
    switch (stat) {
      case "health":
        if (value >= 5000) return "bg-green-100 text-green-800";
        if (value >= 3000) return "bg-yellow-100 text-yellow-800";
        return "bg-red-100 text-red-800";
      case "damage":
        if (value >= 80) return "bg-red-100 text-red-800";
        if (value >= 50) return "bg-yellow-100 text-yellow-800";
        return "bg-green-100 text-green-800";
      case "resistance":
        if (value >= 7) return "bg-blue-100 text-blue-800";
        if (value >= 4) return "bg-purple-100 text-purple-800";
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="w-full max-w-sm hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span className="text-lg font-bold">{hero.name}</span>
          <div className="text-xs text-gray-500">#{hero.id}</div>
        </CardTitle>
        <CardDescription className="text-sm font-medium text-blue-600">
          {hero.style}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Hero Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Health
            </div>
            <Badge className={getStatColor("health", hero.health)}>
              {hero.health.toLocaleString()}
            </Badge>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Damage
            </div>
            <Badge className={getStatColor("damage", hero.damage)}>
              {hero.damage}
            </Badge>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Resistance
            </div>
            <Badge className={getStatColor("resistance", hero.resistance)}>
              {hero.resistance.toFixed(1)}
            </Badge>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Created
            </div>
            <div className="text-xs font-medium">
              {formatDate(hero.createdAt)}
            </div>
          </div>
        </div>

        {/* Power Rating */}
        <div className="pt-2 border-t">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            Power Rating
          </div>
          <div className="text-lg font-bold text-purple-600">
            {Math.round(
              hero.health / 100 + hero.damage * 10 + hero.resistance * 50
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit?.(hero)}
            className="flex-1"
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
