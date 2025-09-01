'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Wand2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { tripTypes, weatherConditions } from '@/lib/types';
import type { GenerateSmartChecklistInput } from '@/ai/flows/generate-smart-checklist';

const formSchema = z.object({
  tripType: z.string({ required_error: 'Please select a trip type.' }),
  duration: z.coerce.number().min(1, 'Duration must be at least 1 day.').max(90, 'Duration cannot exceed 90 days.'),
  weatherConditions: z.string({ required_error: 'Please select the weather.' }),
});

type ChecklistGeneratorProps = {
  onGenerate: (data: GenerateSmartChecklistInput) => void;
  isPending: boolean;
  itemCount: number;
};

export default function ChecklistGenerator({ onGenerate, isPending, itemCount }: ChecklistGeneratorProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      duration: 7,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onGenerate(values as GenerateSmartChecklistInput);
  }

  return (
    <Card className="mb-8 shadow-lg no-print">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Plan Your Trip</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="tripType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trip Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a trip type..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tripTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (days)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 7" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weatherConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Weather</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select weather conditions..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {weatherConditions.map((weather) => (
                          <SelectItem key={weather.value} value={weather.value}>
                            {weather.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isPending} className="w-full md:w-auto">
              <Wand2 className="mr-2 h-4 w-4" />
              {isPending ? 'Generating...' : itemCount > 0 ? 'Generate New Suggestions' : 'Generate Checklist'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
