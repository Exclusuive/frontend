export const ORIGIN_PACKAGE_ID =
  "0x0b38e39e88cbd0bcf1118a7d584793923cbf272c41c7ec4e7a24b2e43079084f";
export const UPGRADED_PACKAGE_ID =
  "0x0b38e39e88cbd0bcf1118a7d584793923cbf272c41c7ec4e7a24b2e43079084f";
export const COMMUNITY_ID = "0x0506a3546577ee218530eab0747f211edb3c291947d16bf05e3757f468a06f11";
export const MARKET_ID = "0x052b1f15f9a87ddcac27fb8617757539356229c2023384be77de8558edfd9d05";

export const MODULE = {
  COMMUNITY: "community",
  MEMBERSHIP: "exclusuive_membership",
  ITEM: "item",
  MISSION: "mission",
  PAYMENT: "payment",
} as const;

// =====================================
// ================== Community Module
// =====================================
const COMMUNITY_MODULE_STRUCT_NAMES = {
  // Community
  Community: "Community",
  CommunityCap: "CommunityCap",
  // Type
  PermissionType: "PermissionType",
  CommunityManager: "CommunityManager",
  ItemManager: "ItemManager",
  MissionManager: "MissionManager",
  MembershipManager: "MembershipManager",
  ConfigType: "ConfigType",

  // Keys
  TypeKey: "TypeKey",
  PermissionTypeKey: "PermissionTypeKey",
} as const;

export const COMMUNITY_MODULE_STRUCTS = Object.fromEntries(
  Object.entries(COMMUNITY_MODULE_STRUCT_NAMES).map(([key, struct]) => [
    key,
    `${ORIGIN_PACKAGE_ID}::${MODULE.COMMUNITY}::${struct}`,
  ]),
) as Record<keyof typeof COMMUNITY_MODULE_STRUCT_NAMES, string>;

const COMMUNITY_MODULE_FUNCTION_NAMES = {
  // Entry
  create_community: "create_community",
  // permission
  grant_permission: "mint_membership",
  revoke_permission: "mint_item",
  has_permission: "mint_ticket",
  // New
  new_community: "new_community",
  // Register Type
  new_config_type: "new_config_type",
  update_config_type: "update_config_type",
} as const;

export const COMMUNITY_MODULE_FUNCTIONS = Object.fromEntries(
  Object.entries(COMMUNITY_MODULE_FUNCTION_NAMES).map(([key, func]) => [
    key,
    `${UPGRADED_PACKAGE_ID}::${MODULE.COMMUNITY}::${func}`,
  ]),
) as Record<keyof typeof COMMUNITY_MODULE_FUNCTION_NAMES, string>;

// =====================================
// ================== Membership Module
// =====================================
const MEMBERSHIP_MODULE_STRUCT_NAMES = {
  Membership: "Membership",
  MembershipType: "MembershipType",
  MembershipTypeKey: "MembershipTypeKey",
} as const;

export const MEMBERSHIP_MODULE_STRUCTS = Object.fromEntries(
  Object.entries(MEMBERSHIP_MODULE_STRUCT_NAMES).map(([key, struct]) => [
    key,
    `${ORIGIN_PACKAGE_ID}::${MODULE.MEMBERSHIP}::${struct}`,
  ]),
) as Record<keyof typeof MEMBERSHIP_MODULE_STRUCT_NAMES, string>;

const MEMBERSHIP_MODULE_FUNCTION_NAMES = {
  mint_membership: "mint_membership",
  new_membership: "new_membership",
  new_membership_type: "new_membership_type",
  get_membership_type: "get_membership_type",
} as const;

export const MEMBERSHIP_MODULE_FUNCTIONS = Object.fromEntries(
  Object.entries(MEMBERSHIP_MODULE_FUNCTION_NAMES).map(([key, func]) => [
    key,
    `${UPGRADED_PACKAGE_ID}::${MODULE.MEMBERSHIP}::${func}`,
  ]),
) as Record<keyof typeof MEMBERSHIP_MODULE_FUNCTION_NAMES, string>;

export const MEMBERSHIP_EVENT_NAMES = {
  MembershipMinted: "MembershipMinted",
} as const;

export const MEMBERSHIP_EVENTS = Object.fromEntries(
  Object.entries(MEMBERSHIP_EVENT_NAMES).map(([key, event]) => [
    key,
    `${UPGRADED_PACKAGE_ID}::${MODULE.MEMBERSHIP}::${event}`,
  ]),
) as Record<keyof typeof MEMBERSHIP_EVENT_NAMES, string>;

// =====================================
// ================== Item Module
// =====================================
const ITEM_MODULE_STRUCT_NAMES = {
  // TYPE
  SlotType: "SlotType",
  ItemType: "ItemType",
  TraitType: "TraitType",
  // Object
  Item: "Item",
  Trait: "Trait",

  // KEY
  SlotTypeKey: "SlotTypeKey",
  ItemTypeKey: "ItemTypeKey",
  TraitTypeKey: "TraitTypeKey",
  ItemKey: "ItemKey",
} as const;

export const ITEM_MODULE_STRUCTS = Object.fromEntries(
  Object.entries(ITEM_MODULE_STRUCT_NAMES).map(([key, struct]) => [
    key,
    `${ORIGIN_PACKAGE_ID}::${MODULE.ITEM}::${struct}`,
  ]),
) as Record<keyof typeof ITEM_MODULE_STRUCT_NAMES, string>;

const ITEM_MODULE_FUNCTION_NAMES = {
  new_slot_type: "new_slot_type",
  new_item_type: "new_item_type",
  new_trait_type: "new_trait_type",
  new_item: "new_item",
  new_trait: "new_trait",
  attach_trait_to_item: "attach_trait_to_item",
  equip_item_to_membership: "equip_item_to_membership",
  unequip_item_from_membership: "unequip_item_from_membership",
} as const;

export const ITEM_MODULE_FUNCTIONS = Object.fromEntries(
  Object.entries(ITEM_MODULE_FUNCTION_NAMES).map(([key, func]) => [
    key,
    `${UPGRADED_PACKAGE_ID}::${MODULE.ITEM}::${func}`,
  ]),
) as Record<keyof typeof ITEM_MODULE_FUNCTION_NAMES, string>;

export const ITEM_EVENT_NAMES = {
  ItemMinted: "ItemMinted",
} as const;

export const ITEM_EVENTS = Object.fromEntries(
  Object.entries(ITEM_EVENT_NAMES).map(([key, event]) => [
    key,
    `${UPGRADED_PACKAGE_ID}::${MODULE.ITEM}::${event}`,
  ]),
) as Record<keyof typeof ITEM_EVENT_NAMES, string>;

// =====================================
// ================== Payment Module
// =====================================
const PAYMENT_MODULE_STRUCT_NAMES = {
  // TYPE
  SlotType: "SlotType",
  ItemType: "ItemType",
  TraitType: "TraitType",
  // Object
  Item: "Item",
  Trait: "Trait",

  // KEY
  SlotTypeKey: "SlotTypeKey",
  ItemTypeKey: "ItemTypeKey",
  TraitTypeKey: "TraitTypeKey",
  ItemKey: "ItemKey",
} as const;

export const PAYMENT_MODULE_STRUCTS = Object.fromEntries(
  Object.entries(PAYMENT_MODULE_STRUCT_NAMES).map(([key, struct]) => [
    key,
    `${ORIGIN_PACKAGE_ID}::${MODULE.PAYMENT}::${struct}`,
  ]),
) as Record<keyof typeof PAYMENT_MODULE_STRUCT_NAMES, string>;

const PAYMENT_MODULE_FUNCTION_NAMES = {
  process_payment_with_membership: "process_payment_with_membership",
  process_payment_without_membership: "process_payment_without_membership",
} as const;

export const PAYMENT_MODULE_FUNCTIONS = Object.fromEntries(
  Object.entries(PAYMENT_MODULE_FUNCTION_NAMES).map(([key, func]) => [
    key,
    `${UPGRADED_PACKAGE_ID}::${MODULE.PAYMENT}::${func}`,
  ]),
) as Record<keyof typeof PAYMENT_MODULE_FUNCTION_NAMES, string>;

export const PAYMENT_EVENT_NAMES = {
  PaymentMinted: "PaymentMinted",
} as const;

export const PAYMENT_EVENTS = Object.fromEntries(
  Object.entries(PAYMENT_EVENT_NAMES).map(([key, event]) => [
    key,
    `${UPGRADED_PACKAGE_ID}::${MODULE.PAYMENT}::${event}`,
  ]),
) as Record<keyof typeof PAYMENT_EVENT_NAMES, string>;
