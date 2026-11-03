"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { EventCard, EventCardSkeleton } from "@/components/events/event-card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

export function RecentEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/events/recent")
      .then(setEvents)
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed p-12 text-center">
        <p className="text-muted-foreground">
          No upcoming events yet. Be the first to start one!
        </p>
        <Button asChild className="mt-4">
          <Link href="/create-event">Create an event</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
      <div className="mt-10 text-center">
        <Button asChild size="lg" variant="outline">
          <Link href="/events">View all upcoming events</Link>
        </Button>
      </div>
    </>
  );
}
