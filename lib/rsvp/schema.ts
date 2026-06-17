import { z } from "zod";

export const Meal = z.enum(["chicken", "pork", "vegetarian"]);
export type Meal = z.infer<typeof Meal>;

export const Attending = z.enum(["yes", "no"]);
export type Attending = z.infer<typeof Attending>;

export const Relationship = z.enum(["primary", "spouse", "plus-one", "child"]);
export type Relationship = z.infer<typeof Relationship>;

export const GuestRow = z.object({
  partyId: z.string().min(1),
  partyLabel: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  relationship: Relationship,
  side: z.enum(["bride", "groom", "both"]).optional(),
  attending: Attending.optional().nullable(),
  meal: Meal.optional().nullable(),
  dietary: z.string().optional().nullable(),
  noteToCouple: z.string().optional().nullable(),
  submittedAt: z.string().optional().nullable(),
  rowIndex: z.number().int().nonnegative(),
});
export type GuestRow = z.infer<typeof GuestRow>;

export const Party = z.object({
  partyId: z.string(),
  partyLabel: z.string(),
  members: z.array(GuestRow).min(1),
  // True when this party has already submitted an RSVP (set live at lookup time;
  // not part of the static mirror).
  submitted: z.boolean().optional(),
});
export type Party = z.infer<typeof Party>;

export const RsvpAnswer = z.object({
  rowIndex: z.number().int().nonnegative(),
  attending: Attending,
  meal: Meal.optional().nullable(),
  dietary: z.string().max(500).optional().nullable(),
});
export type RsvpAnswer = z.infer<typeof RsvpAnswer>;

export const RsvpPayload = z.object({
  partyId: z.string().min(1),
  noteToCouple: z.string().max(2000).optional().nullable(),
  answers: z.array(RsvpAnswer).min(1),
});
export type RsvpPayload = z.infer<typeof RsvpPayload>;
