import React, { useState } from "react";

interface JSONEditorProps {
    schema: any;
    setSchema: React.Dispatch<React.SetStateAction<any>>;
}

const JSONEditor: React.FC<JSONEditorProps> = ({ schema, setSchema }) => {
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const input = e.target.value;
        try {
            const parsed = JSON.parse(input);
            setSchema(parsed);
            setError(null);
        } catch (err) {
            setError("Invalid JSON format.");
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
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default JSONEditor;
