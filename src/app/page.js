import Image from "next/image";
import Link from "next/link";
import {
  CalendarCheck,
  CalendarPlus,
  HeartHandshake,
  ShieldCheck,
} from "lucide-react";

import { Newsletter } from "@/components/home/newsletter";
import { RecentEvents } from "@/components/home/recent-events";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: CalendarPlus,
    title: "Organise in minutes",
    text: "Create a cleanup, plantation or donation drive with a title, date and place — and share it with your neighbours.",
  },
  {
    icon: HeartHandshake,
    title: "Join with one click",
    text: "Find a cause near you and sign up instantly. Organisers see exactly how many volunteers are coming.",
  },
  {
    icon: CalendarCheck,
    title: "Track your commitments",
    text: "Your joined events are kept in one place, sorted by date, so you never miss the day you promised to help.",
  },
  {
    icon: ShieldCheck,
    title: "Safe and personal",
    text: "Secure sign-in, and only organisers can edit or remove the events they created.",
  },
];

// Replace these with your own image links (Unsplash → right-click photo → Copy image address)
const gallery = [
  {
    src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a",
    alt: "Volunteers working together",
  },
  {
    src: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09",
    alt: "Planting a young tree",
  },
  {
    src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c",
    alt: "Children at a community event",
  },
  {
    src: "https://images.unsplash.com/photo-1593113598332-cd288d649433",
    alt: "Donation boxes being packed",
  },
  {
    src: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5",
    alt: "Cleaning up a public space",
  },
  {
    src: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6",
    alt: "Sharing food with neighbours",
  },
];

function SectionHeading({ eyebrow, title, text }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <span className="inline-block rounded-full bg-accent px-4 py-1 text-sm font-medium text-accent-foreground">
        {eyebrow}
      </span>
      <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* 1. Banner */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-32 top-0 size-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 size-96 rounded-full bg-terracotta/20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 sm:py-32">
          <span className="inline-block rounded-full bg-accent px-4 py-1 text-sm font-medium text-accent-foreground">
            Community service, together
          </span>
          <h1 className="mt-5 font-heading text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            Small acts of kindness,{" "}
            <span className="text-primary">multiplied by neighbours</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            From winter clothes drives in Mirpur to tree plantations by
            Dhanmondi Lake — find a cause near you, or start one and invite your
            community to help.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/events">Explore upcoming events</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/create-event">Start an event</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Why KindCircle"
          title="Everything you need to do good, together"
          text="Simple tools that turn good intentions into real action in your neighbourhood."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex h-full flex-col rounded-2xl border bg-card p-6"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-6" />
              </span>
              <h3 className="mt-5 font-heading text-xl font-semibold">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Recent upcoming events (dynamic, limit 6) */}
      <section className="bg-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Happening soon"
            title="Upcoming events near you"
            text="The next six community events — pick one and lend a hand."
          />
          <RecentEvents />
        </div>
      </section>

      {/* 4. Gallery (static) */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Moments of service"
          title="Our community in action"
          text="A glimpse of the cleanups, plantations and donation drives that bring us together."
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {gallery.map((photo) => (
            <div
              key={photo.src}
              className="relative aspect-square overflow-hidden rounded-2xl"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                unoptimized
                className="object-cover transition duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>

      {/* 5. Newsletter */}
      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        <Newsletter />
      </section>
    </>
  );
}
