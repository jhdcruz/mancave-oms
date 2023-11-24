import { ReactNode } from 'react';
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
}: {
  open: boolean;
  setOpen: () => void;
  item: string | ReactNode;
  deleteFn: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
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
          <Button variant="destructive" onClick={deleteFn}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
