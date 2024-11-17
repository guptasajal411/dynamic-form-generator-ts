import React from "react";
import { useForm } from "react-hook-form";
import { jsonError } from "../types/errors";
import { FormSchema } from "../types/formTypes";

const FormGenerator: React.FC<{ schema: FormSchema, jsonError: jsonError }> = ({ schema, jsonError }) => {
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();

    const onSubmit = (data: any) => {
        console.log(data);
        alert("Form submitted successfully!");
    };

    const formData = watch(); // will watch dynamically generated input fields & user inputs, from react-hook-form

    return (
        <div className="w-full h-full">
            {jsonError.isError ? <>
                <h2 className="text-xl font-bold">Kindly solve the following errors:</h2>
                {jsonError.errorMessages?.map((error, index) => <p key={index}>{error}</p>)}
            </> : <>
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
            </>}
        </div>
    );
};

export default FormGenerator;
