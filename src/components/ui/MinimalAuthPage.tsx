"use client"

import React from 'react';
import { Button } from '@/components/ui/Button';
import { ChevronLeftIcon, Grid2x2PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { Particles } from '@/components/ui/Particles';

const GoogleIcon = (props: React.ComponentProps<'svg'>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		{...props}
	>
		<g>
			<path d="M12.479,14.265v-3.279h11.049c0.108,0.571,0.164,1.247,0.164,1.979c0,2.46-0.672,5.502-2.84,7.669   C18.744,22.829,16.051,24,12.483,24C5.869,24,0.308,18.613,0.308,12S5.869,0,12.483,0c3.659,0,6.265,1.436,8.223,3.307L18.392,5.62   c-1.404-1.317-3.307-2.341-5.913-2.341C7.65,3.279,3.873,7.171,3.873,12s3.777,8.721,8.606,8.721c3.132,0,4.916-1.258,6.059-2.401   c0.927-0.927,1.537-2.251,1.777-4.059L12.479,14.265z" />
		</g>
	</svg>
);

const GithubIcon = (props: React.ComponentProps<'svg'>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		{...props}
	>
		<path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.699-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
	</svg>
);

export function MinimalAuthPage() {
	return (
		<div className="relative md:h-screen md:overflow-hidden w-full bg-background">
			<Particles
				color="#666666"
				quantity={120}
				ease={20}
				className="absolute inset-0"
			/>
			<div
				aria-hidden
				className="absolute inset-0 isolate -z-10 contain-strict"
			>
				<div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,var(--color-foreground,var(--color-foreground))_0,hsla(0,0%,55%,.02)_50%,var(--color-foreground,var(--color-foreground))_80%)] opacity-5 absolute top-0 left-0 h-320 w-140 -translate-y-87.5 -rotate-45 rounded-full" />
				<div className="bg-[radial-gradient(50%_50%_at_50%_50%,var(--color-foreground,var(--color-foreground))_0,var(--color-foreground,var(--color-foreground))_80%,transparent_100%)] opacity-[0.04] absolute top-0 left-0 h-320 w-60 [translate:5%_-50%] -rotate-45 rounded-full" />
				<div className="bg-[radial-gradient(50%_50%_at_50%_50%,var(--color-foreground,var(--color-foreground))_0,var(--color-foreground,var(--color-foreground))_80%,transparent_100%)] opacity-[0.04] absolute top-0 left-0 h-320 w-60 -translate-y-87.5 -rotate-45 rounded-full" />
			</div>
			<div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 transition-all duration-700">
				<Button variant="ghost" className="absolute top-4 left-4" asChild>
					<Link href="/">
						<ChevronLeftIcon className="me-1 size-4" />
						Home
					</Link>
				</Button>

				<div className="mx-auto space-y-6 sm:w-sm">
					<div className="flex items-center gap-2">
						<Grid2x2PlusIcon className="size-6" />
						<p className="text-xl font-semibold uppercase tracking-widest">Valle</p>
					</div>
					<div className="flex flex-col space-y-2">
						<h1 className="font-heading text-3xl font-bold tracking-wide">
							Sign In <span className="italic font-medium">or</span> Join Now!
						</h1>
						<p className="text-muted-foreground text-base">
							Experience the premium hair studio.
						</p>
					</div>
					<div className="space-y-3">
						<Button type="button" size="lg" className="w-full h-12">
							<GoogleIcon className="me-2 size-4" />
							Continue with Google
						</Button>
						<Button type="button" size="lg" className="w-full h-12">
							<GithubIcon className="me-2 size-4" />
							Continue with GitHub
						</Button>
					</div>
					<p className="text-muted-foreground mt-8 text-sm">
						By clicking continue, you agree to our{' '}
						<a
							href="#"
							className="hover:text-primary underline underline-offset-4"
						>
							Terms of Service
						</a>{' '}
						and{' '}
						<a
							href="#"
							className="hover:text-primary underline underline-offset-4"
						>
							Privacy Policy
						</a>
						.
					</p>
				</div>
			</div>
		</div>
	);
}
