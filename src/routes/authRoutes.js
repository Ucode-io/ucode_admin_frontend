import Login from "../views/login/Login.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";

export default [
  {
    id: 14,
    component: Login,
    path: "/login",
    exact: false,
    title: "Login",
    icon: "",
    showSidepanel: true,
    permission: "",
    children: []
  }
].map((route) => ({ ...route, path: `/auth${route.path}`, layout: AuthLayout }));

