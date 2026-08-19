export type TechStackCategory =
  | 'frontend'
  | 'backend'
  | 'ai'
  | 'desktop'
  | 'infrastructure'
  | 'other';

export type TechStack = {
  id: string;
  name: string;
  icon: string | null;
  icon_url: string | null;
  category: TechStackCategory;
  color: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type TechStackInsert = Omit<TechStack, 'id' | 'created_at' | 'updated_at'>;
export type TechStackUpdate = Partial<TechStackInsert>;
