import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "./auth.js";

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req, res) => {
  const items = await prisma.mapObject.findMany();
  res.json(items);
});

router.post("/", authenticateToken, async (req, res) => {
  const { type, lat, lng } = req.body;

  const item = await prisma.mapObject.create({
    data: { type, lat, lng }
  });

  res.json(item);
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  await prisma.$transaction(async (tx) => {
    const cables = await tx.cable.findMany({
      where: {
        OR: [{ fromId: id }, { toId: id }]
      },
      select: { id: true }
    });

    if (cables.length > 0) {
      await tx.splice.deleteMany({
        where: { cableId: { in: cables.map(c => c.id) } }
      });

      await tx.cable.deleteMany({
        where: { id: { in: cables.map(c => c.id) } }
      });
    }

    await tx.connection.deleteMany({
      where: {
        OR: [{ fromId: id }, { toId: id }]
      }
    });

    await tx.mapObject.delete({
      where: { id }
    });
  });

  res.status(200).json({ success: true });
});

export default router;
