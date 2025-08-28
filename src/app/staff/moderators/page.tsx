import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { User, UserPlus, ArrowRight, Crown, ChevronLeft } from "lucide-react";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { Button } from "@/components/ui/button";

export default function ModeratorsPage() {
  return (
    <div className="flex flex-col min-h-svh">
      <AnimatedBackground />
      <header className="p-4 flex justify-between items-center border-b relative z-10">
        <Link href="/staff" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <ChevronLeft className="w-6 h-6" />
          Volver
        </Link>
        <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
          <Crown className="w-8 h-8" style={{ color: '#172e63' }} />
          <h1 className="text-2xl font-bold hidden sm:block">StaffHub</h1>
        </Link>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight" style={{ color: '#fbbf24' }}>Equipo de Moderación</h2>
          <p className="text-muted-foreground mt-2">Selecciona el grupo de moderadores que quieres administrar.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
            <Card className="hover:border-[#fbbf24] transition-all duration-300 hover:shadow-[0_0_20px_#fbbf24] hover:-translate-y-2 h-full bg-card/80 backdrop-blur-sm group">
              <CardHeader className="items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <User className="w-12 h-12 text-foreground" />
                </div>
                <CardTitle className="text-2xl">Mods a Prueba</CardTitle>
                <CardDescription>Administra los registros de los moderadores en su período de prueba.</CardDescription>
              </CardHeader>
               <CardContent className="text-center">
                  <Button asChild className="w-full" style={{ backgroundColor: '#172e63' }}>
                    <Link href="/staff/moderators/prueba">
                      Ver registros <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
              </CardContent>
            </Card>
            <Card className="hover:border-[#fbbf24] transition-all duration-300 hover:shadow-[0_0_20px_#fbbf24] hover:-translate-y-2 h-full bg-card/80 backdrop-blur-sm group">
              <CardHeader className="items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <UserPlus className="w-12 h-12 text-foreground" />
                </div>
                <CardTitle className="text-2xl">Mods Plus</CardTitle>
                <CardDescription>Gestiona a los moderadores establecidos, Seniors y de Élite del equipo.</CardDescription>
              </CardHeader>
               <CardContent className="text-center">
                  <Button asChild className="w-full" style={{ backgroundColor: '#172e63' }}>
                    <Link href="/staff/moderators/plus">
                      Ver registros <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
              </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
