# Dynamic Form Generator
Deployed at: https://dynamic-form-generator-ts.vercel.app/

This is a dynamic form generator built with React, TypeScript, Tailwind CSS, and React Hook Form. It generates a form in real-time based on a JSON schema provided by the user. The project includes a JSON editor and a form preview displayed side by side, providing real-time updates and validation.

## Features
- Real-time form generation based on user-provided JSON schema
- Validation and error handling for form fields
- Responsive layout (stack editor and form preview on smaller screens)
- JSON validation with error messages for invalid JSON
- Responsive across screen sizes with Tailwind CSS
- Button to copy schema from a click
- Submit form data and log to the console
- Dark mode support with Tailwind CSS
- Option to download form submissions as JSON

## Installation

### 1. Clone the repository:
```
git clone https://github.com/guptasajal411/dynamic-form-generator-ts.git
cd dynamic-form-generator
```

### 2. Install dependencies
```
npm install
```

### 3. Run the development server
```
npm start
```

### 4. Visit http://localhost:3000 on your browser

## Testing

### Run unit tests with Jest (make sure the application is up and running on http://localhost:3000)
```
npm run test
```

### Run E2E tests with Playwright (make sure the application is up and running on http://localhost:3000)
```
npx playwright test
```