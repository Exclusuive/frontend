import { Membership } from "@/types/user";

export interface MembershipByCollection {
  collectionName: string;
  collectionAddress: string;
  collectionImgUrl: string;
  memberships: Membership[];
}

/**
 * Organizes memberships by collection
 * @param memberships - Array of memberships to organize
 * @returns Array of memberships grouped by collection
 */
export const organizeMembershipsByCollection = (
  memberships: Membership[],
): MembershipByCollection[] => {
  const groupedMemberships = new Map<string, MembershipByCollection>();

  memberships.forEach((membership) => {
    const collectionName = membership.collection.name;
    const collectionAddress = membership.collection.id;
    const collectionImgUrl = membership.collection.configs?.img_url || "";

    if (!groupedMemberships.has(collectionName)) {
      groupedMemberships.set(collectionName, {
        collectionName,
        collectionAddress,
        collectionImgUrl,
        memberships: [],
      });
    }

    groupedMemberships.get(collectionName)!.memberships.push(membership);
  });

  return Array.from(groupedMemberships.values());
};

/**
 * Get memberships for a specific collection
 * @param memberships - Array of all memberships
 * @param collectionName - Name of the collection to filter by
 * @returns Array of memberships for the specified collection
 */
export const getMembershipsByCollection = (
  memberships: Membership[],
  collectionName: string,
): Membership[] => {
  return memberships.filter((membership) => membership.collection.name === collectionName);
};

/**
 * Get unique collection names from memberships
 * @param memberships - Array of memberships
 * @returns Array of unique collection names
 */
export const getUniqueCollectionNames = (memberships: Membership[]): string[] => {
  const collectionNames = new Set(memberships.map((membership) => membership.collection.name));
  return Array.from(collectionNames);
};
