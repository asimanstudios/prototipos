import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import { UserRoleSwitcher } from './user-role-switcher';

type Breadcrumb = {
  href: string;
  label: string;
};

type StaffHeaderProps = {
  title: string;
  breadcrumbs: Breadcrumb[];
};

export function StaffHeader({ title, breadcrumbs }: StaffHeaderProps) {
  return (
    <header className="bg-card p-6 border-b sticky top-0 z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <nav className="flex items-center text-sm font-medium text-muted-foreground mb-2">
            <Link href="/" className="hover:text-primary transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center">
                <ChevronRight className="w-4 h-4 mx-1" />
                <Link href={crumb.href} className="hover:text-primary transition-colors">
                  {crumb.label}
                </Link>
              </span>
            ))}
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
        </div>
        <div className="w-full md:w-auto">
          <UserRoleSwitcher />
        </div>
      </div>
    </header>
  );
}
