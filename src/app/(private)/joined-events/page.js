"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { toast } from "sonner";

import { PageHeading } from "@/components/page-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch } from "@/lib/api";
import { formatDate } from "@/lib/format";

export default function JoinedEventsPage() {
  const [joined, setJoined] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/joined-events", { auth: true })
      .then(setJoined)
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <PageHeading
        eyebrow="My commitments"
        title="Joined events"
        description="Every event you've signed up for, sorted by date so you always know what's next."
      />

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      ) : joined.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <h3 className="font-heading text-xl font-semibold">
            You haven&apos;t joined any events yet
          </h3>
          <p className="mt-2 text-muted-foreground">
            Find a cause near you and lend a hand.
          </p>
          <Button asChild className="mt-6">
            <Link href="/events">Browse upcoming events</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {joined.map((item) => (
            <article
              key={item._id}
              className="flex flex-col overflow-hidden rounded-2xl border bg-card sm:flex-row"
            >
              <div className="relative aspect-video w-full shrink-0 sm:w-56">
                <Image
                  src={item.eventThumbnail}
                  alt={item.eventTitle}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1.5">
                  <Badge className="bg-terracotta text-white">
                    {item.eventType}
                  </Badge>
                  <h3 className="font-heading text-lg font-semibold">
                    {item.eventTitle}
                  </h3>
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="size-4 text-primary" />
                    {formatDate(item.eventDate)}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="size-4 text-primary" />
                    {item.eventLocation}
                  </p>
                </div>
                <Button asChild variant="outline" className="mt-2 sm:mt-0">
                  <Link href={`/events/${item.eventId}`}>View Event</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
