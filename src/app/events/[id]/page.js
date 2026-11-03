"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Loader2,
  MapPin,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { formatDate } from "@/lib/format";

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);
  const [joining, setJoining] = useState(false);

  // 1. Load the event (public)
  useEffect(() => {
    apiFetch(`/events/${id}`)
      .then(setEvent)
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [id]);

  // 2. If logged in, check whether this user already joined
  useEffect(() => {
    if (!session) return;
    apiFetch(`/events/${id}/join-status`, { auth: true })
      .then((data) => setJoined(data.joined))
      .catch(() => {});
  }, [id, session]);

  async function handleJoin() {
    // Not logged in → send to login, then come back here
    if (!session) {
      toast.info("Please log in to join this event");
      router.push(`/login?redirect=/events/${id}`);
      return;
    }

    setJoining(true);
    try {
      await apiFetch(`/events/${id}/join`, { method: "POST", auth: true });
      setJoined(true);
      setEvent((prev) => ({
        ...prev,
        participantCount: (prev.participantCount || 0) + 1,
      }));
      toast.success("You're in! Thank you for joining.");
    } catch (error) {
      toast.error(error.message);
      if (error.message.includes("already joined")) setJoined(true);
    } finally {
      setJoining(false);
    }
  }

  if (loading) {
    return (
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2">
        <Skeleton className="aspect-video w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
      </section>
    );
  }

  if (!event) {
    return (
      <section className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-heading text-3xl font-semibold">Event not found</h1>
        <p className="mt-3 text-muted-foreground">
          This event may have been removed by its organiser.
        </p>
        <Button asChild className="mt-6">
          <Link href="/events">Browse upcoming events</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <Link
        href="/events"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" /> Back to upcoming events
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-video overflow-hidden rounded-2xl border">
          <Image
            src={event.thumbnail}
            alt={event.title}
            fill
            unoptimized
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-5">
          <Badge className="w-fit bg-terracotta text-white">
            {event.eventType}
          </Badge>
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            {event.title}
          </h1>

          <div className="space-y-2 text-muted-foreground">
            <p className="flex items-center gap-2">
              <CalendarDays className="size-5 text-primary" />
              {formatDate(event.eventDate)}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="size-5 text-primary" />
              {event.location}
            </p>
            <p className="flex items-center gap-2">
              <Users className="size-5 text-primary" />
              {event.participantCount || 0} volunteers joined
            </p>
          </div>

          {/* Organiser */}
          <div className="flex items-center gap-3 rounded-xl border bg-card p-3">
            <Avatar className="size-10">
              <AvatarImage
                src={event.creatorPhoto || undefined}
                alt={event.creatorName}
              />
              <AvatarFallback>
                {(event.creatorName || "K").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs text-muted-foreground">Organised by</p>
              <p className="font-medium">
                {event.creatorName || "A KindCircle member"}
              </p>
            </div>
          </div>

          <p className="whitespace-pre-line leading-relaxed">
            {event.description}
          </p>

          {joined ? (
            <Button size="lg" disabled className="w-full">
              <CheckCircle2 className="size-5" /> You have joined this event
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={handleJoin}
              disabled={joining}
              className="w-full"
            >
              {joining && <Loader2 className="size-4 animate-spin" />}
              Join Event
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
