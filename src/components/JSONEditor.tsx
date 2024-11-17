import React, { useState } from "react";
import { JSONEditorProps } from "../types/editorTypes";
import { formSchema } from "../validators/jsonValidator";
import { z } from "zod";

const JSONEditor: React.FC<JSONEditorProps> = ({ schema, setSchema, setJsonError }) => {
    const [jsonValue, setJsonValue] = useState<string>(JSON.stringify(schema, null, 2));

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const input = e.target.value;
        setJsonValue(input);
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
            console.log(err);
            if (err instanceof SyntaxError) { // catching syntax errors in JSON
                setJsonError({ isError: true, errorMessages: [err.message] });
            } else if (err instanceof z.ZodError) { // catching zod errors for form schema validation
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

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(jsonValue);
            alert("JSON copied to clipboard!");
        } catch (err) {
            console.error("Failed to copy: ", err);
            alert("Failed to copy JSON.");
        }
    };

    return (
        <div className="h-full w-full flex flex-col max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold dark:text-white">JSON Editor</h2>
                <button onClick={handleCopy} className="bg-blue-500 px-4 py-2 rounded text-white">Copy Form JSON</button>
            </div>
            <textarea
                data-testid={"json-editor"}
                className="w-full h-full border p-2 rounded mt-2 dark:bg-black dark:text-white border-slate-500 focus:border"
                value={jsonValue} // using a local state here because using default values from parent component doesnt update on using the "copy from json" button, making the textarea controlled
                onChange={handleChange}
            />
        </div>
    );
};


export default JSONEditor;