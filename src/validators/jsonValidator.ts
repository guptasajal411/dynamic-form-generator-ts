import { z } from "zod"

export const formFieldSchema = z.object({
    id: z.string(),
    type: z.enum(["text", "email", "select", "radio", "textarea"]),
    label: z.string(),
    required: z.boolean().optional(),
    placeholder: z.string().optional(),
    options: z
        .array(z.object({
            value: z.string(),
            label: z.string()
        }))
        .optional(),
    validation: z
        .object({
            pattern: z.string().optional(),
            message: z.string().optional(),
        })
        .optional(),
});

export const formSchema = z.object({
    formTitle: z.string(),
    formDescription: z.string(),
    fields: z.array(formFieldSchema),
});