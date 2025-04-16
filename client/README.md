## React

vite.dev
#npm create vite@latest

## Tailwind
    Tailwind css-documentation-installation-frameworkGuidelines-vite
    Install tailwind css-autoprefixer
    -npx tailwindcss init -p
    






# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


## Navbar Overview – Role-Based Dynamic Navigation
This Navbar component is built using React + Redux and dynamically updates based on the user's authentication status and role.

✅ Features Implemented
Dynamic link rendering based on user role:

Shows Login/Register for guests

Displays Dashboard, Profile, and Logout for authenticated users

Routes to the correct dashboard based on role (user, admin, theater_owner)

Logout button clears Redux auth state and redirects to home

Clean DaisyUI styling for a responsive look

🛠 Key Logic

// Pull user and auth status from Redux
const { user, isAuthenticated } = useSelector((state) => state.auth);

// Get dashboard route based on role
const getDashboardPath = () => {
  if (user?.role === "admin") return "/admin/dashboard";
  if (user?.role === "theater_owner") return "/theater/dashboard";
  return "/user/dashboard";
};

🔁 Conditional Rendering Logic
Auth Status	Role	Visible Links
Not Logged In	—	Shows, Login, Register
Logged In	user	Shows, Profile, User Dashboard, Logout
Logged In	admin	Admin Dashboard, Profile, Logout
Logged In	theater_owner	Theater Dashboard, Profile, Logout

🔐 Logout Behavior
Dispatches logout() from Redux

Shows toast notification using Sonner

Navigates back to /

const handleLogout = () => {
  dispatch(logout());
  toast.success("✅ Logged out successfully.");
  navigate("/");
};

🧠 Things to Add Later
Highlight active links using NavLink

Responsive toggle for mobile navigation

Add dropdown with role-based submenus

Add My Bookings, Add Show, Manage Users, etc.