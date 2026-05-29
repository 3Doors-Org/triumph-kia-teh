export const ORGANIZATION_DOOR_VALUES = ["ACCESS", "EXCELLENCE", "OPPORTUNITY", "INSTITUTION"] as const;

export type OrganizationDoor = (typeof ORGANIZATION_DOOR_VALUES)[number];

export const ORGANIZATION_SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;
