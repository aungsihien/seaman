# Seaman Portal - Department of Marine Administration

This is a web portal for the Department of Marine Administration, designed to provide information and access to online payment services for various departments.

## Project Setup

1.  **Prerequisites:**
    *   Node.js (version 16.x or higher recommended)
    *   npm (comes with Node.js)

2.  **Clone the repository (if applicable) or download the files.**

3.  **Navigate to the project directory:**
    ```bash
    cd seaman
    ```

4.  **Install dependencies:**
    ```bash
    npm install
    ```

## Running the Application

1.  **Start the server (development mode with nodemon):**
    ```bash
    npm run dev
    ```
    This will start the server, and nodemon will automatically restart it if you make changes to the files.

2.  **Start the server (production mode):**
    ```bash
    npm start
    ```

3.  Open your web browser and go to `http://localhost:3000` (or the port specified in `server.js` or your environment variables).

## Project Structure

```
seaman/
├── public/                     # Static assets
│   ├── css/style.css           # Custom stylesheets
│   └── js/script.js            # Custom client-side JavaScript
├── views/                      # EJS templates
│   ├── partials/               # Reusable EJS partials (header, footer)
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── index.ejs               # Homepage template
│   ├── department_waterways.ejs # Template for Waterways department
│   ├── department_engineering.ejs # Template for Engineering department
│   ├── department_operations.ejs  # Template for Operations department
│   ├── department_seafarer.ejs  # Template for Seafarer department
│   └── department_sse.ejs      # Template for SSE department
│   └── (potentially a 404.ejs for error pages)
├── routes/
│   └── index.js                # Express routes for the application
├── server.js                   # Main Express server setup
├── package.json                # Project metadata and dependencies
├── package-lock.json           # Exact versions of dependencies
└── README.md                   # This file
```

## Key Features

*   **Homepage:** Displays the main title and five category buttons for different departments.
*   **Department Pages:** Each category button links to a dedicated page for that department.
*   **Responsive Design:** Uses Bootstrap for mobile-friendliness.
*   **Burmese Language Support:** Styled for clear rendering of Burmese Unicode text.
*   **Node.js & Express Backend:** Serves the EJS templates.

## Customization

*   **Styling:** Modify `public/css/style.css` for visual changes.
*   **Content:** Edit the `.ejs` files in the `views` directory to change page content and layout.
*   **Routes & Logic:** Update `routes/index.js` for routing changes and `server.js` for server configuration.

## Future Enhancements (Suggestions)

*   Implement actual online payment functionality.
*   Add a database for dynamic content management.
*   User authentication for specific services.
*   More detailed content for each department page.
*   A dedicated `404.ejs` page for better error handling.
*   Accessibility audit and improvements (WCAG compliance).
