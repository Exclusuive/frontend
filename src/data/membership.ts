import { Item } from "@/types/collection";
import { Membership } from "@/types/user";
import { collections } from "./collections";

// Sample items for different membership types
const legendaryItems: Item[] = [
  {
    name: "Legendary Sword",
    address: "0x1234567890abcdef1234567890abcdef12345678",
    img_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    layer: "weapons",
    description: "A powerful sword with ancient enchantments",
    attributes: [
      { name: "Attack", value: "85" },
      { name: "Durability", value: "90" },
      { name: "Rarity", value: "95" },
    ],
  },
  {
    name: "Dragon Scale Armor",
    address: "0xabcdef1234567890abcdef1234567890abcdef12",
    img_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    layer: "armor",
    description: "Armor crafted from the scales of an ancient dragon",
    attributes: [
      { name: "Defense", value: "92" },
      { name: "Weight", value: "15" },
      { name: "Fire Resistance", value: "100" },
    ],
  },
  {
    name: "Crystal Staff",
    address: "0x567890abcdef1234567890abcdef1234567890ab",
    img_url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop",
    layer: "magic",
    description: "A staff imbued with powerful magical energy",
    attributes: [
      { name: "Magic Power", value: "88" },
      { name: "Mana Cost", value: "25" },
      { name: "Spell Range", value: "75" },
    ],
  },
];

const mageItems: Item[] = [
  {
    name: "Arcane Robe",
    address: "0xdef1234567890abcdef1234567890abcdef12345",
    img_url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop",
    layer: "armor",
    description: "A robe woven with magical threads",
    attributes: [
      { name: "Magic Affinity", value: "95" },
      { name: "Mana Regeneration", value: "80" },
      { name: "Spell Power", value: "90" },
    ],
  },
  {
    name: "Mystic Orb",
    address: "0x890abcdef1234567890abcdef1234567890abcdef",
    img_url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
    layer: "magic",
    description: "An orb that channels pure magical energy",
    attributes: [
      { name: "Magic Power", value: "100" },
      { name: "Spell Range", value: "85" },
      { name: "Mana Efficiency", value: "75" },
    ],
  },
  {
    name: "Wizard's Hat",
    address: "0x234567890abcdef1234567890abcdef1234567890",
    img_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    layer: "accessories",
    description: "A hat that enhances magical abilities",
    attributes: [
      { name: "Intelligence", value: "88" },
      { name: "Spell Accuracy", value: "92" },
      { name: "Magic Resistance", value: "70" },
    ],
  },
];

// Sample items in wallet
export const sampleItemsInWallet: Item[] = [
  {
    name: "Iron Dagger",
    address: "0x1111111111111111111111111111111111111111",
    img_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    layer: "weapons",
    description: "A basic but reliable dagger",
    attributes: [
      { name: "Attack", value: "45" },
      { name: "Durability", value: "70" },
      { name: "Rarity", value: "30" },
    ],
  },
  {
    name: "Leather Boots",
    address: "0x2222222222222222222222222222222222222222",
    img_url: "https://images.unsplash.com/photo-1549298916-b41d114d2c36?w=400&h=400&fit=crop",
    layer: "armor",
    description: "Comfortable leather boots for travel",
    attributes: [
      { name: "Defense", value: "25" },
      { name: "Weight", value: "5" },
      { name: "Movement Speed", value: "85" },
    ],
  },
  {
    name: "Healing Potion",
    address: "0x3333333333333333333333333333333333333333",
    img_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    layer: "consumables",
    description: "A potion that restores health",
    attributes: [
      { name: "Healing Power", value: "50" },
      { name: "Duration", value: "0" },
      { name: "Rarity", value: "20" },
    ],
  },
  {
    name: "Copper Ring",
    address: "0x4444444444444444444444444444444444444444",
    img_url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
    layer: "jewelry",
    description: "A simple copper ring",
    attributes: [
      { name: "Luck", value: "15" },
      { name: "Durability", value: "60" },
      { name: "Rarity", value: "25" },
    ],
  },
  {
    name: "Wooden Bow",
    address: "0x5555555555555555555555555555555555555555",
    img_url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop",
    layer: "weapons",
    description: "A basic wooden bow for hunting",
    attributes: [
      { name: "Attack", value: "40" },
      { name: "Range", value: "75" },
      { name: "Durability", value: "65" },
    ],
  },
  {
    name: "Cloth Robe",
    address: "0x6666666666666666666666666666666666666666",
    img_url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop",
    layer: "armor",
    description: "A simple cloth robe for mages",
    attributes: [
      { name: "Defense", value: "20" },
      { name: "Magic Affinity", value: "35" },
      { name: "Weight", value: "3" },
    ],
  },
];

// Comprehensive membership data
export const memberships: Membership[] = [
  {
    id: "membership-001",
    name: "Legendary Warrior Collection",
    imgUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=400&fit=crop",
    ownerAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    collection: collections[0],
    items: legendaryItems,
  },
  {
    id: "membership-002",
    name: "Arcane Mage Collection",
    imgUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop",
    ownerAddress: "0x8a2d35Cc6634C0532925a3b8D4C9db96C4b4d8b7",
    collection: collections[1],
    items: mageItems,
  },
];

export const sampleMemberships: Membership[] = memberships;
