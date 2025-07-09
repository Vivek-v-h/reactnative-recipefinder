import express from "express";
import { ENV } from "./config/env.js";
const app = express();
import { db } from "./config/db.js";
import { favourites } from "./db/schema.js"; 


const PORT = ENV.PORT || 5001;

app.use(express.json());
app.get("/api/health", (req, res) => {
    res.status(200).json({ success: true, message: "Server is running" });
});

app.post("/api/favourites",async (req, res) => {
    try {
        const{userId,recipeId,title,image,cookTime,servings} = req.body;
        if (!userId || !recipeId || !title ) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const newFav=await db.insert(favourites).values({
            userId,
            recipeId,
            title,
            image,
            cookTime,
            servings
        }).returning();

        res.status(201).json(newFav[0]);

    }catch (error) {
        console.error("Error adding favourites:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

app.get("/api/favorites/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const userFavorites = await db
      .select()
      .from(favourites)
      .where(eq(favourites.userId, userId));

    res.status(200).json(userFavorites);
  } catch (error) {
    console.log("Error fetching the favorites", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.delete("/api/favorites/:userId/:recipeId", async (req, res) => {
  try {
    const { userId, recipeId } = req.params;

    await db
      .delete(favourites)
      .where(
        and(eq(favourites.userId, userId), eq(favourites.recipeId, parseInt(recipeId)))
      );

    res.status(200).json({ message: "Favorite removed successfully" });
  } catch (error) {
    console.log("Error removing a favorite", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT,() => {
    console.log("Server is running on port 5001"); 
});