# Career Mode Tracker

##

Welcome to the Career Mode Tracker, a web application designed for football gaming enthusiasts who want to take their career mode experience to the next level. This app allows you to meticulously track every detail of your managerial journey, from player stats and transfers to seasonal performance and trophy cabinets. Say goodbye to spreadsheets and notebooks, and hello to a streamlined, interactive, and visually engaging way to manage your virtual football career.

## Features

- **Career Management:** Create, edit, and delete multiple careers. Customize your club with a unique name, manager, badge, and team colors.
- **Seasonal Tracking:** Add and manage seasons within each career. Get a comprehensive overview of each season, including squad statistics, transfer activities, and financial balances.
- **Player Management:** Add, edit, sell, or delete players from your squad. Keep detailed records of player information such as overall rating, position, age, market value, salary, and contract duration.
- **Detailed Statistics:** Log player statistics for each season and competition. The app automatically calculates total stats and performance averages.
- **Transfer System:** Record all player arrivals and departures, including transfer fees and dates, to maintain a clear history of your transfer dealings.
- **Trophy Cabinet:** Add and display all the trophies and accolades your team has won throughout your career.

## Tech Stack

- **Frontend:** React, TypeScript
- **Backend (BaaS):** Firebase (Authentication, Firestore)
- **Styling:** CSS Modules
- **Routing:** React Router DOM

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1.  **Clone the repo**
    ```sh
    git clone [https://github.com/your-username/career-mode-tracker.git](https://github.com/your-username/career-mode-tracker.git)
    ```
2.  **Install NPM packages**
    ```sh
    npm install
    ```
    or
    ```sh
    yarn install
    ```
3.  **Set up environment variables**

    Create a `.env` file in the root of your project and add the following Firebase configuration variables:

    ```
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
    ```

4.  **Run the app**
    ```sh
    npm run dev
    ```
    or
    ```sh
    yarn dev
    ```

## File Organization

The project is organized into the following directory structure:

````md
# Career Mode Companion

![Logo](https://i.imgur.com/8a64tA8.png)

##

Welcome to the Career Mode Companion, a web application designed for football gaming enthusiasts who want to take their career mode experience to the next level. This app allows you to meticulously track every detail of your managerial journey, from player stats and transfers to seasonal performance and trophy cabinets. Say goodbye to spreadsheets and notebooks, and hello to a streamlined, interactive, and visually engaging way to manage your virtual football career.

## Features

- **Career Management:** Create, edit, and delete multiple careers. Customize your club with a unique name, manager, badge, and team colors.
- **Seasonal Tracking:** Add and manage seasons within each career. Get a comprehensive overview of each season, including squad statistics, transfer activities, and financial balances.
- **Player Management:** Add, edit, sell, or delete players from your squad. Keep detailed records of player information such as overall rating, position, age, market value, salary, and contract duration.
- **Detailed Statistics:** Log player statistics for each season and competition. The app automatically calculates total stats and performance averages.
- **Transfer System:** Record all player arrivals and departures, including transfer fees and dates, to maintain a clear history of your transfer dealings.
- **Trophy Cabinet:** Add and display all the trophies and accolades your team has won throughout your career.

## Tech Stack

- **Frontend:** React, TypeScript
- **Backend (BaaS):** Firebase (Authentication, Firestore)
- **Styling:** CSS Modules
- **Routing:** React Router DOM

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1.  **Clone the repo**
    ```sh
    git clone [https://github.com/your-username/career-mode-companion.git](https://github.com/your-username/career-mode-companion.git)
    ```
2.  **Install NPM packages**
    ```sh
    npm install
    ```
    or
    ```sh
    yarn install
    ```
3.  **Set up environment variables**

    Create a `.env` file in the root of your project and add the following Firebase configuration variables:

    ```
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
    ```

4.  **Run the app**
    ```sh
    npm run dev
    ```
    or
    ```sh
    yarn dev
    ```

## File Organization

The project is organized into the following directory structure:

src
├── assets
├── common
│ ├── constants
│ ├── elements
│ ├── helpers
│ ├── hooks
│ ├── interfaces
│ ├── services
│ ├── types
│ └── utils
├── components
├── contexts
├── pages
├── ui
├── App.tsx
├── index.css
└── main.tsx

- **`src/assets`**: Contains static assets like images and logos.
- **`src/common`**: A centralized module for shared logic, including:
  - **`constants`**: Application-wide constants.
  - **`elements`**: Reusable UI elements and components.
  - **`helpers`**: Helper functions for various tasks.
  - **`hooks`**: Custom React hooks for managing state and logic.
  - **`interfaces`**: TypeScript interfaces for data structures.
  - **`services`**: Services for interacting with external APIs like Firebase.
  - **`types`**: TypeScript type definitions.
  - **`utils`**: Utility functions.
- **`src/components`**: Reusable React components used throughout the application.
- **`src/contexts`**: React context providers for managing global state.
- **`src/pages`**: Top-level page components corresponding to different routes.
- **`src/ui`**: UI-specific components that are used to build the user interface.

## Usage

1.  **Authentication:** Start by creating an account or logging in.
2.  **Create a Career:** From the main dashboard, create a new career by providing your club's name, your manager's name, and the nation of your club.
3.  **Add Seasons:** Once your career is created, you can start adding seasons to it.
4.  **Manage Your Squad:** Within a season, you can add players to your squad, providing their details such as name, position, overall rating, and contract information.
5.  **Track Statistics:** As you play through your season, you can update player stats for different competitions.
6.  **Record Transfers:** When you buy or sell a player, record the transaction in the app to keep your transfer history up to date.
7.  **Log Trophies:** Whenever you win a competition, add the trophy to your collection to build your legacy.
````
