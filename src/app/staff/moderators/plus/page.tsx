import { StaffHeader } from "@/components/staff/staff-header";
import { ModsPlusGroups } from "@/components/staff/mods-plus-groups";

export default function ModsPlusPage() {
    const breadcrumbs = [
        { href: "/staff", label: "Staff" },
        { href: "/staff/moderators", label: "Moderadores" },
        { href: "/staff/moderators/plus", label: "Mods Plus" },
    ];

    return (
        <div className="flex flex-col h-screen">
            <StaffHeader title="Registro de Moderadores Plus" breadcrumbs={breadcrumbs} />
            <main className="flex-1 overflow-auto p-4 md:p-8">
                <ModsPlusGroups />
            </main>
        </div>
    );
}
