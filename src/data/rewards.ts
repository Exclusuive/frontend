import { CollectionItem } from "@/types/collection";

export interface EventReward {
  id: string;
  item: CollectionItem & { collection_cap_id: string };
  rarity: "common" | "rare" | "epic" | "legendary" | "base";
  date: string;
}

export const rewards: EventReward[] = [
  {
    id: "0",
    item: {
      id: "1",
      collection_id: "0x965e1118ddbdfd65af1809a80f6e1bf25cd45569ba2c09a13e8f1fb4b31f8a2c",
      collection_cap_id: "0x1246c99c9424575cf7be82fcc1e2f4e26a8ec3b58676d1f3827ac50c054b17ff",
      img_url:
        "https://ezesepaxcbbzvjjzivwe.supabase.co/storage/v1/object/public/exclusuive/item/1.png",
      layer: "Base",
      name: "Base Character",
      description:
        "The basic NFT of the Ocean DAO Community. Collect items and customize your NFT!",
    },
    rarity: "base",
    date: "08-11 Blockthon2025 Hacker House",
  },
  {
    id: "1",
    item: {
      id: "2",
      collection_id: "0x965e1118ddbdfd65af1809a80f6e1bf25cd45569ba2c09a13e8f1fb4b31f8a2c",
      collection_cap_id: "0x1246c99c9424575cf7be82fcc1e2f4e26a8ec3b58676d1f3827ac50c054b17ff",
      img_url:
        "https://ezesepaxcbbzvjjzivwe.supabase.co/storage/v1/object/public/exclusuive/item/2.png",
      layer: "Clothes",
      name: "Socrates' Robe",
      description:
        "A legendary robe inspired by Socrates, symbolizing wisdom and philosophical insight.",
    },
    rarity: "legendary",
    date: "08-11 ~ 08-15 Blockthon2025 Online Mentoring Session",
  },
  {
    id: "2",
    item: {
      id: "3",
      collection_id: "0x965e1118ddbdfd65af1809a80f6e1bf25cd45569ba2c09a13e8f1fb4b31f8a2c",
      collection_cap_id: "0x1246c99c9424575cf7be82fcc1e2f4e26a8ec3b58676d1f3827ac50c054b17ff",
      img_url:
        "https://ezesepaxcbbzvjjzivwe.supabase.co/storage/v1/object/public/exclusuive/item/3.png",
      layer: "Head",
      name: "Spartan Helmet",
      description: "A rare helmet inspired by Spartan warriors, representing courage and strength.",
    },
    rarity: "epic",
    date: "08-22 Blockthon2025 대면 해커톤",
  },
  {
    id: "3",
    item: {
      id: "4",
      collection_id: "0x965e1118ddbdfd65af1809a80f6e1bf25cd45569ba2c09a13e8f1fb4b31f8a2c",
      collection_cap_id: "0x1246c99c9424575cf7be82fcc1e2f4e26a8ec3b58676d1f3827ac50c054b17ff",
      img_url:
        "https://ezesepaxcbbzvjjzivwe.supabase.co/storage/v1/object/public/exclusuive/item/4.png",
      layer: "Hand",
      name: "Olympic Torch",
      description: "A rare Olympic torch commemorating the spirit of ancient Athens.",
    },
    rarity: "rare",
    date: "08-23 Blockthon2025 데모데이",
  },
];
