'use client';

import ChecklistCategory from './checklist-category';
import { categories, type ChecklistItem, type Category } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';

type ChecklistDisplayProps = {
  checklist: ChecklistItem[];
  title: string;
  setTitle: (title: string) => void;
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, packed: boolean) => void;
  onAdd: (name: string, category: Category) => void;
};

export default function ChecklistDisplay({
  checklist,
  title,
  setTitle,
  ...props
}: ChecklistDisplayProps) {
  const packedItems = checklist.filter((item) => item.packed).length;
  const totalItems = checklist.length;
  const progress = totalItems > 0 ? (packedItems / totalItems) * 100 : 0;

  return (
    <div className="space-y-8 printable-area">
       <div className="space-y-4">
        <Input 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-3xl font-bold font-headline tracking-tight border-0 shadow-none focus-visible:ring-1 focus-visible:ring-ring p-2 h-auto"
        />
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-primary">Packing Progress</span>
            <span>{packedItems} / {totalItems} packed</span>
          </div>
          <Progress value={progress} aria-label={`${Math.round(progress)}% packed`} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <ChecklistCategory
            key={category}
            category={category}
            items={checklist.filter((item) => item.category === category)}
            {...props}
          />
        ))}
      </div>
    </div>
  );
}
