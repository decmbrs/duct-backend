import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "./auth.js";

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req, res) => {
  const { connectionId } = req.query;
  
  try {
    let cables;
    if (connectionId) {
      const connection = await prisma.connection.findUnique({
        where: { id: connectionId }
      });
      
      if (!connection) {
        return res.status(404).json({ error: "Connection not found" });
      }
      
      cables = await prisma.cable.findMany({
        where: {
          OR: [
            { fromId: connection.fromId, toId: connection.toId },
            { fromId: connection.toId, toId: connection.fromId }
          ]
        },
        include: {
          from: true,
          to: true
        }
      });
    } else {
      cables = await prisma.cable.findMany({
        include: {
          from: true,
          to: true
        }
      });
    }
    
    res.json(cables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    const cable = await prisma.cable.findUnique({
      where: { id },
      include: {
        from: true,
        to: true,
        splices: {
          orderBy: { fiberNumber: 'asc' }
        }
      }
    });
    
    if (!cable) {
      return res.status(404).json({ error: "Cable not found" });
    }
    
    res.json(cable);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  const { name, fiberCount, fromId, toId } = req.body;
  
  try {
    const cable = await prisma.cable.create({
      data: {
        name,
        fiberCount: parseInt(fiberCount),
        fromId,
        toId
      },
      include: {
        from: true,
        to: true
      }
    });
    
    res.json(cable);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  
  try {
    await prisma.splice.deleteMany({
      where: { cableId: id }
    });
    
    await prisma.cable.delete({
      where: { id }
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
