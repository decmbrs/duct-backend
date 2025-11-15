import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "./auth.js";

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req, res) => {
  const conns = await prisma.connection.findMany({
    include: { from: true, to: true }
  });
  res.json(conns);
});

router.post("/", authenticateToken, async (req, res) => {
  const { fromId, toId } = req.body;
  const conn = await prisma.connection.create({
    data: { fromId, toId }
  });
  res.json(conn);
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  await prisma.connection.delete({ where: { id } });
  res.status(204).send();
});

export default router;
