"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { EventForm } from "@/components/events/event-form";
import { PageHeading } from "@/components/page-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

export default function UpdateEventPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`/events/${id}`)
      .then(setEvent)
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleUpdate(values) {
    try {
      await apiFetch(`/events/${id}`, {
        method: "PATCH",
        body: values,
        auth: true,
      });
      toast.success("Event updated successfully");
      router.push("/manage-events");
    } catch (error) {
      toast.error(error.message);
    }
  }

  if (loading || !session) {
    return (
      <section className="mx-auto max-w-3xl space-y-4 px-4 py-14 sm:px-6">
        <Skeleton className="mx-auto h-10 w-2/3" />
        <Skeleton className="h-[480px] w-full rounded-2xl" />
      </section>
    );
  }

  // Not found, or not the creator → don't show the form
  if (!event || event.creatorEmail !== session.user.email) {
    return (
      <section className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-heading text-3xl font-semibold">
          You can&apos;t edit this event
        </h1>
        <p className="mt-3 text-muted-foreground">
          It may have been removed, or it belongs to another organiser.
        </p>
        <Button asChild className="mt-6">
          <Link href="/manage-events">Back to my events</Link>
        </Button>
      </section>
    );
  }

  // Pre-fill the form with the current values
  const defaultValues = {
    title: event.title,
    description: event.description,
    eventType: event.eventType,
    thumbnail: event.thumbnail,
    location: event.location,
    eventDate: event.eventDate.slice(0, 10),
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <PageHeading
        eyebrow="Organiser tools"
        title="Update event"
        description="Keep your volunteers informed with the latest details."
      />
      <Card>
        <CardContent>
          <EventForm
            defaultValues={defaultValues}
            onSubmit={handleUpdate}
            submitLabel="Save Changes"
          />
        </CardContent>
      </Card>
    </section>
  );
}
