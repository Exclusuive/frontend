import { Collection } from "@/types/collection";
import { initialMissions } from "./missions";

export const collections: Collection[] = [
  {
    name: "Art Collection",
    id: "0x123456789012345678901234567890123456781ascdasdcsaㅇ90",
    configs: {
      img_url: "https://picsum.photos/200/300",
      description: "Art Collection",
    },
    layer_types: ["Layer 1", "Layer 2", "Layer 3"],
    attribute_types: ["Property 1", "Property 2", "Property 3"],
    ticket_types: ["Ticket 1", "Ticket 2", "Ticket 3"],
    item_types: [
      {
        name: "Item 1",
        address: "0x123456789012345678901234567890123456781ascdasdcsaㅇ90",
        img_url: "https://picsum.photos/200/300",
        layer: "Layer 1",
        description: "Item 1 Description",
        attributes: [
          { name: "Property 1", value: "1" },
          { name: "Property 2", value: "2" },
        ],
      },
      {
        name: "Item 2",
        address: "0x123456789012345678901234567890123456781ascdasdcsaㅇ90",
        img_url: "https://picsum.photos/200/300",
        layer: "Layer 2",
        description: "Item 2 Description",
        attributes: [
          { name: "Property 1", value: "1" },
          { name: "Property 2", value: "2" },
        ],
      },
      {
        name: "Item 3",
        address: "0x123456789012345678901234567890123456781ascdasdcsaㅇ90",
        img_url: "https://picsum.photos/200/300",
        layer: "Layer 3",
        description: "Item 3 Description",
        attributes: [
          { name: "Property 1", value: "1" },
          { name: "Property 2", value: "2" },
        ],
      },
    ],
    market: [
      {
        address: "0x123456789012345678901234567890123456781ascdasdcsaㅇ90",
        name: "Market 1",
        slots: [
          {
            items: [
              {
                name: "Item 1",
                address: "0x123456789012345678901234567890123456781ascdasdcsaㅇ90",
                img_url: "https://picsum.photos/200/300",
                layer: "Layer 1",
                description: "Item 1 Description",
                attributes: [
                  { name: "Property 1", value: "1" },
                  { name: "Property 2", value: "2" },
                ],
              },
            ],
            price: 100,
            conditions: [{ name: "Ticket 1", value: "1" }],
          },
        ],
      },
    ],
    missions: initialMissions,
  },
  {
    name: "Music Collection",
    id: "0x1234567890123456789012345678901asdcsdc2345617890",
    configs: {
      img_url: "https://picsum.photos/200/300",
      description: "Music Collection",
    },
    layer_types: ["Layer 1", "Layer 2", "Layer 3"],
    attribute_types: ["Property 1", "Property 2", "Property 3"],
    ticket_types: ["Ticket 1", "Ticket 2", "Ticket 3"],
    missions: [],
  },
  {
    name: "Sports Collection",
    id: "0x12345678901234567890123456789012acaccas34567890",
    configs: {
      img_url: "https://picsum.photos/200/300",
      description: "Sports Collection",
    },
    layer_types: ["Layer 1", "Layer 2", "Layer 3"],
    attribute_types: ["Property 1", "Property 2", "Property 3"],
    ticket_types: ["Ticket 1", "Ticket 2", "Ticket 3"],
    missions: [],
  },
];
