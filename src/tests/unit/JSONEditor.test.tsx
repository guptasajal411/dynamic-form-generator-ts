import { render, screen, fireEvent } from "@testing-library/react";
import JSONEditor from "../../components/JSONEditor";
import { sampleSchema } from "../../utils/sampleSchema";

const mockSetSchema = jest.fn();
const mockSetJsonError = jest.fn();

const schema = sampleSchema

describe("JSONEditor", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders JSONEditor and displays the initial content", () => {
        render(
            <JSONEditor
                schema={schema}
                setSchema={mockSetSchema}
                setJsonError={mockSetJsonError}
            />
        );
        expect(screen.getByText("JSON Editor")).toBeInTheDocument();
        const textarea = screen.getByRole("textbox");
        expect(textarea).toHaveValue(JSON.stringify(schema, null, 2));
    });

    it("validates JSON input correctly", () => {
        render(
            <JSONEditor
                schema={schema}
                setSchema={mockSetSchema}
                setJsonError={mockSetJsonError}
            />
        );

        const textarea = screen.getByRole("textbox");
        fireEvent.change(textarea, {
            target: { value: JSON.stringify({ formTitle: "New Form", formDescription: "Description", fields: [] }, null, 2) }
        });
        expect(mockSetJsonError).toHaveBeenCalledWith({ isError: false });

        fireEvent.change(textarea, {
            target: { value: "{ formTitle: 'Invalid JSON' " }
        });
        expect(mockSetJsonError).toHaveBeenCalledWith({
            isError: true,
            errorMessages: ["Expected property name or '}' in JSON at position 2 (line 1 column 3)"],
        });
    });

    it("sets schema correctly when valid JSON is entered", () => {
        render(
            <JSONEditor
                schema={schema}
                setSchema={mockSetSchema}
                setJsonError={mockSetJsonError}
            />
        );

        fireEvent.change(screen.getByRole("textbox"), {
            target: { value: JSON.stringify({ "formTitle": "Valid Form", "formDescription": "Valid Description", "fields": [] }, null, 2) }
        });
        expect(mockSetSchema).toHaveBeenCalledWith({
            formTitle: "Valid Form",
            formDescription: "Valid Description",
            fields: [],
        });
    });
});