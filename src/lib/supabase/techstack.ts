import { createClient } from './server';
import type { TechStack, TechStackInsert, TechStackUpdate } from '@/types/techstack';

/**
 * Get all tech stacks, ordered by category then order_index.
 * Used by both public pages and dashboard.
 */
export async function getTechStacks(): Promise<TechStack[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('tech_stacks')
    .select('*')
    .order('category')
    .order('order_index');

  if (error) {
    console.error('Failed to fetch tech stacks:', error);
    return [];
  }
  return data ?? [];
}

/**
 * Get a single tech stack by ID.
 */
export async function getTechStackById(id: string): Promise<TechStack | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('tech_stacks')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Failed to fetch tech stack:', error);
    return null;
  }
  return data;
}

/**
 * Create a new tech stack entry.
 */
export async function createTechStack(input: TechStackInsert): Promise<TechStack | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('tech_stacks')
    .insert(input)
    .select()
    .single();

  if (error) {
    console.error('Failed to create tech stack:', error);
    throw new Error(error.message);
  }
  return data;
}

/**
 * Update an existing tech stack entry.
 */
export async function updateTechStack(id: string, input: TechStackUpdate): Promise<TechStack | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('tech_stacks')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Failed to update tech stack:', error);
    throw new Error(error.message);
  }
  return data;
}

/**
 * Delete a tech stack entry.
 * Junction records (project_tech_stacks) will be deleted via CASCADE.
 */
export async function deleteTechStack(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('tech_stacks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Failed to delete tech stack:', error);
    throw new Error(error.message);
  }
  return true;
}

/**
 * Count how many projects use this tech stack.
 */
export async function getTechStackUsageCount(id: string): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('project_tech_stacks')
    .select('*', { count: 'exact', head: true })
    .eq('tech_stack_id', id);

  if (error) {
    console.error('Failed to count tech stack usage:', error);
    return 0;
  }
  return count ?? 0;
}
