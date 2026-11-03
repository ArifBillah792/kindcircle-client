"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { EventForm } from "@/components/events/event-form";
import { PageHeading } from "@/components/page-heading";
import { Card, CardContent } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";

export default function CreateEventPage() {
  const router = useRouter();

  async function handleCreate(values) {
    try {
      await apiFetch("/events", { method: "POST", body: values, auth: true });
      toast.success("Event created! It's now live for the community.");
      router.push("/events");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <PageHeading
        eyebrow="Organise"
        title="Create a community event"
        description="Plan a cleanup, plantation, donation drive or any act of service, and invite your neighbours to join you."
      />
      <Card>
        <CardContent>
          <EventForm onSubmit={handleCreate} submitLabel="Create Event" />
        </CardContent>
      </Card>
    </section>
  );
}
