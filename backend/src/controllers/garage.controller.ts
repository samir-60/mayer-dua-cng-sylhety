import { Response } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const PurchaseItemSchema = z.object({
  itemId: z.string().min(1),
});

const EquipItemSchema = z.object({
  itemId: z.string().min(1),
  category: z.enum(['PAINT', 'DECAL', 'HORN', 'ACCESSORY']),
});

export async function getGarage(req: AuthenticatedRequest, res: Response): Promise<void> {
  const player = req.player;

  const allItems = await prisma.garageItem.findMany();
  const playerItems = await prisma.playerItem.findMany({
    where: { playerId: player.id },
  });

  const purchasedSet = new Set<string>(playerItems.map((pi) => pi.garageItemId));

  const items = allItems.map((item) => ({
    id: item.id,
    nameBn: item.nameBn,
    nameEn: item.nameEn,
    descriptionBn: item.descriptionBn,
    descriptionEn: item.descriptionEn,
    category: item.category,
    priceTaka: item.priceTaka,
    previewColor: item.previewColor,
    previewIcon: item.previewIcon,
    isPurchased: purchasedSet.has(item.id) || item.priceTaka === 0,
    isEquipped:
      (item.category === 'PAINT' && player.equippedPaint === item.id) ||
      (item.category === 'DECAL' && player.equippedDecal === item.id) ||
      (item.category === 'HORN' && player.equippedHorn === item.id) ||
      (item.category === 'ACCESSORY' && player.equippedAccessory === item.id),
    statBonus: {
      speedBoost: item.speedBoost,
      handlingBoost: item.handlingBoost,
      chaosMultiplier: item.chaosMultiplier,
    },
  }));

  res.json({
    success: true,
    playerTaka: player.taka,
    items,
  });
}

export async function purchaseItem(req: AuthenticatedRequest, res: Response): Promise<void> {
  const player = req.player;
  const { itemId } = PurchaseItemSchema.parse(req.body);

  const item = await prisma.garageItem.findUnique({
    where: { id: itemId },
  });

  if (!item) {
    res.status(404).json({ success: false, error: 'Item not found in garage catalogue.' });
    return;
  }

  // Check if already purchased
  const alreadyPurchased = await prisma.playerItem.findUnique({
    where: {
      playerId_garageItemId: {
        playerId: player.id,
        garageItemId: itemId,
      },
    },
  });

  if (alreadyPurchased) {
    res.status(400).json({ success: false, error: 'Item already purchased!' });
    return;
  }

  if (player.taka < item.priceTaka) {
    res.status(400).json({
      success: false,
      error: `টাকা কম মামা! আপনার কাছে আছে ${player.taka} টাকা, আইটেমের দাম ${item.priceTaka} টাকা।`,
    });
    return;
  }

  // Deduct Taka and add item
  const newTaka = player.taka - item.priceTaka;

  await prisma.$transaction([
    prisma.player.update({
      where: { id: player.id },
      data: { taka: newTaka },
    }),
    prisma.playerItem.create({
      data: {
        playerId: player.id,
        garageItemId: itemId,
      },
    }),
  ]);

  res.json({
    success: true,
    message: 'Item purchased successfully!',
    newTaka,
    purchasedItemId: itemId,
  });
}

export async function equipItem(req: AuthenticatedRequest, res: Response): Promise<void> {
  const player = req.player;
  const { itemId, category } = EquipItemSchema.parse(req.body);

  const item = await prisma.garageItem.findUnique({
    where: { id: itemId },
  });

  if (!item) {
    res.status(404).json({ success: false, error: 'Item not found' });
    return;
  }

  // Check ownership (free items with price 0 are always owned)
  if (item.priceTaka > 0) {
    const owned = await prisma.playerItem.findUnique({
      where: {
        playerId_garageItemId: {
          playerId: player.id,
          garageItemId: itemId,
        },
      },
    });

    if (!owned) {
      res.status(403).json({ success: false, error: 'You must purchase this item before equipping it.' });
      return;
    }
  }

  const updateData: any = {};
  if (category === 'PAINT') updateData.equippedPaint = itemId;
  if (category === 'DECAL') updateData.equippedDecal = itemId;
  if (category === 'HORN') updateData.equippedHorn = itemId;
  if (category === 'ACCESSORY') updateData.equippedAccessory = itemId;

  const updatedPlayer = await prisma.player.update({
    where: { id: player.id },
    data: updateData,
  });

  res.json({
    success: true,
    message: 'Item equipped successfully!',
    equipped: {
      paint: updatedPlayer.equippedPaint,
      decal: updatedPlayer.equippedDecal,
      horn: updatedPlayer.equippedHorn,
      accessory: updatedPlayer.equippedAccessory,
    },
  });
}
