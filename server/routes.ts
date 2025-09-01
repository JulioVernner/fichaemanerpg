import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCharacterSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all characters
  app.get("/api/characters", async (req, res) => {
    try {
      const characters = await storage.listCharacters();
      res.json(characters);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch characters" });
    }
  });

  // Get character by ID
  app.get("/api/characters/:id", async (req, res) => {
    try {
    console.log("Dados recebidos:", req.body);
    const validatedData = insertCharacterSchema.parse(req.body);
    console.log("Dados validados:", validatedData);

    const character = await storage.createCharacter(validatedData);
    console.log("Personagem criado:", character);

    res.status(201).json(character);
    }
    /*try {
      const character = await storage.getCharacter(req.params.id);
      if (!character) {
        return res.status(404).json({ message: "Character not found" });
      }
      res.json(character);
    }*/ catch (error) {
      res.status(500).json({ message: "Failed to fetch character" });
    }
  });

  // Create new character
  app.post("/api/characters", async (req, res) => {
    try {
      const validatedData = insertCharacterSchema.parse(req.body);
      const character = await storage.createCharacter(validatedData);
      res.status(201).json(character);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid character data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create character" });
    }
  });

  // Update character
  app.patch("/api/characters/:id", async (req, res) => {
    try {
      const partialSchema = insertCharacterSchema.partial();
      const validatedData = partialSchema.parse(req.body);
      const character = await storage.updateCharacter(req.params.id, validatedData);
      
      if (!character) {
        return res.status(404).json({ message: "Character not found" });
      }
      
      res.json(character);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid character data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update character" });
    }
  });

  // Delete character
  app.delete("/api/characters/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCharacter(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Character not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete character" });
    }
  });

  //const httpServer = createServer(app);
  //return httpServer;
}
