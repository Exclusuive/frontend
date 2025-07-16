export interface EventReward {
  id: string;
  image: string;
  name: string;
  description: string;
  rarity: "common" | "rare" | "epic" | "legendary" | "base";
}

export const rewards: EventReward[] = [
  {
    id: "0",
    image: "FinalNFT.jpg",
    name: "Base Character NFT",
    description: "Exclusive OceanDao participant NFT with unique ocean-themed design",
    rarity: "base",
  },
  {
    id: "1",
    image: "FinalNFT.jpg",
    name: "Socrates' Robe",
    description:
      "A legendary robe inspired by Socrates, symbolizing wisdom and philosophical insight.",
    rarity: "legendary",
  },
  {
    id: "2",
    image: "FinalNFT.jpg",
    name: "Spartan Helmet",
    description: "A rare helmet inspired by Spartan warriors, representing courage and strength.",
    rarity: "epic",
  },
  {
    id: "3",
    image: "FinalNFT.jpg",
    name: "Olympic Torch",
    description: "A rare Olympic torch commemorating the spirit of ancient Athens.",
    rarity: "rare",
  },
  {
    id: "4",
    image: "FinalNFT.jpg",
    name: "Sui Badge",
    description: "A badge that proudly represents your place in the Sui community.",
    rarity: "common",
  },
];
