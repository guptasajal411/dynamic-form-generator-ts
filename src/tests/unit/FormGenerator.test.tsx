import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FormGenerator from "../../components/FormGenerator";
import userEvent from "@testing-library/user-event";

const mockSchema = {
    "formTitle": "Test Form",
    "formDescription": "Please fill out this form.",
    "fields": [
        {
            "id": "name",
            "type": "text",
            "label": "Full Name",
            "required": true,
            "placeholder": "Enter your name",
            "validation": {
                "pattern": "^[a-zA-Z]+$",
                "message": "Name must contain only letters"
            }
        },
        {
            "id": "email",
            "type": "email",
            "label": "Email Address",
            "required": true,
            "placeholder": "Enter your email"
        }
    ]
};

const mockJsonError = {
    isError: false,
    errorMessages: [],
};

describe("FormGenerator", () => {
    it("renders the form fields correctly", () => {
        render(<FormGenerator schema={mockSchema} jsonError={mockJsonError} />);
        expect(screen.getByText(/Test Form/i)).toBeInTheDocument();
        expect(screen.getByText(/Please fill out this form./i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    });

    it("displays error messages when JSON error exists", () => {
        const errorProps = {
            isError: true,
            errorMessages: ["Invalid schema"],
        };
        render(<FormGenerator schema={mockSchema} jsonError={errorProps} />);
        expect(screen.getByText(/Kindly solve the following errors:/i)).toBeInTheDocument();
        expect(screen.getByText("Invalid schema")).toBeInTheDocument();
    });

    it("submits the form successfully when all fields are valid", async () => {
        const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => { });
        const onSubmitMock = jest.fn();
        const mockValidJsonError = { isError: false, errorMessages: [] };
        render(<FormGenerator schema={mockSchema} jsonError={mockValidJsonError} />);
        userEvent.type(screen.getByPlaceholderText("Enter your name"), "Sajal Gupta");
        userEvent.type(screen.getByPlaceholderText("Enter your email"), "sajal@example.com");
        userEvent.click(screen.getByText(/Submit/i));
        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith({
                name: "Sajal Gupta",
                email: "sajal@example.com",
            });
        });
    });

    it("shows validation error for invalid input", async () => {
        const mockInvalidJsonError = { isError: false, errorMessages: [] };
        render(<FormGenerator schema={mockSchema} jsonError={mockInvalidJsonError} />);
        userEvent.click(screen.getByText(/Submit/i));
        expect(await screen.findByText(/This field is required/i)).toBeInTheDocument();
        userEvent.type(screen.getByPlaceholderText("Enter your name"), "123");
        userEvent.click(screen.getByText(/Submit/i));
        expect(await screen.findByText(/Name must contain only letters/i)).toBeInTheDocument();
    });
});
