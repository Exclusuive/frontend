export const ORIGIN_PACKAGE_ID =
  "0xc074172d84e2a9754e2a3bcc65f2e18f0539510f28e8538114338c73422a5e6f";
export const UPGRADED_PACKAGE_ID =
  "0xc074172d84e2a9754e2a3bcc65f2e18f0539510f28e8538114338c73422a5e6f";
export const COMMUNITY_ID = "0x491f598798ba32035cb5ed3cc2f762560a2877f79a8f75965d78b82d7a671bf8";

export const MODULE = {
  COMMUNITY: "community",
  MEMBERSHIP: "membership",
  ITEM: "item",
  MISSION: "mission",
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
