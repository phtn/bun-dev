interface SpotlightPostSchema {
  id: string;
  thumbnail: string;
  cover: string;
  content: string;
  createdById: string;
  createdByName: string;
  symbol?: string | null | undefined;
  title?: string | null | undefined;
  category?: string | undefined;
  icon?: string | undefined;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
};
