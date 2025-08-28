import { StaffHeader } from "@/components/staff/staff-header";
import { ModsAPruebaGroups } from "@/components/staff/mods-a-prueba-groups";

export default function ModsAPruebaPage() {
    const breadcrumbs = [
        { href: "/staff", label: "Staff" },
        { href: "/staff/moderators", label: "Moderadores" },
        { href: "/staff/moderators/prueba", label: "Mods a Prueba" },
    ];

    return (
        <div className="flex flex-col h-screen bg-background">
            <StaffHeader title="Registro de Mods a Prueba" breadcrumbs={breadcrumbs} />
            <main className="flex-1 overflow-auto p-4 md:p-8">
                <ModsAPruebaGroups />
            </main>
        </div>
    );
}
