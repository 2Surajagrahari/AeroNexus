'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
// Ensure these API functions exist in your services/api.js file!
// import { requestRegistration, verifyRegistrationOtp, loginUser } from '../../services/api';
import { requestRegistration, verifyRegistrationOtp, loginUser } from "../services/api";

import {
	AppleIcon,
	AtSignIcon,
	ChevronLeftIcon,
	GithubIcon,
	Grid2x2PlusIcon,
	KeyIcon,
	UserIcon
} from 'lucide-react';

export function AuthPage() {
	const navigate = useNavigate();

	// 🧠 UI State Management
	const [mode, setMode] = useState('login'); // 'login' | 'register' | 'verify'
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	// 📝 Form Data State
	const [formData, setFormData] = useState({
		email: '',
		username: '',
		password: '',
		otp: ''
	});

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			if (mode === 'login') {
				const res = await loginUser({ username: formData.email, password: formData.password });
				localStorage.setItem('aeronexus_token', res.token);
				navigate('/dashboard');
			} else if (mode === 'register') {
				await requestRegistration({
					email: formData.email,
					username: formData.username,
					password: formData.password
				});
				setMode('verify');
			} else if (mode === 'verify') {
				const res = await verifyRegistrationOtp({
					email: formData.email,
					username: formData.username,
					password: formData.password,
					otp: formData.otp
				});
				localStorage.setItem('aeronexus_token', res.token);
				navigate('/dashboard');
			}
		} catch (err) {
			setError(err.response?.data?.error || "An error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	// Placeholder for future OAuth integrations
	const handleSocialLogin = (provider) => {
		console.log(`Initiating ${provider} login...`);
		// Here is where you will add Firebase/Auth0 logic later!
	};

	return (
		<main className="dark bg-black text-white relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2">
			<style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
                * { font-family: 'Poppins', sans-serif; }
            `}</style>

			{/* Left Side - Graphic & Quote */}
			<div className="bg-muted/60 relative hidden h-full flex-col border-r border-white/10 p-10 lg:flex">
				<div className="from-background absolute inset-0 z-10 bg-gradient-to-t to-transparent" />
				<div className="z-10 flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
					<Grid2x2PlusIcon className="size-6 text-blue-500" />
					<p className="text-xl font-semibold">AeroNexus</p>
				</div>
				<div className="z-10 mt-auto">
					<blockquote className="space-y-2 bg-black/40 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
						<p className="text-xl leading-relaxed text-gray-200">
							&ldquo;AeroNexus optimizes our flight paths with unparalleled precision. The AI routing and real-time hazard avoidance have completely transformed our dispatch operations.&rdquo;
						</p>
						<footer className="font-mono text-sm font-semibold text-blue-400">
							~ Capt. Elena Garcia, GlobalAir
						</footer>
					</blockquote>
				</div>
				<div className="absolute inset-0">
					<FloatingPaths position={1} />
					<FloatingPaths position={-1} />
				</div>
			</div>

			{/* Right Side - Auth Forms */}
			<div className="relative flex min-h-screen flex-col justify-center p-4">
				<div aria-hidden className="absolute inset-0 isolate contain-strict -z-10 opacity-60">
					<div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,rgba(59,130,246,0.15)_0,rgba(255,255,255,0.02)_50%,transparent_80%)] absolute top-0 right-0 h-320 w-140 -translate-y-87.5 rounded-full" />
				</div>

				<Button asChild variant="ghost" className="absolute top-7 left-5 cursor-pointer hover:bg-white/10 transition-colors">
					<Link to="/">
						<ChevronLeftIcon className='size-4 me-2' />Home
					</Link>
				</Button>

				<div className="mx-auto space-y-6 sm:w-[400px] z-10">
					<div className="flex flex-col space-y-2 text-center md:text-left">
						<h1 className="font-sans text-3xl font-bold tracking-wide text-white">
							{mode === 'login' ? "Welcome Back" : mode === 'register' ? "Create an Account" : "Verify Your Email"}
						</h1>
						<p className="text-gray-400 text-sm">
							{mode === 'verify' ? `We sent a 6-digit code to ${formData.email}` : "Log in or create your AeroNexus account."}
						</p>
					</div>

					{error && (
						<div className="p-3 text-sm bg-red-500/10 border border-red-500/50 text-red-400 rounded-md text-center">
							{error}
						</div>
					)}

					{/* Social Logins - Hidden during OTP phase */}
					{mode !== 'verify' && (
						<>
							<div className="space-y-3">
								<Button type="button" size="lg" className="w-full cursor-pointer bg-white text-black hover:bg-gray-200 hover:-translate-y-0.5 transition-all active:scale-95" onClick={() => handleSocialLogin('Google')}>
									<GoogleIcon className='size-5 me-2' /> Continue with Google
								</Button>
								<Button type="button" size="lg" className="w-full cursor-pointer bg-[#111] border border-white/10 hover:bg-white/10 hover:-translate-y-0.5 transition-all active:scale-95" onClick={() => handleSocialLogin('Apple')}>
									<AppleIcon className='size-5 me-2' /> Continue with Apple
								</Button>
								<Button type="button" size="lg" className="w-full cursor-pointer bg-[#24292e] border border-white/10 hover:bg-[#2f363d] hover:-translate-y-0.5 transition-all active:scale-95" onClick={() => handleSocialLogin('GitHub')}>
									<GithubIcon className='size-5 me-2' /> Continue with GitHub
								</Button>
							</div>
							<AuthSeparator />
						</>
					)}

					{/* Dynamic Email Form */}
					<form onSubmit={handleSubmit} className="space-y-4">
						{mode === 'verify' && (
							<div className="relative">
								<Input name="otp" placeholder="Enter 6-digit code" className="peer ps-9 text-center tracking-[0.5em] text-lg bg-black border-white/20 focus:border-blue-500 h-12" maxLength="6" required value={formData.otp} onChange={handleChange} />
								<div className="text-gray-500 absolute inset-y-0 start-0 flex items-center ps-3">
									<KeyIcon className="size-5" />
								</div>
							</div>
						)}

						{mode !== 'verify' && (
							<>
								{mode === 'register' && (
									<div className="relative">
										<Input name="username" placeholder="Choose a username" className="peer ps-10 bg-black border-white/20 focus:border-blue-500 h-12" required value={formData.username} onChange={handleChange} />
										<div className="text-gray-500 absolute inset-y-0 start-0 flex items-center ps-3">
											<UserIcon className="size-5" />
										</div>
									</div>
								)}
								<div className="relative">
									<Input name="email" placeholder="your.email@example.com" type="email" className="peer ps-10 bg-black border-white/20 focus:border-blue-500 h-12" required value={formData.email} onChange={handleChange} />
									<div className="text-gray-500 absolute inset-y-0 start-0 flex items-center ps-3">
										<AtSignIcon className="size-5" />
									</div>
								</div>
								<div className="relative">
									<Input name="password" placeholder="Password" type="password" className="peer ps-10 bg-black border-white/20 focus:border-blue-500 h-12" required value={formData.password} onChange={handleChange} />
									<div className="text-gray-500 absolute inset-y-0 start-0 flex items-center ps-3">
										<KeyIcon className="size-5" />
									</div>
								</div>
							</>
						)}

						<Button type="submit" className="w-full cursor-pointer h-12 bg-blue-600 hover:bg-blue-500 text-white font-semibold hover:-translate-y-0.5 transition-all active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]" disabled={loading}>
							{loading ? "Processing..." : mode === 'login' ? "Sign In" : mode === 'register' ? "Send OTP Code" : "Verify & Launch"}
						</Button>
					</form>

					{/* Mode Switcher */}
					{mode !== 'verify' && (
						<p className="text-center text-sm text-gray-400 mt-6">
							{mode === 'login' ? "Don't have an account? " : "Already have an account? "}
							<button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer hover:underline underline-offset-4">
								{mode === 'login' ? "Sign up" : "Log in"}
							</button>
						</p>
					)}

					<p className="text-center text-xs text-gray-500 mt-8">
						By clicking continue, you agree to our{' '}
						<a href="#" className="hover:text-white underline underline-offset-4 cursor-pointer transition-colors">Terms of Service</a>{' '}
						and{' '}
						<a href="#" className="hover:text-white underline underline-offset-4 cursor-pointer transition-colors">Privacy Policy</a>.
					</p>
				</div>
			</div>
		</main>
	);
}

// ----------------------------------------------------------------------
// HELPER COMPONENTS (Paths, Icons, Separators) - Unchanged Functionality
// ----------------------------------------------------------------------

function FloatingPaths({ position }) {
	const paths = Array.from({ length: 36 }, (_, i) => ({
		id: i,
		d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
		color: `rgba(15,23,42,${0.1 + i * 0.03})`,
		width: 0.5 + i * 0.03,
	}));

	return (
		<div className="pointer-events-none absolute inset-0">
			<svg className="h-full w-full text-blue-900/30" viewBox="0 0 696 316" fill="none">
				<title>Background Paths</title>
				{paths.map((path) => (
					<motion.path key={path.id} d={path.d} stroke="currentColor" strokeWidth={path.width} strokeOpacity={0.1 + path.id * 0.03} initial={{ pathLength: 0.3, opacity: 0.6 }} animate={{ pathLength: 1, opacity: [0.3, 0.6, 0.3], pathOffset: [0, 1, 0] }} transition={{ duration: 20 + Math.random() * 10, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }} />
				))}
			</svg>
		</div>
	);
}

const GoogleIcon = (props) => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
		<path d="M12.479,14.265v-3.279h11.049c0.108,0.571,0.164,1.247,0.164,1.979c0,2.46-0.672,5.502-2.84,7.669C18.744,22.829,16.051,24,12.483,24C5.869,24,0.308,18.613,0.308,12S5.869,0,12.483,0c3.659,0,6.265,1.436,8.223,3.307L18.392,5.62c-1.404-1.317-3.307-2.341-5.913-2.341C7.65,3.279,3.873,7.171,3.873,12s3.777,8.721,8.606,8.721c3.132,0,4.916-1.258,6.059-2.401c0.927-0.927,1.537-2.251,1.777-4.059L12.479,14.265z" />
	</svg>
);

const AuthSeparator = () => {
	return (
		<div className="flex w-full items-center justify-center">
			<div className="bg-white/10 h-px w-full" />
			<span className="text-gray-500 px-4 text-xs font-medium tracking-widest">OR</span>
			<div className="bg-white/10 h-px w-full" />
		</div>
	);
};