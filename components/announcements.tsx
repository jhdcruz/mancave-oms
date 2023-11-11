import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import { Button } from "@/ui/button";
import { formatDateTime } from "@/utils";

type AnnouncementItemProps = {
  title: string;
  date: string;
  headline: string;
  href: string;
};

const AnnouncementItem = ({
  title,
  date,
  headline,
  href,
}: AnnouncementItemProps) => (
  <div className="mb-4 rounded-lg border px-6 py-5">
    <h4 className="font-semibold">{title}</h4>
    <p className="my-1 text-sm text-muted-foreground">{formatDateTime(date)}</p>

    <p className="my-4 break-words text-base">{headline}</p>

    <Button className="ml-0 pl-0 text-sm font-semibold" variant="link" asChild>
      <Link href={href}>Read More &#8594;</Link>
    </Button>
  </div>
);

export default function Announcements() {
  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Announcements:</CardTitle>
          <CardDescription>
            Public announcement from the management.
          </CardDescription>
        </CardHeader>
        <CardContent className="max-h-[70vh] overflow-y-scroll">
          {/* Sample data */}
          <AnnouncementItem
            title="Welcome to the Inventory Management System!"
            date="2021-08-19T00:00:00.000Z"
            headline="This is a sample announcement from the management."
            href="/"
          />
          <AnnouncementItem
            title="Welcome to the Inventory Management System!"
            date="2021-08-19T00:00:00.000Z"
            headline="This is a sample announcement from the management."
            href="/"
          />
          <AnnouncementItem
            title="Welcome to the Inventory Management System!"
            date="2021-08-19T00:00:00.000Z"
            headline="This is a sample announcement from the management."
            href="/"
          />
          <AnnouncementItem
            title="Welcome to the Inventory Management System!"
            date="2021-08-19T00:00:00.000Z"
            headline="This is a sample announcement from the management."
            href="/"
          />
          <AnnouncementItem
            title="Welcome to the Inventory Management System!"
            date="2021-08-19T00:00:00.000Z"
            headline="This is a sample announcement from the management."
            href="/"
          />
        </CardContent>
      </Card>
    </>
  );
}
