
'use client';
import { Button } from "@/components/ui/button";
import { ArrowRight, Crown, Map, Search } from "lucide-react";
import Link from "next/link";
import { AnimatedBackground } from "@/components/ui/animated-background";

function Footer() {
  return (
    <footer className="text-center p-4 text-muted-foreground text-sm border-t border-white/10 relative z-10">
      <p>Made by Asiman</p>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-svh bg-background">
      <AnimatedBackground />
      <header className="p-4 flex justify-between items-center border-b border-white/10 relative z-10">
        <div className="flex items-center gap-2">
          <Crown className="w-8 h-8" style={{ color: '#172e63' }} />
          <h1 className="text-2xl font-bold text-foreground">StaffHub</h1>
        </div>
        <nav className="flex items-center gap-2">
           <Link href="/user-search" passHref>
             <Button variant="outline" className="group" style={{ borderColor: '#fbbf24' }}>
              <Search className="w-5 h-5 mr-2" />
              Búsqueda de usuarios
            </Button>
          </Link>
          <Link href="/conquest-map" passHref>
             <Button variant="outline" className="group" style={{ borderColor: '#fbbf24' }}>
              <Map className="w-5 h-5 mr-2" />
              Mapa de Conquista
            </Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center p-8 relative z-10">
        <div className="max-w-3xl">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-4 animate-fade-in-up" style={{ color: '#fbbf24' }}>
            Gestiones de staff
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in-up animation-delay-200">
            Prototipados para sistemas web enfocados al staff.
          </p>
          <Link href="/staff" passHref>
            <Button size="lg" className="group animate-fade-in-up animation-delay-400" style={{ backgroundColor: '#172e63' }}>
              Ir a la Sección de Staff
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
