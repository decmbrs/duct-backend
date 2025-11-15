import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "./auth.js";

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req, res) => {
  const { cableId } = req.query;
  
  try {
    const splices = await prisma.splice.findMany({
      where: { cableId },
      orderBy: { fiberNumber: 'asc' }
    });
    
    res.json(splices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  const { cableId, fiberNumber, splicedTo, splicedCableId, splicedFiber, notes } = req.body;
  
  try {
    const splice = await prisma.splice.upsert({
      where: {
        cableId_fiberNumber: {
          cableId,
          fiberNumber: parseInt(fiberNumber)
        }
      },
      update: {
        splicedTo: splicedTo || null,
        splicedCableId: splicedCableId || null,
        splicedFiber: splicedFiber ? parseInt(splicedFiber) : null,
        notes: notes || null
      },
      create: {
        cableId,
        fiberNumber: parseInt(fiberNumber),
        splicedTo: splicedTo || null,
        splicedCableId: splicedCableId || null,
        splicedFiber: splicedFiber ? parseInt(splicedFiber) : null,
        notes: notes || null
      }
    });
    
    res.json(splice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:cableId/:fiberNumber", authenticateToken, async (req, res) => {
  const { cableId, fiberNumber } = req.params;
  
  try {
    await prisma.splice.delete({
      where: {
        cableId_fiberNumber: {
          cableId,
          fiberNumber: parseInt(fiberNumber)
        }
      }
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/cable/:cableId", authenticateToken, async (req, res) => {
  const { cableId } = req.params;
  
  try {
    const result = await prisma.splice.deleteMany({
      where: { cableId }
    });
    
    res.json({ 
      success: true, 
      deletedCount: result.count 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
