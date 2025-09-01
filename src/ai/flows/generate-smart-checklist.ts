'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a smart packing checklist based on trip type, duration, and weather conditions.
 *
 * - generateSmartChecklist - A function that generates the packing checklist.
 * - GenerateSmartChecklistInput - The input type for the generateSmartChecklist function.
 * - GenerateSmartChecklistOutput - The return type for the generateSmartChecklist function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSmartChecklistInputSchema = z.object({
  tripType: z
    .string()
    .describe("The type of trip (e.g., 'beach', 'hiking', 'business')."),
  duration: z
    .number()
    .describe('The duration of the trip in days.')
    .min(1)
    .max(30),
  weatherConditions: z
    .string()
    .describe("The weather conditions expected during the trip (e.g., 'hot', 'cold', 'rainy', 'snowy')."),
});
export type GenerateSmartChecklistInput = z.infer<typeof GenerateSmartChecklistInputSchema>;

const GenerateSmartChecklistOutputSchema = z.object({
  checklist: z.array(z.string()).describe('A list of suggested packing items.'),
});
export type GenerateSmartChecklistOutput = z.infer<typeof GenerateSmartChecklistOutputSchema>;

export async function generateSmartChecklist(input: GenerateSmartChecklistInput): Promise<GenerateSmartChecklistOutput> {
  return generateSmartChecklistFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSmartChecklistPrompt',
  input: {schema: GenerateSmartChecklistInputSchema},
  output: {schema: GenerateSmartChecklistOutputSchema},
  prompt: `You are a packing assistant that generates a packing checklist based on the trip type, duration, and weather conditions.

  Trip Type: {{tripType}}
  Duration: {{duration}} days
  Weather Conditions: {{weatherConditions}}

  Generate a list of essential packing items tailored for this trip. Be concise and only include the item name.  Consider the duration and weather conditions when determining quantities and specific items.
`,
});

const generateSmartChecklistFlow = ai.defineFlow(
  {
    name: 'generateSmartChecklistFlow',
    inputSchema: GenerateSmartChecklistInputSchema,
    outputSchema: GenerateSmartChecklistOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
