import { StaffHeader } from "@/components/staff/staff-header";
import { EventMastersGroups } from "@/components/staff/event-masters-groups";

export default function EventMastersPage() {
    const breadcrumbs = [
        { href: "/staff", label: "Staff" },
        { href: "/staff/event-masters", label: "Event Masters" },
    ];

    return (
        <div className="flex flex-col h-screen">
            <StaffHeader title="Event Masters" breadcrumbs={breadcrumbs} />
            <main className="flex-1 overflow-auto p-8">
                <EventMastersGroups />
            </main>
        </div>
    );
}
