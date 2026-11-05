"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Pencil, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

import { PageHeading } from "@/components/page-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch } from "@/lib/api";
import { formatDate } from "@/lib/format";

export default function ManageEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  // The id of the event whose card is asking "Delete this event?" (null = none)
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    apiFetch("/my-events", { auth: true })
      .then(setEvents)
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id) {
    try {
      await apiFetch(`/events/${id}`, { method: "DELETE", auth: true });
      setEvents((prev) => prev.filter((event) => event._id !== id));
      setConfirmId(null);
      toast.success("Event deleted");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <PageHeading
        eyebrow="Organiser tools"
        title="Manage your events"
        description="Update details or remove events you've created. Only you can change your own events."
      />

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-2xl" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <h3 className="font-heading text-xl font-semibold">
            You haven&apos;t created any events yet
          </h3>
          <p className="mt-2 text-muted-foreground">
            Start something good in your neighbourhood.
          </p>
          <Button asChild className="mt-6">
            <Link href="/create-event">Create an event</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <article
              key={event._id}
              className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card"
            >
              <div className="relative aspect-video">
                <Image
                  src={event.thumbnail}
                  alt={event.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <Badge className="absolute left-3 top-3 bg-terracotta text-white">
                  {event.eventType}
                </Badge>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-5">
                <h3 className="line-clamp-2 font-heading text-xl font-semibold">
                  {event.title}
                </h3>
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-primary" />{" "}
                    {formatDate(event.eventDate)}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="size-4 text-primary" />
                    <span className="line-clamp-1">{event.location}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Users className="size-4 text-primary" />{" "}
                    {event.participantCount || 0} joined
                  </p>
                </div>

                <div className="mt-auto space-y-2">
                  {confirmId === event._id ? (
                    <>
                      <p className="text-sm font-medium text-destructive">
                        Delete this event and all its sign-ups?
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setConfirmId(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(event._id)}
                        >
                          Yes, delete
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <Button asChild variant="outline">
                        <Link href={`/manage-events/${event._id}/edit`}>
                          <Pencil className="size-4" /> Update
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => setConfirmId(event._id)}
                      >
                        <Trash2 className="size-4" /> Delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
