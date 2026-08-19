'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { ProjectInsert, ProjectUpdate } from '@/types/project';

function extractStoragePath(url: string): string | null {
  try {
    const marker = '/storage/v1/object/public/project-images/';
    const idx = url.indexOf(marker);
    if (idx === -1) return null;
    return url.substring(idx + marker.length);
  } catch {
    return null;
  }
}

export async function createProjectAction(
  data: ProjectInsert,
  techStackIds: string[]
) {
  try {
    const supabase = await createClient();

    // Insert project
    const { data: project, error } = await supabase
      .from('projects')
      .insert(data)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    // Insert tech stacks junction
    if (techStackIds && techStackIds.length > 0) {
      const junctionRows = techStackIds.map((tsId) => ({
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

    revalidatePath('/', 'layout');
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/projects');
    return { success: true, data: project };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || 'Failed to create project' };
  }
}

export async function updateProjectAction(
  id: string,
  data: ProjectUpdate,
  techStackIds: string[],
  oldImageUrl?: string | null
) {
  try {
    const supabase = await createClient();

    // If image URL changed and old image exists, clean up old image
    if (oldImageUrl && data.image_url && oldImageUrl !== data.image_url) {
      const oldPath = extractStoragePath(oldImageUrl);
      if (oldPath) {
        await supabase.storage.from('project-images').remove([oldPath]);
      }
    }

    // Update project
    const { data: project, error } = await supabase
      .from('projects')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    // Reset junction table
    const { error: deleteError } = await supabase
      .from('project_tech_stacks')
      .delete()
      .eq('project_id', id);

    if (deleteError) {
      console.error('Failed to clear old tech stacks:', deleteError);
    }

    if (techStackIds && techStackIds.length > 0) {
      const junctionRows = techStackIds.map((tsId) => ({
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

    revalidatePath('/', 'layout');
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/projects');
    return { success: true, data: project };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || 'Failed to update project' };
  }
}

export async function deleteProjectAction(id: string, imageUrl?: string | null) {
  try {
    const supabase = await createClient();

    // Delete image if exists
    if (imageUrl) {
      const path = extractStoragePath(imageUrl);
      if (path) {
        await supabase.storage.from('project-images').remove([path]);
      }
    }

    // Delete project (junction cascades)
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/', 'layout');
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/projects');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || 'Failed to delete project' };
  }
}

export async function toggleProjectPublishedAction(id: string, isPublished: boolean) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('projects')
      .update({ is_published: isPublished })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/', 'layout');
    revalidatePath('/dashboard/projects');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || 'Failed to toggle published' };
  }
}

export async function toggleProjectFeaturedAction(id: string, isFeatured: boolean) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('projects')
      .update({ is_featured: isFeatured })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/', 'layout');
    revalidatePath('/dashboard/projects');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || 'Failed to toggle featured' };
  }
}
