// Shared TypeScript types for DearUs

/**
 * Represents a Little Thing — the personalized question experience.
 * Placeholder type — will be expanded in Milestone 1.
 */
export interface LittleThing {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Route parameter types
 */
export type PageParams = {
  id: string;
};

export type LittleThingParams = {
  publicId: string;
};
