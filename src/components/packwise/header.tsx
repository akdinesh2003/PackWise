import { Suitcase } from 'lucide-react';

export default function Header() {
  return (
    <header className="mb-8 text-center no-print">
      <div className="inline-flex items-center gap-3 justify-center mb-2">
        <Suitcase className="h-10 w-10 text-primary" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary tracking-tight">
          PackWise
        </h1>
      </div>
      <p className="text-lg text-muted-foreground">
        Pack smart. Travel light. Never forget again.
      </p>
    </header>
  );
}
