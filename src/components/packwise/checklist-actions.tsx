'use client';

import { Button } from '@/components/ui/button';
import { Download, Printer, Trash, XCircle } from 'lucide-react';
import type { ChecklistItem, Category } from '@/lib/types';

type ChecklistActionsProps = {
  items: ChecklistItem[];
  title: string;
  onClear: () => void;
  onClearPacked: () => void;
};

export default function ChecklistActions({ items, title, onClear, onClearPacked }: ChecklistActionsProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleExportTxt = () => {
    const categories = Array.from(new Set(items.map(item => item.category)));
    let content = `${title}\n\n`;
    
    categories.forEach(category => {
      content += `--- ${category} ---\n`;
      items.filter(item => item.category === category).forEach(item => {
        content += `[${item.packed ? 'x' : ' '}] ${item.name}\n`;
      });
      content += '\n';
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_checklist.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="mt-8 p-4 shadow-lg no-print">
      <CardContent className="p-0 flex flex-wrap items-center justify-center gap-2">
        <Button variant="outline" onClick={handleExportTxt} disabled={items.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Export as TXT
        </Button>
        <Button variant="outline" onClick={handlePrint} disabled={items.length === 0}>
          <Printer className="mr-2 h-4 w-4" />
          Print / Save PDF
        </Button>
        <Button variant="outline" onClick={onClearPacked} disabled={items.filter(i => i.packed).length === 0}>
          <XCircle className="mr-2 h-4 w-4" />
          Unpack All
        </Button>
        <Button variant="destructive" onClick={onClear} disabled={items.length === 0}>
          <Trash className="mr-2 h-4 w-4" />
          Clear List
        </Button>
      </CardContent>
    </Card>
  );
}

// Dummy Card component to satisfy the compiler since this is inside a component directory
const Card = ({children, ...props}: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>
const CardContent = ({children, ...props}: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>
