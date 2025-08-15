import { CollectionItem } from "@/types/collection";

export interface EventReward {
  id: string;
  item: CollectionItem & { collection_cap_id: string };
  rarity: "common" | "rare" | "epic" | "legendary" | "base";
  membership_type: string;
}

export const rewards: EventReward[] = [
  {
    id: "0",
    item: {
      id: "1",
      collection_id: "0x965e1118ddbdfd65af1809a80f6e1bf25cd45569ba2c09a13e8f1fb4b31f8a2c",
      collection_cap_id: "0x1246c99c9424575cf7be82fcc1e2f4e26a8ec3b58676d1f3827ac50c054b17ff",
      img_url:
        "https://ezesepaxcbbzvjjzivwe.supabase.co/storage/v1/object/public/exclusuive/item/Season1.png",
      layer: "Base",
      name: "시즌 1 독팜희 멤버십",
      description:
        "2024 아카라카를 기념해서 나온 독팜희 멤버십으로, 각 과의 고유한 상징을 담고 있으며, 모든 독팜희 시즌의 시작점이 된다.",
    },
    membership_type: "Season1",
    rarity: "base",
  },
  {
    id: "1",
    item: {
      id: "2",
      collection_id: "0x965e1118ddbdfd65af1809a80f6e1bf25cd45569ba2c09a13e8f1fb4b31f8a2c",
      collection_cap_id: "0x1246c99c9424575cf7be82fcc1e2f4e26a8ec3b58676d1f3827ac50c054b17ff",
      img_url:
        "https://ezesepaxcbbzvjjzivwe.supabase.co/storage/v1/object/public/exclusuive/item/Season2.png",
      layer: "Clothes",
      name: "시즌 2 독팜희 멤버십",
      description:
        "2025 아카라카를 기념해서 나온 독팜희 멤버십으로, 독팜희의 성격 유형을 8가지로 분류해 MBTI처럼 개성을 반영한다.",
    },
    membership_type: "Season2",
    rarity: "legendary",
  },
  {
    id: "2",
    item: {
      id: "3",
      collection_id: "0x965e1118ddbdfd65af1809a80f6e1bf25cd45569ba2c09a13e8f1fb4b31f8a2c",
      collection_cap_id: "0x1246c99c9424575cf7be82fcc1e2f4e26a8ec3b58676d1f3827ac50c054b17ff",
      img_url:
        "https://ezesepaxcbbzvjjzivwe.supabase.co/storage/v1/object/public/exclusuive/item/Athens.png",
      layer: "Head",
      name: "아테네 독팜희 멤버십",
      description:
        "ExcluSuive 팀이 아테네  OceanDAO Summit의 참여하게 된 것을 기념해서 나온 독팜희 멤버십. 미션을 통해 5가지 아이템을 얻어 풀 세트를 완성하면 특별한 보상이 있다.",
    },
    membership_type: "Athens",
    rarity: "epic",
  },
];
