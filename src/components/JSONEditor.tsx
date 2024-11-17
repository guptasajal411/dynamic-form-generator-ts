import React, { useState } from "react";
import { z } from "zod";

interface JSONEditorProps {
    schema: any;
    setSchema: React.Dispatch<React.SetStateAction<any>>;
    setJsonError: React.Dispatch<React.SetStateAction<any>>;
}

const formFieldSchema = z.object({
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

const formSchema = z.object({
    formTitle: z.string(),
    formDescription: z.string(),
    fields: z.array(formFieldSchema),
});

const JSONEditor: React.FC<JSONEditorProps> = ({ schema, setSchema, setJsonError }) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const input = e.target.value;
        try {
            const parsed = JSON.parse(input);
            const validationResult = formSchema.safeParse(parsed);
            if (!validationResult.success) {
                const errorMessages = validationResult.error.errors.map((err) => {
                    const path = err.path.join(".");
                    const message = err.message;
                    return `Error in '${path}': ${message}`;
                });
                setJsonError({ isError: true, errorMessages });
                return;
            }
            setSchema(validationResult.data);
            setJsonError({ isError: false });
        } catch (err) {
            console.log(err)
            if (err instanceof SyntaxError) {
                setJsonError({ isError: true, errorMessages: [err.message] });
            } else if (err instanceof z.ZodError) {
                const errorMessages = err.errors
                    .map(err => `${err.path.join(".")} - ${err.message}`)
                    .join("; ");
                setJsonError({ isError: true, errorMessages });
            } else {
                setJsonError({ isError: true, errorMessages: ["Something went wrong"] });
                console.error("Unexpected Error:", err);
            }
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold">JSON Editor</h2>
            <textarea
                className="w-full h-96 border p-2 rounded mt-2"
                defaultValue={JSON.stringify(schema, null, 2)}
                onChange={handleChange}
            />
            {/* {error && <p className="text-red-500 mt-2">{error}</p>} */}
        </div>
    );
};

export default JSONEditor;
