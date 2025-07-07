import { NextRequest, NextResponse } from "next/server";
import { decode } from "next-auth/jwt";
import { db } from "@/lib/db";
import { heroes } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

// Helper function to get user from JWT token
async function getUserFromRequest(request: NextRequest) {
  try {
    const token =
      request.cookies.get("next-auth.session-token")?.value ||
      request.cookies.get("__Secure-next-auth.session-token")?.value;

    if (!token) return null;

    const decoded = await decode({
      token,
      secret: process.env.NEXTAUTH_SECRET!,
    });

    return decoded?.sub ? { id: decoded.sub } : null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

// GET - Fetch user's heroes
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userHeroes = await db
      .select()
      .from(heroes)
      .where(eq(heroes.userId, user.id)) // Use string comparison instead of parseInt
      .orderBy(heroes.createdAt);

    return NextResponse.json({ heroes: userHeroes });
  } catch (error) {
    console.error("Error fetching heroes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new hero
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, style, health, damage, resistance } = body;

    // Validation
    if (
      !name ||
      !style ||
      health === undefined ||
      damage === undefined ||
      resistance === undefined
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (name.length > 50) {
      return NextResponse.json(
        { error: "Hero name must be 50 characters or less" },
        { status: 400 }
      );
    }

    if (style.length > 255) {
      return NextResponse.json(
        { error: "Hero style must be 255 characters or less" },
        { status: 400 }
      );
    }

    if (health < 1000) {
      return NextResponse.json(
        { error: "Hero health must be at least 1000" },
        { status: 400 }
      );
    }

    if (damage > 100) {
      return NextResponse.json(
        { error: "Hero damage must be 100 or less" },
        { status: 400 }
      );
    }

    if (resistance < 0.0 || resistance > 10.0) {
      return NextResponse.json(
        { error: "Hero resistance must be between 0.0 and 10.0" },
        { status: 400 }
      );
    }

    // Create hero
    const newHero = await db
      .insert(heroes)
      .values({
        userId: user.id, // Use string user ID directly
        name,
        style,
        health: parseInt(health),
        damage: parseInt(damage),
        resistance: parseFloat(resistance),
      })
      .returning();

    return NextResponse.json({ hero: newHero[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating hero:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update a hero
export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, style, health, damage, resistance } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Hero ID is required" },
        { status: 400 }
      );
    }

    // Validation (same as POST)
    if (
      !name ||
      !style ||
      health === undefined ||
      damage === undefined ||
      resistance === undefined
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (name.length > 50) {
      return NextResponse.json(
        { error: "Hero name must be 50 characters or less" },
        { status: 400 }
      );
    }

    if (style.length > 255) {
      return NextResponse.json(
        { error: "Hero style must be 255 characters or less" },
        { status: 400 }
      );
    }

    if (health < 1000) {
      return NextResponse.json(
        { error: "Hero health must be at least 1000" },
        { status: 400 }
      );
    }

    if (damage > 100) {
      return NextResponse.json(
        { error: "Hero damage must be 100 or less" },
        { status: 400 }
      );
    }

    if (resistance < 0.0 || resistance > 10.0) {
      return NextResponse.json(
        { error: "Hero resistance must be between 0.0 and 10.0" },
        { status: 400 }
      );
    }

    // Update hero (only if it belongs to the user)
    const updatedHero = await db
      .update(heroes)
      .set({
        name,
        style,
        health: parseInt(health),
        damage: parseInt(damage),
        resistance: parseFloat(resistance),
        updatedAt: new Date(),
      })
      .where(and(eq(heroes.id, parseInt(id)), eq(heroes.userId, user.id))) // Use string comparison for userId
      .returning();

    if (updatedHero.length === 0) {
      return NextResponse.json(
        { error: "Hero not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ hero: updatedHero[0] });
  } catch (error) {
    console.error("Error updating hero:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a hero
export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Hero ID is required" },
        { status: 400 }
      );
    }

    // Delete hero (only if it belongs to the user)
    const deletedHero = await db
      .delete(heroes)
      .where(and(eq(heroes.id, parseInt(id)), eq(heroes.userId, user.id))) // Use string comparison for userId
      .returning();

    if (deletedHero.length === 0) {
      return NextResponse.json(
        { error: "Hero not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Hero deleted successfully" });
  } catch (error) {
    console.error("Error deleting hero:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
