"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const EVENT_TYPES = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Education",
  "Health Camp",
  "Food Drive",
];

// Tomorrow as "YYYY-MM-DD" (the earliest allowed event date)
export function getTomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toLocaleDateString("en-CA");
}

const eventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be under 100 characters"),
  description: z
    .string()
    .trim()
    .min(20, "Please describe the event in at least 20 characters"),
  eventType: z.string().min(1, "Please choose an event type"),
  thumbnail: z.string().trim().url("Please enter a valid image URL"),
  location: z.string().trim().min(3, "Please enter the event location"),
  eventDate: z
    .string()
    .min(1, "Please choose a date")
    .refine(
      (date) => date >= getTomorrow(),
      "Event date must be in the future",
    ),
});

const emptyValues = {
  title: "",
  description: "",
  eventType: "",
  thumbnail: "",
  location: "",
  eventDate: "",
};

function Field({ label, id, error, children }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </div>
  );
}

export function EventForm({ defaultValues, onSubmit, submitLabel }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: defaultValues || emptyValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <Field label="Event title" id="title" error={errors.title}>
        <Input
          id="title"
          placeholder="Winter Clothes Distribution"
          {...register("title")}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Event type" id="eventType" error={errors.eventType}>
          <Controller
            name="eventType"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="eventType" className="w-full">
                  <SelectValue placeholder="Choose a type" />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        <Field label="Event date" id="eventDate" error={errors.eventDate}>
          <Input
            id="eventDate"
            type="date"
            min={getTomorrow()}
            {...register("eventDate")}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Location" id="location" error={errors.location}>
          <Input
            id="location"
            placeholder="Mirpur 10, Dhaka"
            {...register("location")}
          />
        </Field>

        <Field
          label="Thumbnail image URL"
          id="thumbnail"
          error={errors.thumbnail}
        >
          <Input
            id="thumbnail"
            placeholder="https://images.unsplash.com/..."
            {...register("thumbnail")}
          />
        </Field>
      </div>

      <Field label="Description" id="description" error={errors.description}>
        <Textarea
          id="description"
          rows={5}
          placeholder="What will volunteers do, what should they bring, and who will this help?"
          {...register("description")}
        />
      </Field>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  );
}
