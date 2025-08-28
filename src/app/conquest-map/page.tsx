import { GalaxyMap } from "@/components/conquest-map/galaxy-map";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import Link from "next/link";

export default function ConquestMapPage() {
  return (
    <div className="flex flex-col min-h-svh bg-background">
      <AnimatedBackground />
      <header className="p-4 flex justify-between items-center border-b border-white/10 relative z-10">
        <Link href="/" className="flex items-center gap-2">
          <Crown className="w-8 h-8" style={{ color: '#172e63' }} />
          <h1 className="text-2xl font-bold text-foreground">StaffHub</h1>
        </Link>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        <h2 className="text-4xl font-bold tracking-tight mb-4" style={{ color: '#fbbf24' }}>Mapa de Conquista</h2>
        <p className="text-muted-foreground mt-2 mb-8">Haz clic en un planeta para cambiar su afiliación.</p>
        <div className="w-full h-[80vh] flex justify-center items-center">
            <GalaxyMap />
        </div>
      </main>
    </div>
  );
}
