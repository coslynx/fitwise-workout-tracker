<div class="hero-icon" align="center">
          <img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-markdown-open.svg" width="100" />
        </div>

        <h1 align="center">
        fitness-tracker-web-mvp
        </h1>
        <h4 align="center">An MVP web application providing personalized workout plans and online progress tracking.</h4>
        <h4 align="center">Developed with the software and tools below.</h4>
        <div class="badges" align="center">
          <img src="https://img.shields.io/badge/Framework-React%2018.2-blue" alt="Framework: React 18.2">
          <img src="https://img.shields.io/badge/Frontend-Vite%20~5.0,_Tailwind%20~3.4-red" alt="Frontend: Vite ~5.0, Tailwind ~3.4">
          <img src="https://img.shields.io/badge/Backend_(BaaS)-Supabase%20~2.39-blue" alt="Backend (BaaS): Supabase ~2.39">
          <img src="https://img.shields.io/badge/Database-PostgreSQL%20(via%20Supabase)-black" alt="Database: PostgreSQL (via Supabase)">
        </div>
        <div class="badges" align="center">
          <img src="https://img.shields.io/github/last-commit/coslynx/fitness-tracker-web-mvp?style=flat-square&color=5D6D7E" alt="git-last-commit" />
          <img src="https://img.shields.io/github/commit-activity/m/coslynx/fitness-tracker-web-mvp?style=flat-square&color=5D6D7E" alt="GitHub commit activity" />
          <img src="https://img.shields.io/github/languages/top/coslynx/fitness-tracker-web-mvp?style=flat-square&color=5D6D7E" alt="GitHub top language" />
        </div>

        ## 📑 Table of Contents
        - 📍 Overview
        - 📦 Features
        - 📂 Structure
        - 💻 Installation
        - 🏗️ Usage
        - 🌐 Hosting
        - 📄 License
        - 👏 Authors

        ## 📍 Overview
        This repository contains the Minimum Viable Product (MVP) for a **Fitness Tracker Website**. It's designed to provide users with personalized workout plans (based on templates for the MVP) and allow them to track their workout progress online. The application is built using a modern frontend stack: **React** (v18.2) for the UI, **Vite** (~5.0) for fast development and builds, and **Tailwind CSS** (~3.4) for utility-first styling. The backend functionality, including user authentication and database storage (PostgreSQL), is handled by **Supabase** (~2.39), a Backend-as-a-Service platform. **React Router DOM** (~6.21) manages client-side navigation, and **date-fns** (~3.0) assists with date formatting.

        ## 📦 Features
        |    | Feature                  | Description                                                                                                                                   |
        |----|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
        | 🔐 | **Authentication**       | Secure user sign-up and login using email/password via Supabase Auth. Session management and protected routes ensure user data privacy.      |
        | 📅 | **Workout Plan Display** | Fetches and displays a pre-assigned workout plan (MVP uses templates based on user ID/profile) on the user's dashboard after login.             |
        | 💪 | **Progress Logging**     | Allows users to log details of their completed workout exercises, including sets, reps, and optionally weight used, associated with a specific date. |
        | 📊 | **Progress History**     | Displays a chronological history of the user's logged workout sessions, allowing them to review past performance.                               |
        | 📱 | **Responsive Design**    | The UI is styled with Tailwind CSS for responsiveness across various screen sizes (desktop, tablet, mobile).                                     |
        | ✨ | **Modern Tooling**       | Built with Vite for a fast development experience (HMR) and optimized production builds. Uses React Context for global state management (Auth). |
        | ☁️ | **Backend-as-a-Service** | Leverages Supabase for database, authentication, and API needs, minimizing backend development effort for the MVP scope.                      |
        | 🧩 | **Modularity**           | Code is organized into components, pages, services, context, and hooks for better maintainability and potential future expansion.                |

        ## 📂 Structure
        ```text
        .
        ├── public/
        │   └── index.html       # Main HTML entry point
        │   └── vite.svg         # Default Vite icon (placeholder)
        ├── src/
        │   ├── components/      # Reusable UI components
        │   │   ├── Button.jsx
        │   │   ├── Footer.jsx
        │   │   ├── Header.jsx
        │   │   └── InputField.jsx
        │   ├── context/         # React Context providers
        │   │   └── AuthContext.jsx
        │   ├── hooks/           # Custom React Hooks
        │   │   └── useRequireAuth.js # (Note: Renamed from file structure for clarity)
        │   ├── pages/           # Page-level components
        │   │   ├── AuthPage.jsx
        │   │   ├── DashboardPage.jsx
        │   │   └── ProgressPage.jsx
        │   ├── routes/          # Routing configuration
        │   │   └── AppRouter.jsx
        │   ├── services/        # API/Backend interaction logic
        │   │   ├── authService.js
        │   │   ├── supabaseClient.js
        │   │   └── workoutService.js
        │   ├── styles/          # Global CSS styles
        │   │   └── index.css
        │   ├── App.jsx          # Root application component (layout)
        │   └── main.jsx         # Application entry point (renders App)
        ├── .env                 # Environment variables (Supabase keys) - **DO NOT COMMIT**
        ├── .env.example         # Example environment file
        ├── .eslintrc.cjs        # ESLint configuration
        ├── .gitignore           # Git ignore rules
        ├── index.html           # (Moved to public/index.html by Vite convention)
        ├── package.json         # Project metadata and dependencies
        ├── postcss.config.js    # PostCSS configuration (for Tailwind/Autoprefixer)
        ├── README.md            # This file
        ├── tailwind.config.js   # Tailwind CSS configuration
        └── vite.config.js       # Vite configuration
        ```

        ## 💻 Installation
          > [!WARNING]
          > ### 🔧 Prerequisites
          > - **Node.js**: Version 18.x or later recommended. (Check with `node -v`)
          > - **npm**: Version 9.x or later recommended (or yarn). (Check with `npm -v`)
          > - **Supabase Account**: A free account at [supabase.com](https://supabase.com) is required to get project URL and API keys.
          > - **Supabase Project Setup**:
          >   - Create a new Supabase project.
          >   - **Enable Email/Password Authentication**: In your Supabase project dashboard -> Authentication -> Providers -> Email -> Enable.
          >   - **Database Schema**: Set up the necessary tables (e.g., `profiles`, `workout_plans`, `progress_logs`) based on `workoutService.js`. You'll need to define columns and potentially RLS policies. (See Supabase docs for table editor and SQL editor).

          ### 🚀 Setup Instructions
          1. Clone the repository:
             ```bash
             git clone https://github.com/coslynx/fitness-tracker-web-mvp.git
             cd fitness-tracker-web-mvp
             ```
          2. Install dependencies:
             ```bash
             npm install
             ```
          3. Configure environment variables:
             - Copy the example environment file:
               ```bash
               cp .env.example .env
               ```
             - Edit the newly created `.env` file:
               ```dotenv
               # Supabase Project URL - Replace with your actual Supabase project URL
               VITE_SUPABASE_URL=YOUR_SUPABASE_URL_HERE

               # Supabase Public Anonymous Key - Replace with your actual Supabase anon key
               VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY_HERE
               ```
             - Replace `YOUR_SUPABASE_URL_HERE` and `YOUR_SUPABASE_ANON_KEY_HERE` with the actual credentials from your Supabase project dashboard (Project Settings -> API).

          > [!IMPORTANT]
          > Ensure your Supabase database tables (`workout_plans`, `progress_logs`) and necessary Row Level Security (RLS) policies are set up correctly for the application features to work as intended. The MVP services (`workoutService.js`) assume these tables exist.

        ## 🏗️ Usage
          ### 🏃‍♂️ Running the MVP
          1. Start the development server:
             ```bash
             npm run dev
             ```
          2. Access the application in your browser:
             - The terminal will output the local URL, typically [http://localhost:3000](http://localhost:3000) (as configured in `vite.config.js`).

          > [!TIP]
          > ### ⚙️ Configuration
          > - **Supabase Keys**: The core configuration happens in the `.env` file, providing the necessary Supabase URL and Anon Key. Ensure these are correct and the file is **never** committed to version control.
          > - **Vite**: `vite.config.js` configures the development server port (3000) and React plugin integration.
          > - **Tailwind**: `tailwind.config.js` defines theme customizations (none for MVP) and importantly, the `content` array which specifies files to scan for CSS purging in production builds.
          > - **Supabase Backend**: All database schema, RLS policies, and auth settings are configured directly within your Supabase project dashboard.

          ### 📚 Usage Flow
          1. Navigate to the application URL.
          2. You will be prompted to **Login** or **Sign Up** on the `/auth` page.
          3. **Sign Up**: Create a new account using your email and password. (Depending on Supabase settings, email confirmation might be required).
          4. **Login**: Sign in with your existing credentials.
          5. Upon successful authentication, you will be redirected to the **Dashboard (`/`)**.
          6. **Dashboard**: View your assigned workout plan (MVP uses predefined templates).
          7. Navigate to the **Progress (`/progress`)** page.
          8. **View History**: See previously logged workout exercises.
          9. **Log Workout**: Fill in the form to log a new workout exercise session (Workout Name, Exercise, Sets, Reps, Date, optional Weight) and submit.
          10. The history list will update to include the newly logged item.
          11. **Logout**: Use the Logout button in the header.

        ## 🌐 Hosting
          ### 🚀 Deployment Instructions
          This project is a standard Vite/React application and can be deployed to various static hosting platforms that support Node.js build steps. Vercel and Netlify are excellent choices.

          #### Deploying to Vercel (Example)
          1. **Push to Git**: Ensure your code is pushed to a Git repository (GitHub, GitLab, Bitbucket).
          2. **Create Vercel Account**: Sign up or log in at [vercel.com](https://vercel.com).
          3. **Import Project**: Click "Add New..." -> "Project" and import your Git repository.
          4. **Configure Project**:
             - **Framework Preset**: Vercel should automatically detect `Vite`.
             - **Build Command**: Should default to `npm run build` or `vite build`. Verify this is correct.
             - **Output Directory**: Should default to `dist`. Verify this is correct.
             - **Install Command**: Should default to `npm install`. Verify this is correct.
          5. **Set Environment Variables**:
             - Navigate to Project Settings -> Environment Variables.
             - Add the following variables with the values from your `.env` file (or your production Supabase project if different):
               - `VITE_SUPABASE_URL` = `YOUR_SUPABASE_URL_HERE`
               - `VITE_SUPABASE_ANON_KEY` = `YOUR_SUPABASE_ANON_KEY_HERE`
             - Ensure these are available for the Production environment (and Preview/Development if needed).
          6. **Deploy**: Click the "Deploy" button. Vercel will build and deploy your application.

          > [!NOTE]
          > Similar steps apply for Netlify. Ensure the build command, output directory, and environment variables are correctly configured in the platform's settings.

          ### 🔑 Environment Variables
          The following environment variables are required for the application to connect to Supabase:

          - `VITE_SUPABASE_URL`: **Required**. The unique URL for your Supabase project.
            *Purpose*: Connects the frontend application to your specific Supabase backend.
            *Example*: `https://your-project-ref.supabase.co`
          - `VITE_SUPABASE_ANON_KEY`: **Required**. The public "anonymous" key for your Supabase project.
            *Purpose*: Allows the frontend application to interact with Supabase services within the bounds of your Row Level Security (RLS) policies. This key is safe to expose in client-side code.
            *Example*: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

        ## 📜 API Documentation
        This MVP utilizes **Supabase** as its Backend-as-a-Service (BaaS). There isn't a custom-built REST or GraphQL API defined within this repository itself. Instead, the frontend interacts directly with the Supabase APIs via the `@supabase/supabase-js` client library.

        ### Key Interactions:

        1.  **Authentication**: Managed via `supabase.auth` methods (`signUp`, `signInWithPassword`, `signOut`, `getSession`, `onAuthStateChange`). Interactions are abstracted in `src/services/authService.js` and managed globally by `src/context/AuthContext.jsx`.
        2.  **Database Operations**: Handled via `supabase.from('table_name').select() | .insert() | .update() | .delete()` methods. These are abstracted in `src/services/workoutService.js` for fetching plans (`workout_plans` table) and logging/fetching progress (`progress_logs` table).

        ### 🔒 Security Model:
        - **Authentication**: Supabase handles user authentication securely.
        - **Authorization**: Data access control relies heavily on **Supabase Row Level Security (RLS)** policies defined directly on your database tables (`workout_plans`, `progress_logs`). Ensure policies are configured correctly to allow users to only access and modify their own data. The `user.id` from the authenticated session is used in service calls (`workoutService.js`) to filter data appropriately based on these policies.

        > [!TIP]
        > Refer to the [Supabase Documentation](https://supabase.com/docs) for details on authentication, database interactions, and configuring Row Level Security policies. The code in `src/services/` provides specific examples of how this MVP interacts with Supabase.


        > [!NOTE]
        > ## 📜 License & Attribution
        >
        > ### 📄 License
        > This Minimum Viable Product (MVP) is licensed under the [GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/) license.
        >
        > ### 🤖 AI-Generated MVP
        > This MVP was entirely generated using artificial intelligence through [CosLynx.com](https://coslynx.com).
        >
        > No human was directly involved in the coding process of the repository: fitness-tracker-web-mvp
        >
        > ### 📞 Contact
        > For any questions or concerns regarding this AI-generated MVP, please contact CosLynx at:
        > - Website: [CosLynx.com](https://coslynx.com)
        > - Twitter: [@CosLynxAI](https://x.com/CosLynxAI)

        <p align="center">
          <h1 align="center">🌐 CosLynx.com</h1>
        </p>
        <p align="center">
          <em>Create Your Custom MVP in Minutes With CosLynxAI!</em>
        </p>
        <div class="badges" align="center">
          <img src="https://img.shields.io/badge/Developers-Drix10,_Kais_Radwan-red" alt="">
          <img src="https://img.shields.io/badge/Website-CosLynx.com-blue" alt="">
          <img src="https://img.shields.io/badge/Backed_by-Google,_Microsoft_&_Amazon_for_Startups-red" alt="">
          <img src="https://img.shields.io/badge/Finalist-Backdrop_Build_v4,_v6-black" alt="">
        </div>