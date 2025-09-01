'use server';

import { generateSmartChecklist, type GenerateSmartChecklistInput } from '@/ai/flows/generate-smart-checklist';

export async function generateChecklistAction(
  input: GenerateSmartChecklistInput
): Promise<{ checklist: string[] } | { error: string }> {
  try {
    const result = await generateSmartChecklist(input);
    return result;
  } catch (e) {
    console.error(e);
    if (e instanceof Error) {
        return { error: e.message };
    }
    return { error: 'An unknown error occurred while generating the checklist. Please try again.' };
  }
}
