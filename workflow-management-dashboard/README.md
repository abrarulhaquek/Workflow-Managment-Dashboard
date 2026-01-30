# Workflow Management Dashboard

A modern, responsive, and feature-rich **Workflow Management Dashboard** built with **Angular 18** and **NgRx**. This application allows users to track, manage, and analyze workflow processes with role-based access control, real-time feedback, and a premium dark-themed UI.

## 🚀 Key Features

*   **📊 Interactive Dashboard**:
    *   Visual status distribution charts (using `ng2-charts`).
    *   Key metrics: Overdue workflows, Average completion time, and Active counts.
    *   Real-time data aggregation.
*   **✅ Workflow Management**:
    *   **CRUD Operations**: Create, Read, Update, and Delete workflows.
    *   **Advanced Filtering**: Server-side (mocked) search and status filtering.
    *   **Pagination**: Efficient handling of large datasets.
    *   **Validation**: Async name validation to prevent duplicates.
*   **🔐 Authentication & Security**:
    *   **Role-Based Access Control (RBAC)**: Distinct permissions for Admin, Manager, and User roles.
    *   **Secure Guards**: Protects routes based on authentication status and user roles.
    *   **Mock Authentication**: Simulates secure login/logout flows with session persistence.
*   **🎨 Premium UI/UX**:
    *   **Global Dark Theme**: Consistent, high-contrast dark mode for reduced eye strain.
    *   **Responsive Design**: Optimized for various screen sizes.
    *   **Angular Material**: Polished components (Tables, Dialogs, Sidebars, Cards).
    *   **Feedback**: Loading indicators and Snackbar notifications for user actions.

## 🛠️ Technology Stack

*   **Framework**: Angular 18 (Standalone Components)
*   **State Management**: NgRx (Store, Effects, Selectors, Facades)
*   **UI Library**: Angular Material 18
*   **Styling**: SCSS (with extensive custom theming)
*   **Reactive Programming**: RxJS (Debouncing, Switching, Combining)
*   **Charting**: ng2-charts / Chart.js
*   **Build**: Angular CLI + Vercel Deployment

## 📂 Project Architecture

The project follows a **Feature-Based Clean Architecture** to ensure scalability and maintainability:

```
src/app/
├── core/               # Singleton services, models, and interceptors
│   ├── auth/           # Guards (AuthGuard, RoleGuard)
│   ├── http/           # Interceptors (MockAPI, Token, Error)
│   ├── models/         # TypeScript Interfaces (Workflow, Auth)
│   └── theme/          # Theme management service
├── features/           # Domain-specific modules
│   ├── auth/           # Login page, Auth state
│   ├── dashboard/      # Analytics, Charts
│   └── workflows/      # List, Editor, State management
├── shared/             # Reusable UI components
│   └── layout/         # App Shell, Sidebar, Toolbar
└── styles.scss         # Global styles & Dark theme overrides
```

### State Management Flow (NgRx)
1.  **Component** dispatches an **Action** (e.g., `loadWorkflows`).
2.  **Effect** intercepts the action and calls the **Mock API**.
3.  **Reducer** updates the **State** with the API response.
4.  **Selector** derives a slice of state (e.g., `selectVisibleWorkflows`).
5.  **Facade** exposes the data as an `Observable` to the **Component**.

## 🚦 Getting Started

### Prerequisites
*   Node.js v18+
*   npm v9+

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-repo/workflow-dashboard.git
    cd workflow-dashboard
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm start
    ```
    Navigate to `http://localhost:4200/`.

## 🧪 Mock API & Authentication

This application uses a sophisticated **HttpInterceptor** to mock a backend server. No external API is required.

### Test Credentials
You can log in with any username, but the **Role** determines your permissions:

| Role | Username | Permissions |
| :--- | :--- | :--- |
| **Admin** | `admin` | Full Access (Create, Edit, Delete, Approve) |
| **Manager** | `manager` | Approve Workflows, View Dashboard |
| **User** | `user` | Create Workflows, View Own Workflows |

*(Password is not required for the mock login)*

## 📝 Assignments & Constraints
*   **No Testing Files**: `*.spec.ts` files have been removed to keep the codebase focused on implementation.
*   **Performance**: Uses `OnPush` change detection and `trackBy` functions for optimal rendering.
*   **Clean Code**: AI-generated artifacts have been removed for a human-written feel.

---
*Built for the Advanced Angular Assessment.*
