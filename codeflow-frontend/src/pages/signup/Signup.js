import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

const SignupPage = () => {
	const [fullName, setFullName] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const { register, currentUser, error } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		// Redirect if user is already logged in
		if (currentUser) {
			navigate('/dashboard');
		}
	}, [currentUser, navigate]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const image = ''; // Placeholder for image upload logic
		const name = fullName;
		const success = await register({ name, username, password, image });
		if (success) {
		  navigate('/dashboard');
		}
	};

	return (
		<div className="flex min-h-screen bg-[#1E1E1E] text-white">

			{/* Main content */}
			<div className="flex-1 flex items-center justify-center">
				<div className="w-full max-w-md p-8">
					<div className="text-center mb-8">
						<img src={logo} alt='logo' className="w-16 h-16 rounded-md flex items-center justify-center text-white text-2xl font-semibold mx-auto mb-4" />

						<h1 className="text-2xl font-bold">Create an account</h1>
						<p className="text-gray-400 mt-2">Join CodeFlow to get started</p>
					</div>

					<form onSubmit={handleSubmit}>
						<div className="mb-4">
							<label htmlFor="full-name" className="block text-sm font-medium text-gray-300 mb-2">
								Full Name
							</label>
							<input
								id="full-name"
								type="text"
								className="w-full bg-[#3C3C3C] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0078D4] focus:border-transparent"
								placeholder="John Doe"
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
								required
							/>
						</div>

						<div className="mb-4">
							<label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
								Username
							</label>
							<input
								id="username"
								type="username"
								className="w-full bg-[#3C3C3C] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0078D4] focus:border-transparent"
								placeholder="abc123"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
							/>
						</div>

						<div className="mb-4">
							<label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
								Password
							</label>
							<div className="relative">
								<input
									id="password"
									type={showPassword ? "text" : "password"}
									className="w-full bg-[#3C3C3C] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0078D4] focus:border-transparent"
									placeholder="••••••••"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
								<button
									type="button"
									className="absolute right-3 top-3 text-gray-400"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
								</button>
							</div>
							<p className="text-xs text-gray-400 mt-1">Password must be at least 8 characters long</p>
						</div>

						<div className="mb-6">
							<label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-2">
								Confirm Password
							</label>
							<div className="relative">
								<input
									id="confirm-password"
									type={showConfirmPassword ? "text" : "password"}
									className="w-full bg-[#3C3C3C] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0078D4] focus:border-transparent"
									placeholder="••••••••"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									required
								/>
								<button
									type="button"
									className="absolute right-3 top-3 text-gray-400"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								>
									{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
								</button>
							</div>
						</div>

						{error && <div className="text-red-700">{error}</div>}

						<button
							type="submit"
							className="w-full bg-[#0078D4] hover:bg-[#106EBE] text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0078D4] focus:ring-offset-2 focus:ring-offset-gray-900"
						>
							Create account
						</button>
					</form>

					<div className="mt-8 text-center">
						<p className="text-gray-400">
							Already have an account?{' '}
							<Link to="/login" className="text-white underline font-medium">
								Sign in
							</Link>
						</p>
					</div>
				</div>
			</div>


		</div>
	);
};

export default SignupPage;