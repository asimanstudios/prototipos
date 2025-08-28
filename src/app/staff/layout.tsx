import { UserRoleProvider } from '@/context/UserRoleContext';

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserRoleProvider>
      <div className="min-h-screen bg-background text-foreground">
        {children}
      </div>
    </UserRoleProvider>
  );
}
