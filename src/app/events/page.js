"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";

import { EventCard, EventCardSkeleton } from "@/components/events/event-card";
import { EVENT_TYPES } from "@/components/events/event-form";
import { PageHeading } from "@/components/page-heading";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiFetch } from "@/lib/api";

export default function UpcomingEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  useEffect(() => {
    apiFetch("/events")
      .then(setEvents)
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, []);

  // Extra feature: search by title/location and filter by type
  const filteredEvents = events.filter((event) => {
    const text = `${event.title} ${event.location}`.toLowerCase();
    const matchesSearch = text.includes(search.toLowerCase());
    const matchesType = type === "All" || event.eventType === type;
    return matchesSearch && matchesType;
  });

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <PageHeading
        eyebrow="Get involved"
        title="Upcoming events"
        description="Find a cause near you and lend a hand. Every event below is happening today or later."
      />

      {/* Search + filter */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title or location"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All types</SelectItem>
            {EVENT_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <h3 className="font-heading text-xl font-semibold">
            No events found
          </h3>
          <p className="mt-2 text-muted-foreground">
            Try a different search, or create an event for your community.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </section>
  );
}
