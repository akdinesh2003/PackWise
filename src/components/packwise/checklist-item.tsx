'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GripVertical, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChecklistItem } from '@/lib/types';

type ChecklistItemProps = {
  item: ChecklistItem;
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, packed: boolean) => void;
};

export default function ChecklistItemComponent({ item, onUpdate, onDelete, onToggle }: ChecklistItemProps) {
  const [name, setName] = useState(item.name);

  const handleBlur = () => {
    if (name.trim() && name !== item.name) {
      onUpdate(item.id, name);
    } else {
      setName(item.name);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return (
    <div className="flex items-center gap-2 group p-1 rounded-md hover:bg-secondary/50 transition-colors">
      <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
      <Checkbox
        id={`item-${item.id}`}
        checked={item.packed}
        onCheckedChange={(checked) => onToggle(item.id, !!checked)}
        aria-label={`Mark ${item.name} as packed`}
      />
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          'border-0 bg-transparent h-8 shadow-none focus-visible:ring-1 flex-grow p-1',
          item.packed && 'line-through text-muted-foreground'
        )}
      />
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onDelete(item.id)}
        aria-label={`Delete ${item.name}`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
