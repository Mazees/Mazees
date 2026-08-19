import { createClient } from './server';
import type { Project, ProjectInsert, ProjectUpdate } from '@/types/project';

/**
 * Get all published projects with their tech stacks.
 * Used by the public portfolio page.
 */
export async function getPublishedProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      tech_stacks:project_tech_stacks(
        tech_stack:tech_stacks(*)
      )
    `)
    .eq('is_published', true)
    .order('is_featured', { ascending: false })
    .order('order_index')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch published projects:', error);
    return [];
  }

  // Flatten the nested tech_stacks structure
  return (data ?? []).map(project => ({
    ...project,
    tech_stacks: project.tech_stacks?.map((jt: { tech_stack: unknown }) => jt.tech_stack).filter(Boolean) ?? [],
  }));
}

/**
 * Get featured projects (published + is_featured).
 */
export async function getFeaturedProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      tech_stacks:project_tech_stacks(
        tech_stack:tech_stacks(*)
      )
    `)
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('order_index')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch featured projects:', error);
    return [];
  }

  return (data ?? []).map(project => ({
    ...project,
    tech_stacks: project.tech_stacks?.map((jt: { tech_stack: unknown }) => jt.tech_stack).filter(Boolean) ?? [],
  }));
}

/**
 * Get ALL projects (for dashboard — includes drafts).
 */
export async function getAllProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      tech_stacks:project_tech_stacks(
        tech_stack:tech_stacks(*)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch all projects:', error);
    return [];
  }

  return (data ?? []).map(project => ({
    ...project,
    tech_stacks: project.tech_stacks?.map((jt: { tech_stack: unknown }) => jt.tech_stack).filter(Boolean) ?? [],
  }));
}

/**
 * Get a single project by Slug with tech stacks.
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      tech_stacks:project_tech_stacks(
        tech_stack:tech_stacks(*)
      )
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) {
    console.error('Failed to fetch project by slug:', error);
    return null;
  }

  return {
    ...data,
    tech_stacks: data.tech_stacks?.map((jt: { tech_stack: unknown }) => jt.tech_stack).filter(Boolean) ?? [],
  };
}

/**
 * Get a single project by ID with tech stacks.
 */
export async function getProjectById(id: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      tech_stacks:project_tech_stacks(
        tech_stack:tech_stacks(*)
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Failed to fetch project:', error);
    return null;
  }

  return {
    ...data,
    tech_stacks: data.tech_stacks?.map((jt: { tech_stack: unknown }) => jt.tech_stack).filter(Boolean) ?? [],
  };
}

/**
 * Create a new project and link its tech stacks.
 */
export async function createProject(
  input: ProjectInsert,
  techStackIds: string[]
): Promise<Project | null> {
  const supabase = await createClient();

  // Insert the project
  const { data: project, error } = await supabase
    .from('projects')
    .insert(input)
    .select()
    .single();

  if (error) {
    console.error('Failed to create project:', error);
    throw new Error(error.message);
  }

  // Insert junction records
  if (techStackIds.length > 0) {
    const junctionRows = techStackIds.map(tsId => ({
      project_id: project.id,
      tech_stack_id: tsId,
    }));

    const { error: junctionError } = await supabase
      .from('project_tech_stacks')
      .insert(junctionRows);

    if (junctionError) {
      console.error('Failed to link tech stacks:', junctionError);
    }
  }

  return project;
}

/**
 * Update a project and sync its tech stacks.
 */
export async function updateProject(
  id: string,
  input: ProjectUpdate,
  techStackIds: string[]
): Promise<Project | null> {
  const supabase = await createClient();

  // Update the project
  const { data: project, error } = await supabase
    .from('projects')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Failed to update project:', error);
    throw new Error(error.message);
  }

  // Sync junction: delete all existing, then re-insert
  const { error: deleteError } = await supabase
    .from('project_tech_stacks')
    .delete()
    .eq('project_id', id);

  if (deleteError) {
    console.error('Failed to clear old tech stacks:', deleteError);
  }

  if (techStackIds.length > 0) {
    const junctionRows = techStackIds.map(tsId => ({
      project_id: id,
      tech_stack_id: tsId,
    }));

    const { error: junctionError } = await supabase
      .from('project_tech_stacks')
      .insert(junctionRows);

    if (junctionError) {
      console.error('Failed to link tech stacks:', junctionError);
    }
  }

  return project;
}

/**
 * Delete a project and its image from storage.
 */
export async function deleteProject(id: string, imageUrl?: string | null): Promise<boolean> {
  const supabase = await createClient();

  // Delete image from storage if exists
  if (imageUrl) {
    const path = extractStoragePath(imageUrl);
    if (path) {
      await supabase.storage.from('project-images').remove([path]);
    }
  }

  // Junction records are deleted via CASCADE
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Failed to delete project:', error);
    throw new Error(error.message);
  }
  return true;
}

/**
 * Toggle a project's published status.
 */
export async function toggleProjectPublished(id: string, isPublished: boolean): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('projects')
    .update({ is_published: isPublished })
    .eq('id', id);

  if (error) {
    console.error('Failed to toggle published:', error);
    throw new Error(error.message);
  }
  return true;
}

/**
 * Toggle a project's featured status.
 */
export async function toggleProjectFeatured(id: string, isFeatured: boolean): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('projects')
    .update({ is_featured: isFeatured })
    .eq('id', id);

  if (error) {
    console.error('Failed to toggle featured:', error);
    throw new Error(error.message);
  }
  return true;
}

/**
 * Extract the storage file path from a Supabase public URL.
 */
function extractStoragePath(url: string): string | null {
  try {
    const parts = url.split('/storage/v1/object/public/project-images/');
    return parts[1] ?? null;
  } catch {
    return null;
  }
}
