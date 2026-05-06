'use client';;
import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { GithubIcon, LinkedinIcon, TwitterIcon, PlaneIcon } from 'lucide-react';

const footerLinks = [
	{
		label: 'Product',
		links: [
			{ title: 'Dashboard', href: '/dashboard' },
			{ title: 'Route Optimization', href: '/dashboard' },
			{ title: 'Weather Data', href: '/dashboard' },
			{ title: 'ML Models', href: '/dashboard' },
		],
	},
	{
		label: 'Company',
		links: [
			{ title: 'About Us', href: '/about' },
			{ title: 'Privacy Policy', href: '#' },
			{ title: 'Terms of Service', href: '#' },
			{ title: 'Contact', href: '#' },
		],
	},
	{
		label: 'Resources',
		links: [
			{ title: 'Documentation', href: '#' },
			{ title: 'API Reference', href: '#' },
			{ title: 'Changelog', href: '#' },
			{ title: 'Support', href: '#' },
		],
	},
	{
		label: 'Connect',
		links: [
			{ title: 'GitHub', href: '#', icon: GithubIcon },
			{ title: 'LinkedIn', href: '#', icon: LinkedinIcon },
			{ title: 'Twitter', href: '#', icon: TwitterIcon },
		],
	},
];

export function Footer() {
	return (
		<footer
			className="w-full bg-black border-t border-gray-800/50 text-white"
			style={{ fontFamily: "'Poppins', sans-serif" }}>
			<div className="max-w-7xl mx-auto px-6 py-14 lg:py-20">
				<div className="grid w-full gap-10 xl:grid-cols-3 xl:gap-12">
					<AnimatedContainer className="space-y-4">
						<div className="flex items-center gap-2">
							<PlaneIcon className="size-6 -rotate-45 text-white" />
							<span className="text-xl font-semibold text-white">AeroNexus</span>
						</div>
						<p className="text-sm leading-relaxed max-w-xs" style={{ color: '#9ca3af' }}>
							Next-generation flight intelligence platform combining A* pathfinding, real-time weather data, and machine learning for optimized aviation operations.
						</p>
						<p className="text-xs pt-2" style={{ color: '#6b7280' }}>
							© {new Date().getFullYear()} AeroNexus. All rights reserved.
						</p>
					</AnimatedContainer>

					<div className="mt-4 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2 xl:mt-0">
						{footerLinks.map((section, index) => (
							<AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
								<div>
									<h3 className="text-xs font-semibold uppercase tracking-widest text-white mb-4">{section.label}</h3>
									<ul className="space-y-2.5 text-sm" style={{ color: '#9ca3af' }}>
										{section.links.map((link) => (
											<li key={link.title}>
												<a
													href={link.href}
													className="hover:text-white inline-flex items-center gap-1.5 transition-colors duration-200">
													{link.icon && <link.icon className="size-3.5" />}
													{link.title}
												</a>
											</li>
										))}
									</ul>
								</div>
							</AnimatedContainer>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
}

function AnimatedContainer({
    className,
    delay = 0.1,
    children
}) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return children;
	}

	return (
        <motion.div
            initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
            whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.8 }}
            className={className}>
            {children}
        </motion.div>
    );
}