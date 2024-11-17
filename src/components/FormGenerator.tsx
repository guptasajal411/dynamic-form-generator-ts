import React from "react";
import { useForm } from "react-hook-form";

interface FormField {
    id: string;
    type: string;
    label: string;
    required?: boolean;
    placeholder?: string;
    options?: { value: string; label: string }[];
    validation?: { pattern?: string; message?: string };
}

interface FormSchema {
    formTitle: string;
    formDescription: string;
    fields: FormField[];
}

const FormGenerator: React.FC<{ schema: FormSchema }> = ({ schema }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data: any) => {
        console.log(data);
        alert("Form submitted successfully!");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h2 className="text-xl font-bold">{schema.formTitle}</h2>
            <p>{schema.formDescription}</p>
            {schema.fields.map((field, index) => (
                <div key={index}>
                    <label className="block text-sm font-medium">
                        {field.label}
                    </label>
                    {field.type === "text" || field.type === "email" ? (
                        <input
                            {...register(field.id, {
                                required: field.required,
                                pattern: field.validation?.pattern ? new RegExp(field.validation.pattern) : undefined,
                            })}
                            type={field.type}
                            placeholder={field.placeholder}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                    ) : field.type === "textarea" ? (
                        <textarea
                            {...register(field.id, { required: field.required })}
                            placeholder={field.placeholder}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                    ) : field.type === "select" ? (
                        <select {...register(field.id, { required: field.required })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                            {field.options?.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    ) : null}

                    {errors[field.id] && (
                        <span className="text-red-500 text-sm">
                            {field.validation?.message || "This field is required"}
                        </span>
                    )}
                </div>
            ))}
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Submit
            </button>
        </form>
    );
};

export default FormGenerator;
