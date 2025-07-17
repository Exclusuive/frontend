import { CollectionItem } from "@/types/collection";

export interface EventReward {
  id: string;
  item: CollectionItem & { collection_cap_id: string };
  rarity: "common" | "rare" | "epic" | "legendary" | "base";
  dayOfWeek: number; // 0-6(Sunday-Saturday)
}

export const rewards: EventReward[] = [
  {
    id: "0",
    item: {
      id: "1",
      collection_id: "0x82bdd350f8c343aa1ddb9dbcb195f6851dd2715c73fe01ef34867ba0b3ba5789",
      collection_cap_id: "0x1acfe62f7931d2b53627da4df85b555c1e5b5be0b87cc8ffe72714f1d77edb6e",
      img_url:
        "https://ezesepaxcbbzvjjzivwe.supabase.co/storage/v1/object/public/exclusuive/item/1.png",
      layer: "Base",
      name: "Base Character",
      description: "Exclusive OceanDao participant NFT with unique ocean-themed design",
    },
    rarity: "base",
    dayOfWeek: 1, // Sunday
  },
  {
    id: "1",
    item: {
      id: "2",
      collection_id: "0x82bdd350f8c343aa1ddb9dbcb195f6851dd2715c73fe01ef34867ba0b3ba5789",
      collection_cap_id: "0x1acfe62f7931d2b53627da4df85b555c1e5b5be0b87cc8ffe72714f1d77edb6e",
      img_url:
        "https://ezesepaxcbbzvjjzivwe.supabase.co/storage/v1/object/public/exclusuive/item/2.png",
      layer: "Clothes",
      name: "Socrates' Robe",
      description:
        "A legendary robe inspired by Socrates, symbolizing wisdom and philosophical insight.",
    },
    rarity: "legendary",
    dayOfWeek: 2, // Monday
  },
  {
    id: "2",
    item: {
      id: "3",
      collection_id: "0x82bdd350f8c343aa1ddb9dbcb195f6851dd2715c73fe01ef34867ba0b3ba5789",
      collection_cap_id: "0x1acfe62f7931d2b53627da4df85b555c1e5b5be0b87cc8ffe72714f1d77edb6e",
      img_url:
        "https://ezesepaxcbbzvjjzivwe.supabase.co/storage/v1/object/public/exclusuive/item/3.png",
      layer: "Head",
      name: "Spartan Helmet",
      description: "A rare helmet inspired by Spartan warriors, representing courage and strength.",
    },
    rarity: "epic",
    dayOfWeek: 3, // Tuesday
  },
  {
    id: "3",
    item: {
      id: "4",
      collection_id: "0x82bdd350f8c343aa1ddb9dbcb195f6851dd2715c73fe01ef34867ba0b3ba5789",
      collection_cap_id: "0x1acfe62f7931d2b53627da4df85b555c1e5b5be0b87cc8ffe72714f1d77edb6e",
      img_url:
        "https://ezesepaxcbbzvjjzivwe.supabase.co/storage/v1/object/public/exclusuive/item/4.png",
      layer: "Hand",
      name: "Olympic Torch",
      description: "A rare Olympic torch commemorating the spirit of ancient Athens.",
    },
    rarity: "rare",
    dayOfWeek: 4, // Wednesday
  },
  {
    id: "4",
    item: {
      id: "5",
      collection_id: "0x82bdd350f8c343aa1ddb9dbcb195f6851dd2715c73fe01ef34867ba0b3ba5789",
      collection_cap_id: "0x1acfe62f7931d2b53627da4df85b555c1e5b5be0b87cc8ffe72714f1d77edb6e",
      img_url:
        "https://ezesepaxcbbzvjjzivwe.supabase.co/storage/v1/object/public/exclusuive/item/5.png",
      layer: "Accessory",
      name: "Sui Badge",
      description: "A badge that proudly represents your place in the Sui community.",
    },
    rarity: "common",
    dayOfWeek: 5, // Thursday
  },
];

// Time-based reward selection utility functions
export const getCurrentReward = (): EventReward => {
  const now = new Date();
  const currentDay = now.getDay();

  // Find the reward that matches current day
  const currentReward = rewards.find((reward) => {
    return reward.dayOfWeek === currentDay;
  });

  // If no specific day-based reward, return the first reward as default
  return currentReward || rewards[0];
};

export const getNextReward = (): { reward: EventReward; timeUntil: number } => {
  const now = new Date();
  const currentDay = now.getDay();

  // Find the next reward
  for (let dayOffset = 1; dayOffset <= 7; dayOffset++) {
    const targetDay = (currentDay + dayOffset) % 7;
    const nextReward = rewards.find((reward) => reward.dayOfWeek === targetDay);
    if (nextReward) {
      // Calculate time until next reward (in minutes)
      const timeUntil = dayOffset * 24 * 60; // Convert days to minutes
      return { reward: nextReward, timeUntil };
    }
  }

  // Fallback to first reward
  return { reward: rewards[0], timeUntil: 0 };
};

export const formatTimeRemaining = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};
