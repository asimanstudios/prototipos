import { UserSearch } from "@/components/user-search/user-search";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { Crown, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UserSearchPage() {
  return (
    <div className="flex flex-col min-h-svh bg-background">
      <AnimatedBackground />
      <header className="p-4 flex justify-between items-center border-b border-white/10 relative z-10">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
          Volver
        </Link>
        <div className="flex items-center gap-2">
          <Crown className="w-8 h-8" style={{ color: '#172e63' }} />
          <h1 className="text-2xl font-bold text-foreground">StaffHub</h1>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        <h2 className="text-4xl font-bold tracking-tight mb-4" style={{ color: '#fbbf24' }}>Búsqueda de Usuarios</h2>
        <p className="text-muted-foreground mt-2 mb-8">Ingresa un Steam ID para buscar un usuario y ver su información.</p>
        <div className="w-full max-w-6xl mx-auto">
            <UserSearch />
        </div>
      </main>
    </div>
  );
}
