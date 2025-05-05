import React from "react";
import Dashboard from "./pages/dashboard/Dashboard";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext";
import LoadingRoute from "./components/LoadingRoute";
import { Project } from "./pages/project/Project";
import { Board } from "./pages/kanban/Board";
import LoginPage from "./pages/login/Login";
import SignupPage from "./pages/signup/Signup";
import Repository from "./pages/repository/Repository";

function App() {

	return (
		<Router>
			<AuthProvider>
				<Routes>
					<Route path="/" element={<LoginPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/signup" element={<SignupPage />} />

					{/* Protected Routes */}
					<Route element={<LoadingRoute />}>
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/project/:projectid" element={<Project />} />
						<Route path="/project/:projectid/board/:boardid" element={<Board />} />
						<Route path="/project/:projectid/repository/:repoid" element={<Repository />} />
					</Route>

					{/* Redirect any unknown routes */}
					<Route path="/*" element={<div>Not Found</div>} /> {/* You can replace this with a 404 page */}
				</Routes>
			</AuthProvider>
		</Router>
	);
}

export default App;