"use client";

import Sidebar from "@/components/sidebar";
import TopBar from "@/components/top-bar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-neo-white font-sans selection:bg-neo-yellow selection:text-neo-black overflow-x-hidden">
            {/* Sidebar is fixed on the left */}
            <Sidebar />

            {/* Content area pushed to the right on desktop */}
            <div className="flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 lg:pl-72">
                {/* Topbar sticky at the top of the content area */}
                <TopBar />

                {/* Main page content */}
                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
