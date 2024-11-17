import React, { useEffect, useRef, useState } from "react";
import { JSONEditorProps } from "../types/editorTypes";
import { formSchema } from "../validators/jsonValidator";
import { z } from "zod";
import MonacoEditor from "@monaco-editor/react";
import { monacoConfig } from "../config/monacoConfig";

const JSONEditor: React.FC<JSONEditorProps> = ({ schema, setSchema, setJsonError }) => {
    const [editorValue, setEditorValue] = useState<string>(JSON.stringify(schema, null, 2));
    const monacoRef = useRef<any>(null);

    const handleEditorChange = (value: string | undefined) => {
        if (value) {
            try {
                const parsed = JSON.parse(value);
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
        }
    };

    useEffect(() => {
        setEditorValue(JSON.stringify(schema, null, 2));
    }, [schema]);

    return (
        <div className="h-full w-full flex flex-col max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold">JSON Editor</h2>
            <MonacoEditor
                height="100%"
                language="json"
                value={editorValue}
                options={monacoConfig}
                onChange={handleEditorChange}
                onMount={(editor) => {
                    monacoRef.current = editor;
                }}
            />
        </div>
    );
};

export default JSONEditor;
