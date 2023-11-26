import { cn } from '@mcsph/utils';

export default function LabeledDivider({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <div className={cn('relative mb-1', className)}>
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>

      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">{text}</span>
      </div>
    </div>
  );
}
