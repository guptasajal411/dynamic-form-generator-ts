import { test, expect, Page } from "@playwright/test";

test("renders JSON editor and form generator", async ({ page }: { page: Page }) => {
    await page.goto("http://localhost:3000");
    await expect(page.getByRole("heading", { name: "JSON Editor" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Project Requirements Survey" })).toBeVisible();
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

test("errors in JSON visible in real time when JSON schema changes", async ({ page }: { page: Page }) => {
    await page.goto("http://localhost:3000");
    const jsonEditor = page.locator('[data-testid="json-editor"]');
    const newSchema = {
        formTitle: "updated form"
    };
    await jsonEditor.fill(JSON.stringify(newSchema));
    const error1 = page.locator('p', { hasText: "Error in 'formTitle': Required" });
    const error2 = page.locator('p', { hasText: "Error in 'formDescription': Required" });
    const error3 = page.locator('p', { hasText: "Error in 'fields': Required" });
});