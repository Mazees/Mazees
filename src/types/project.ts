import type { TechStack } from './techstack';

export type Project = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  long_description: string | null;
  image_url: string | null;
  demo_url: string | null;
  repo_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  tech_stacks?: TechStack[];
};

export type ProjectInsert = Omit<Project, 'id' | 'created_at' | 'updated_at' | 'tech_stacks'>;
export type ProjectUpdate = Partial<ProjectInsert>;
