import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "./auth.js";

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req, res) => {
  const conns = await prisma.connection.findMany({
    include: { from: true, to: true }
  });
  
  const parsed = conns.map(conn => ({
    ...conn,
    waypoints: conn.waypoints ? JSON.parse(conn.waypoints) : []
  }));
  
  res.json(parsed);
});

router.post("/", authenticateToken, async (req, res) => {
  const { fromId, toId } = req.body;
  const conn = await prisma.connection.create({
    data: { 
      fromId, 
      toId,
      waypoints: "[]"
    }
  });
  
  res.json({
    ...conn,
    waypoints: []
  });
});

router.patch("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { waypoints } = req.body;

  try {
    const updated = await prisma.connection.update({
      where: { id },
      data: { 
        waypoints: JSON.stringify(waypoints)
      }
    });

    res.json({
      ...updated,
      waypoints: JSON.parse(updated.waypoints)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  await prisma.connection.delete({ where: { id } });
  res.status(204).send();
});

export default router;
