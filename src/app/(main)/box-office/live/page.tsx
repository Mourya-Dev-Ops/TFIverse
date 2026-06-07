import { getLiveBoxOfficeSummary } from '@/app/actions/boxoffice';
import DashboardClient from './DashboardClient';

export const metadata = {
    title: 'Live Box Office Dashboard | TFIverse',
    description: 'Real-time box office collection tracking and analytics for Indian cinema.',
};

export default async function LiveBoxOfficePage() {
    const data = await getLiveBoxOfficeSummary();

    if (!data) {
        return (
            <div className="min-h-[60vh] bg-black text-white flex flex-col items-center justify-center p-8">
                <h1 className="text-4xl font-bold mb-4">No Live Tracking Data</h1>
                <p className="text-gray-400">Our scraper is currently pulling the latest numbers. Please check back shortly.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pb-20">
            <DashboardClient initialData={data} />
        </div>
    );
}
