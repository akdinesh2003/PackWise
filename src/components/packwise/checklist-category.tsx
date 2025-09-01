'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import ChecklistItemComponent from './checklist-item';
import type { ChecklistItem, Category } from '@/lib/types';

const categoryIcons = {
  Clothing: '👕',
  Tech: '💻',
  Documents: '📄',
  Toiletries: '🧼',
  Miscellaneous: '📦',
};

type ChecklistCategoryProps = {
  category: Category;
  items: ChecklistItem[];
  onUpdate: (id: string, name:string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, packed: boolean) => void;
  onAdd: (name: string, category: Category) => void;
};

export default function ChecklistCategory({ category, items, ...props }: ChecklistCategoryProps) {
  const [newItemName, setNewItemName] = useState('');
  
  const handleAddItem = () => {
    if (newItemName.trim()) {
      props.onAdd(newItemName.trim(), category);
      setNewItemName('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };


  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-headline">
          <span>{categoryIcons[category]}</span>
          {category}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.length > 0 ? (
          items.map((item) => (
            <ChecklistItemComponent key={item.id} item={item} {...props} />
          ))
        ) : (
          <p className="text-sm text-muted-foreground px-2 py-4 text-center">No items in this category.</p>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Input
          placeholder="Add new item..."
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="h-9"
        />
        <Button variant="outline" size="icon" onClick={handleAddItem} aria-label="Add item">
          <PlusCircle className="h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
