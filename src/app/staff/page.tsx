import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Shield, Swords, ArrowRight, Crown } from "lucide-react";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { Button } from "@/components/ui/button";

export default function StaffPage() {
  return (
    <div className="flex flex-col min-h-svh">
      <AnimatedBackground />
       <header className="p-4 flex justify-between items-center border-b relative z-10">
        <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
          <Crown className="w-8 h-8" style={{ color: '#172e63' }} />
          <h1 className="text-2xl font-bold">StaffHub</h1>
        </Link>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight" style={{ color: '#fbbf24' }}>Registro de Staffs</h2>
            <p className="text-muted-foreground mt-2">Elige la rama del staff que deseas gestionar.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
            <Card className="hover:border-[#fbbf24] transition-all duration-300 hover:shadow-[0_0_20px_#fbbf24] hover:-translate-y-2 bg-card/80 backdrop-blur-sm group">
                <CardHeader className="items-center text-center">
                    <div className="p-4 bg-primary/10 rounded-full mb-4">
                        <Shield className="w-12 h-12 text-foreground" style={{ color: '#fbbf24' }}/>
                    </div>
                    <CardTitle className="text-2xl">Moderadores</CardTitle>
                    <CardDescription>Gestiona el equipo de moderación, desde aspirantes hasta miembros de élite.</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <Button asChild className="w-full" style={{ backgroundColor: '#172e63' }}>
                      <Link href="/staff/moderators">
                        Ir a Moderadores <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                </CardContent>
            </Card>
            <Card className="hover:border-[#fbbf24] transition-all duration-300 hover:shadow-[0_0_20px_#fbbf24] hover:-translate-y-2 bg-card/80 backdrop-blur-sm group">
                <CardHeader className="items-center text-center">
                    <div className="p-4 bg-primary/10 rounded-full mb-4">
                        <Swords className="w-12 h-12 text-foreground" style={{ color: '#fbbf24' }}/>
                    </div>
                    <CardTitle className="text-2xl">Event Masters</CardTitle>
                    <CardDescription>Organiza y supervisa al equipo de maestros de eventos y sus actividades.</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                   <Button asChild className="w-full" style={{ backgroundColor: '#172e63' }}>
                      <Link href="/staff/event-masters">
                        Ir a Event Masters <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
