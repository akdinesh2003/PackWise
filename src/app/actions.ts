'use server';

import { generateSmartChecklist, type GenerateSmartChecklistInput, type GenerateSmartChecklistOutput } from '@/ai/flows/generate-smart-checklist';

export async function generateChecklistAction(
  input: GenerateSmartChecklistInput
): Promise<GenerateSmartChecklistOutput | { error: string }> {
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
