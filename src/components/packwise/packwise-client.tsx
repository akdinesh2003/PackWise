'use client';

import { useState, useTransition, useEffect, useCallback } from 'react';
import { generateChecklistAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { GenerateSmartChecklistInput } from '@/ai/flows/generate-smart-checklist';
import type { ChecklistItem, Category, Checklist } from '@/lib/types';
import { categories } from '@/lib/types';

import Header from './header';
import ChecklistGenerator from './checklist-generator';
import ChecklistDisplay from './checklist-display';
import ChecklistActions from './checklist-actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '../ui/button';

const LOCAL_STORAGE_KEY = 'packwise-checklist';

export default function PackwiseClient() {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [title, setTitle] = useState('My Awesome Trip');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const parsedData: Checklist = JSON.parse(savedData);
        setChecklist(parsedData.items || []);
        setTitle(parsedData.title || 'My Awesome Trip');
      }
    } catch (error) {
      console.error("Failed to load from local storage", error);
    }
  }, []);

  useEffect(() => {
    try {
      const dataToSave: Checklist = { title, items: checklist };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error("Failed to save to local storage", error);
    }
  }, [checklist, title]);
  
  const handleGenerate = (data: GenerateSmartChecklistInput) => {
    const runGeneration = () => {
       startTransition(async () => {
        const result = await generateChecklistAction(data);
        if ('error' in result) {
          toast({
            variant: 'destructive',
            title: 'Uh oh! Something went wrong.',
            description: result.error,
          });
        } else if (result.checklist) {
          const newItems = result.checklist.map((name) => ({
            id: crypto.randomUUID(),
            name,
            packed: false,
            category: 'Miscellaneous' as Category,
          }));
          setChecklist(newItems);
          setTitle(`${data.tripType} to somewhere ${data.weatherConditions}`);
          toast({
            title: 'Checklist generated!',
            description: 'Your smart packing list is ready.',
          });
        }
      });
    };

    if (checklist.length > 0) {
      const trigger = document.getElementById('generate-confirm-trigger');
      if (trigger) trigger.click();
    } else {
      runGeneration();
    }
  };
  
  const addItem = useCallback((name: string, category: Category) => {
    const newItem: ChecklistItem = { id: crypto.randomUUID(), name, packed: false, category };
    setChecklist((prev) => [...prev, newItem]);
  }, []);

  const deleteItem = useCallback((id: string) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateItem = useCallback((id: string, name: string) => {
    setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, name } : item)));
  }, []);

  const togglePacked = useCallback((id: string, packed: boolean) => {
    setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, packed } : item)));
  }, []);

  const clearList = useCallback(() => {
    setChecklist([]);
    setTitle('My Next Trip');
  }, []);

  const clearPacked = useCallback(() => {
    setChecklist(prev => prev.map(item => ({...item, packed: false})))
  }, []);


  const GenerationConfirmDialog = () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button id="generate-confirm-trigger" className="hidden">Confirm</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Generating a new checklist will replace your current one. Are you sure you want to continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => {
            const form = document.querySelector('form');
            if(form) form.requestSubmit();
          }}>
            Yes, generate new list
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <div className="container mx-auto p-4 md:p-8 font-body">
      <Header />
      <ChecklistGenerator onGenerate={handleGenerate} isPending={isPending} itemCount={checklist.length} />
      
      {checklist.length > 0 ? (
        <>
          <ChecklistDisplay 
            checklist={checklist}
            title={title}
            setTitle={setTitle}
            onAdd={addItem}
            onDelete={deleteItem}
            onUpdate={updateItem}
            onToggle={togglePacked}
          />
          <ChecklistActions items={checklist} title={title} onClear={clearList} onClearPacked={clearPacked} />
        </>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p>Your packing list is empty.</p>
          <p>Use the form above to generate a smart checklist for your trip!</p>
        </div>
      )}
      <GenerationConfirmDialog />
    </div>
  );
}
