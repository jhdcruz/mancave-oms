import { cn } from '@mcsph/utils';
import { Wifi } from 'lucide-react';
import { Badge } from '../components/badge';

export default function SystemStatus({
  connected,
  className,
}: {
  connected: () => Promise<boolean> | Promise<boolean> | boolean;
  className?: string;
}) {
  const status = connected() || connected;

  return (
    <Badge
      variant="outline"
      className={cn(
        'mx-auto my-2 mt-auto w-fit p-1 px-5 text-center',
        className,
      )}
    >
      {status ? (
        <>
          <Wifi className="mr-2" size={20} color="#4fff38" />
          All systems normal
        </>
      ) : (
        <>
          <Wifi className="mr-2" size={20} color="#ff3838" />
          System downtime
        </>
      )}
    </Badge>
  );
}
