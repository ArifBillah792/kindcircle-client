"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

const emptyValues = {
  title: "",
  description: "",
  eventType: "",
  thumbnail: "",
  location: "",
  eventDate: "",
};

// Checks every field. Returns an object like { title: "message" } for each problem.
function validate(values) {
  const errors = {};

  if (values.title.trim().length < 5) {
    errors.title = "Title must be at least 5 characters";
  }
  if (values.description.trim().length < 20) {
    errors.description = "Please describe the event in at least 20 characters";
  }
  if (!values.eventType) {
    errors.eventType = "Please choose an event type";
  }
  if (!values.thumbnail.trim().startsWith("http")) {
    errors.thumbnail = "Please enter a valid image URL (starting with http)";
  }
  if (values.location.trim().length < 3) {
    errors.location = "Please enter the event location";
  }
  if (!values.eventDate) {
    errors.eventDate = "Please choose a date";
  } else if (values.eventDate < getTomorrow()) {
    errors.eventDate = "Event date must be in the future";
  }

  return errors;
}

function FieldError({ message }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

export function EventForm({ defaultValues, onSubmit, submitLabel }) {
  const [values, setValues] = useState(defaultValues || emptyValues);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // One handler for every input: the input's "name" says which value to update
  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = validate(values);
    setErrors(newErrors);

    // Stop if there is at least one error
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    await onSubmit(values);
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">Event title</Label>
        <Input
          id="title"
          name="title"
          value={values.title}
          onChange={handleChange}
          placeholder="Winter Clothes Distribution"
        />
        <FieldError message={errors.title} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="eventType">Event type</Label>
          <select
            id="eventType"
            name="eventType"
            value={values.eventType}
            onChange={handleChange}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Choose a type</option>
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <FieldError message={errors.eventType} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="eventDate">Event date</Label>
          <Input
            id="eventDate"
            name="eventDate"
            type="date"
            min={getTomorrow()}
            value={values.eventDate}
            onChange={handleChange}
          />
          <FieldError message={errors.eventDate} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={values.location}
            onChange={handleChange}
            placeholder="Mirpur 10, Dhaka"
          />
          <FieldError message={errors.location} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="thumbnail">Thumbnail image URL</Label>
          <Input
            id="thumbnail"
            name="thumbnail"
            value={values.thumbnail}
            onChange={handleChange}
            placeholder="https://images.unsplash.com/..."
          />
          <FieldError message={errors.thumbnail} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={5}
          value={values.description}
          onChange={handleChange}
          placeholder="What will volunteers do, what should they bring, and who will this help?"
        />
        <FieldError message={errors.description} />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting && <Loader2 className="size-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  );
}
