import React from 'react';
import LiveDashboard from '@/components/box-office/LiveDashboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Live Box Office Tracking | TFIverse',
    description: 'Real-time box office ticket tracking, advance sales, and hourly velocity for Telugu movies.',
};

export default function BoxOfficeLivePage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-red-500/30">
            {/* Cinematic Header Gradient */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-red-900/20 via-black to-black -z-10 blur-3xl pointer-events-none" />

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-2 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                        Live Box Office
                    </h1>
                    <p className="text-neutral-400 font-medium">Real-time BookMyShow & District tracking.</p>
                </div>

                <LiveDashboard />
            </div>
        </main>
    );
}
