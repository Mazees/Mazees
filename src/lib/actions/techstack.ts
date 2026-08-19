'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { TechStackInsert, TechStackUpdate } from '@/types/techstack';

export async function createTechStackAction(data: TechStackInsert) {
  try {
    const supabase = await createClient();
    const { data: result, error } = await supabase
      .from('tech_stacks')
      .insert(data)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/', 'layout');
    revalidatePath('/dashboard/techstack');
    return { success: true, data: result };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || 'Failed to create tech stack' };
  }
}

export async function updateTechStackAction(id: string, data: TechStackUpdate) {
  try {
    const supabase = await createClient();
    const { data: result, error } = await supabase
      .from('tech_stacks')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/', 'layout');
    revalidatePath('/dashboard/techstack');
    return { success: true, data: result };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || 'Failed to update tech stack' };
  }
}

export async function deleteTechStackAction(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('tech_stacks')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/', 'layout');
    revalidatePath('/dashboard/techstack');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || 'Failed to delete tech stack' };
  }
}

export async function reorderTechStacksAction(orderedIds: string[]) {
  try {
    const supabase = await createClient();

    const updates = orderedIds.map((id, index) =>
      supabase
        .from('tech_stacks')
        .update({ order_index: index })
        .eq('id', id)
    );

    await Promise.all(updates);

    revalidatePath('/', 'layout');
    revalidatePath('/dashboard/techstack');
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: (err as Error).message || 'Failed to reorder tech stack',
    };
  }
}

