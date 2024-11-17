import { test, expect, Page } from "@playwright/test";

test("JSON validation by invalid JSON", async ({ page }: { page: Page }) => {
    await page.goto("http://localhost:3000");
    const jsonEditor = page.locator('[data-testid="json-editor"]');
    const invalidJSON = `{
        "formTitle": "Invalid Form",
    }`;
    await jsonEditor.fill(invalidJSON);
    page.locator('p', { hasText: "Expected double-quoted property name in JSON at position 43 (line 3 column 5)" });
});

test("JSON validation by valid JSON", async ({ page }: { page: Page }) => {
    await page.goto("http://localhost:3000");
    const jsonEditor = page.locator('[data-testid="json-editor"]');
    const validJSON = `{
        "formTitle": "Project Requirements Survey",
        "formDescription": "Please fill out this survey about your project needs",
        "fields": [
            {
            "id": "name",
            "type": "text",
            "label": "Full Name",
            "required": true,
            "placeholder": "Enter your full name"
            }
        ]
    }`;
    await jsonEditor.fill(validJSON);
    page.locator('p', { hasText: "Please fill out this survey about your project needs" });
});

test("JSON validation by empty JSON", async ({ page }: { page: Page }) => {
    await page.goto("http://localhost:3000");
    const jsonEditor = page.locator('[data-testid="json-editor"]');
    const emptyJSON = `{}`;
    await jsonEditor.fill(emptyJSON);
    page.locator('p', { hasText: "Error in 'formTitle': Required" });
    page.locator('p', { hasText: "Error in 'formDescription': Required" });
    page.locator('p', { hasText: "Error in 'fields': Required" });
});

test("JSON validation by empty input", async ({ page }: { page: Page }) => {
    await page.goto("http://localhost:3000");
    const jsonEditor = page.locator('[data-testid="json-editor"]');
    const emptyJSON = ``;
    await jsonEditor.fill(emptyJSON);
    page.locator('p', { hasText: "Unexpected end of JSON input" });
});

test("real time form generation: default form", async ({ page }: { page: Page }) => {
    await page.goto("http://localhost:3000");
    await expect(page.getByRole("heading", { name: "JSON Editor" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Project Requirements Survey" })).toBeVisible();
});

test("real time form generation: user-generated form", async ({ page }: { page: Page }) => {
    await page.goto("http://localhost:3000");
    const jsonEditor = page.locator('[data-testid="json-editor"]');
    const validJSON = `{
        "formTitle": "Example form",
        "formDescription": "Example form description",
        "fields": [
            {
            "id": "name",
            "type": "text",
            "label": "Full Name",
            "required": true,
            "placeholder": "Enter your full name"
            }
        ]
    }`;
    await jsonEditor.fill(validJSON);
    page.locator('h2', { hasText: "Example form" });
    page.locator('p', { hasText: "Example form description" });
});

test("form validation and submission works correctly", async ({ page }: { page: Page }) => {
    await page.goto("http://localhost:3000");
    const jsonEditor = page.locator('[data-testid="json-editor"]');
    const validJSON = `{
        "formTitle": "Project Requirements Survey",
        "formDescription": "Please fill out this survey about your project needs",
        "fields": [
            {
            "id": "name",
            "type": "text",
            "label": "Full Name",
            "required": true,
            "placeholder": "Enter your full name"
            }
        ]
    }`;
    page.on('dialog', async (dialog) => {
        expect(dialog.message()).toBe("Form submitted successfully!");
        await dialog.dismiss();
    });
    await jsonEditor.fill(validJSON);
    await page.fill("input[type='text']", "Sajal Gupta");
    await page.locator("button[type='submit']").click();
});

test("form shows validation errors for invalid inputs", async ({ page }: { page: Page }) => {
    await page.goto("http://localhost:3000");
    const form = page.locator("form");
    await form.locator("button[type='submit']").click();
    page.locator('span', { hasText: "This field is required" });
});

test("updates form in real time when JSON schema changes", async ({ page }: { page: Page }) => {
    await page.goto("http://localhost:3000");
    const jsonEditor = page.locator('[data-testid="json-editor"]');
    const newSchema = {
        formTitle: "updated form",
        formDescription: "this is upladted form",
        fields: [
            { id: "newfield", type: "text", label: "new field", required: true },
        ],
    };
    await jsonEditor.fill(JSON.stringify(newSchema));
    await expect(page.getByRole("heading", { name: "updated form" })).toBeVisible();
    const paragraph = page.locator('p', { hasText: "this is upladted form" });
});

test.describe("test responsive layout", () => {
    const viewports = [
        { width: 1920, height: 1080, label: "Desktop" },
        { width: 768, height: 1024, label: "Tablet" },
        { width: 375, height: 667, label: "Mobile" },
    ];
    for (const viewport of viewports) {
        test(`renders correctly on ${viewport.label}`, async ({ page }) => {
            await page.setViewportSize({ width: viewport.width, height: viewport.height });
            await page.goto("http://localhost:3000");
            if (viewport.label === "Desktop") {
                await expect(page.getByRole("heading", { name: "JSON Editor" })).toBeVisible();
            } else if (viewport.label === "Tablet") {
                await expect(page.getByRole("heading", { name: "JSON Editor" })).toBeVisible();
            } else if (viewport.label === "Mobile") {
                await expect(page.getByRole("heading", { name: "JSON Editor" })).toBeVisible();
            }
        });
    }
});