import z from "zod";

export const nameSchema = z.object({
    name: z
        .string()
        .min(1, "Please enter your name")
        .max(40, "Name is too long")
        .regex(/^[a-zA-ZÀ-ÿ]+$/, "First name only — no spaces or numbers"),
});

export type NameSchema = z.infer<typeof nameSchema>;
