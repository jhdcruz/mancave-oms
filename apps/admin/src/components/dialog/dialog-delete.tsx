import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@mcsph/ui/components/dialog';
import { Button } from '@mcsph/ui/components/button';

export function DialogDelete({
  open,
  setOpen,
  item,
  deleteFn,
  loading,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  item: string | ReactNode;
  deleteFn: () => void;
  loading: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="data-[state=open]:animate-show data-[state=closed]:animate-hide">
        <DialogHeader>
          <DialogTitle>Are you sure absolutely sure?</DialogTitle>
          <DialogDescription>This action cannot be undone!</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          You are about to delete the following:
          <span className="mx-auto text-center font-mono font-bold">
            {item}
          </span>
        </div>
        <DialogFooter>
          <Button variant="destructive" onClick={deleteFn} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <>Submit</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
