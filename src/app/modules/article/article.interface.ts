export type TArticle = {
  id: number;
  title: string;
  body: string;
  tags: string[];
  userId: number;
  createdAt: Date;
  updatedAt: Date;
};

export interface ParsedArticle {
  title: string;
  body: string;
  tags: string[];
}
