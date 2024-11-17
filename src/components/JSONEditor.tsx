import React from "react";
import { JSONEditorProps } from "../types/editorTypes";
import { formSchema } from "../validators/jsonValidator";
import { z } from "zod";

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
        <div className="h-full w-full flex flex-col max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold">JSON Editor</h2>
            <textarea
                data-testid={"json-editor"}
                className="w-full h-full border p-2 rounded mt-2"
                defaultValue={JSON.stringify(schema, null, 2)}
                onChange={handleChange}
            />
        </div>
    );
}

export default JSONEditor;