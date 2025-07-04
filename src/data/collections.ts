import { initialMissions } from "./missions";

export const collections = [
  {
    name: "Art Collection",
    address: "0x123456789012345678901234567890123456781ascdasdcsaㅇ90",
    description: "Art Collection",
    imgUrl: "https://picsum.photos/200/300",
    layers: ["Layer 1", "Layer 2", "Layer 3"],
    attributes: ["Property 1", "Property 2", "Property 3"],
    tickets: ["Ticket 1", "Ticket 2", "Ticket 3"],
    items: [
      {
        name: "Item 1",
        address: "0x123456789012345678901234567890123456781ascdasdcsaㅇ90",
        imgUrl: "https://picsum.photos/200/300",
        layer: "Layer 1",
        description: "Item 1 Description",
        attributes: [
          { name: "Property 1", value: 1 },
          { name: "Property 2", value: 2 },
        ],
      },
      {
        name: "Item 2",
        address: "0x123456789012345678901234567890123456781ascdasdcsaㅇ90",
        imgUrl: "https://picsum.photos/200/300",
        layer: "Layer 2",
        description: "Item 2 Description",
        attributes: [
          { name: "Property 1", value: 1 },
          { name: "Property 2", value: 2 },
        ],
      },
      {
        name: "Item 3",
        address: "0x123456789012345678901234567890123456781ascdasdcsaㅇ90",
        imgUrl: "https://picsum.photos/200/300",
        layer: "Layer 3",
        description: "Item 3 Description",
        attributes: [
          { name: "Property 1", value: 1 },
          { name: "Property 2", value: 2 },
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
                imgUrl: "https://picsum.photos/200/300",
                layer: "Layer 1",
                description: "Item 1 Description",
                attributes: [
                  { name: "Property 1", value: 1 },
                  { name: "Property 2", value: 2 },
                ],
              },
            ],
            price: 100,
            conditions: [{ name: "Ticket 1", value: 1 }],
          },
        ],
      },
    ],
    missions: initialMissions,
  },
  {
    name: "Music Collection",
    address: "0x1234567890123456789012345678901asdcsdc2345617890",
    description: "Music Collection",
    imgUrl: "https://picsum.photos/200/300",
    layers: ["Layer 1", "Layer 2", "Layer 3"],
    attributes: ["Property 1", "Property 2", "Property 3"],
    tickets: ["Ticket 1", "Ticket 2", "Ticket 3"],
    missions: [],
  },
  {
    name: "Sports Collection",
    address: "0x12345678901234567890123456789012acaccas34567890",
    description: "Sports Collection",
    imgUrl: "https://picsum.photos/200/300",
    layers: ["Layer 1", "Layer 2", "Layer 3"],
    attributes: ["Property 1", "Property 2", "Property 3"],
    tickets: ["Ticket 1", "Ticket 2", "Ticket 3"],
    missions: [],
  },
];
