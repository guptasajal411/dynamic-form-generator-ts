import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { jsonError } from "../types/errors";
import { FormSchema } from "../types/formTypes";

const FormGenerator: React.FC<{ schema: FormSchema, jsonError: jsonError }> = ({ schema, jsonError }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    useEffect(() => {
        reset();
    }, [schema, reset]);

    const onSubmit = (data: any) => {
        console.log(data);
        alert("Form submitted successfully!");
    };

    return (
        <div className="w-full h-full">
            {jsonError.isError ? <>
                <h2 className="text-xl font-bold dark:text-white">Kindly solve the following errors:</h2>
                {jsonError.errorMessages?.map((error, index) => <p className="dark:text-white" key={index}>{error}</p>)}
            </> : <>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <h2 className="text-xl font-bold dark:text-white">{schema.formTitle}</h2>
                    <p className="dark:text-white">{schema.formDescription}</p>
                    {schema.fields.map((field, index) => (
                        <div key={index}>
                            <label className="block text-sm font-medium dark:text-white">
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
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-black dark:text-white border border-slate-600 px-3 py-3"
                                />
                            ) : field.type === "textarea" ? (
                                <textarea
                                    {...register(field.id, { required: field.required })}
                                    placeholder={field.placeholder}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-black dark:text-white border border-slate-600 px-3 py-3"
                                />
                            ) : field.type === "select" ? (
                                <select {...register(field.id, { required: field.required })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-black dark:text-white border border-slate-600 px-3 py-3">
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
