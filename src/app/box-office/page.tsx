import { getLiveBoxOfficeSummary } from '../actions/boxoffice';
import DashboardClient from './DashboardClient';
import { notFound } from 'next/navigation';

export const metadata = {
    title: 'Live Box Office Dashboard | TFIverse',
    description: 'Real-time box office collection tracking and analytics for Indian cinema.',
};

export default async function BoxOfficePage() {
    const data = await getLiveBoxOfficeSummary();

    if (!data) {
        // Fallback UI if no tracking data is found
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
                <h1 className="text-4xl font-bold mb-4">No Live Tracking Data</h1>
                <p className="text-gray-400">Our scraper is currently pulling the latest numbers. Please check back shortly.</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white">
            <DashboardClient initialData={data} />
        </main>
    );
}
