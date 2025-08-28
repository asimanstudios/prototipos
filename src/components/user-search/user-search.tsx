
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, User, ShieldBan, Package, History, View } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';

type Sanction = {
    id: string;
    date: string;
    type: 'Warn' | 'Ban';
    reason: string;
    duration?: string;
    moderator: string;
};

type UserData = {
    steamId: string;
    username: string;
    avatarUrl: string;
    packages: string[];
    sanctions: Sanction[];
};

const firstNames = ["Asiman", "Kito", "Uripa", "Pedro", "Juan", "Maria", "Jose", "Ana", "Luis", "Laura", "Carlos", "Sofia", "Miguel", "Valeria", "Jorge", "Camila", "Fernando", "Isabella", "Ricardo", "Lucia", "Javier", "Elena", "Diego", "Paula", "Andres", "Martina", "Alejandro", "Daniela", "Manuel", "Gabriela", "Sergio", "Adriana", "David", "Catalina", "Oscar", "Valentina", "Victor", "Renata", "Raul", "Ximena", "Esteban", "Mariana", "Pablo", "Antonia", "Emilio", "Jimena", "Arturo", "Constanza", "Gustavo", "Florencia"];
const packages = ['VIP Ultimate', 'VIP Jedi 1', 'VIP Jedi 2', 'VIP Jedi 3', 'VIP Personajes 1', 'VIP Personajes 2', 'VIP Personajes 3', 'Mejora de movimiento', 'Inserción táctica', 'Clon+'];

const warnReasons = [
    '1.2 No hacer FailRP',
    '1.3 No romper CUT OOC/PTS ACTIVO',
    '1.5 No cometer MetaGaming [MG]',
    '1.6 No cometer PowerGaming [PG]',
    '1.7 No cometer DM',
    '1.8 No cometer Flood',
    '1.9 No cometer MUD',
    '1.10 No cometer AE',
    '1.14 No cometer Stick Abuse [SA]',
    '1.15 No está permitido el Prop Kill [PK]',
    '1.21 No cometer Command Abuse [CA]',
    '1.24 AFK Farm',
    '1.25 No cometer FearRP',
    '2.3 Uso de Personajes V.I.P. (RP)',
    '2.4 Seguimiento de Batallón en Misiones',
    '2.5 Órdenes Clon y Autoridad',
    '2.7 Prioridad Jedi: Paz y Acción',
    '2.8 Interferencia en Combate de Sable de Luz (Jedi)',
    '2.9 Combate Jedi vs. Sith',
    '2.10 Uso Prohibido de Comandos de Comunicación',
    '2.11 Saludo a Jedi',
    '2.12 Saludo a Rangos Superiores',
    '2.13 Posicionamiento de Jedi en Misión',
    '4.2 Manejo de Soldados y Estrategia',
    '4.3 Rol Secundario de la Armada',
    '5.3 Restricción de Habilidad Jedi',
    '5.4 Agente VIP y Especializaciones',
    '6.1 Uso de Gestos de Baile en Misión/Situación Seria',
    '7.1 Restricción de Armas en PVP',
    '8.7 Acceso de Civiles a Anaxes',
    '8.8 Manejo de Civiles en la Base de Anaxes',
    '8.16 Restricciones a Cazarrecompensas',
    '8.18 Prohibición de Cazarrecompensas en Entrenamientos',
];
const banDurations = ['3 días', '5 días', '1 semana', '1 mes', 'Permanente'];
const moderators = ['Asiman', 'Kito', 'Uripa', 'Pedro'];

const generateMockUsers = (count: number): UserData[] => {
    const users: UserData[] = [];
    for (let i = 1; i <= count; i++) {
        const username = firstNames[i % firstNames.length] + (i > firstNames.length ? Math.floor(i / firstNames.length) : '');
        const steamIdNumber = 708098479 + i;
        const user: UserData = {
            steamId: `STEAM_0:0:${steamIdNumber}`,
            username: username,
            avatarUrl: `https://picsum.photos/seed/${username}/128/128`,
            packages: Array.from({ length: Math.floor(Math.random() * 4) + 1 }, () => packages[Math.floor(Math.random() * packages.length)]),
            sanctions: [],
        };

        const warnCount = Math.floor(Math.random() * 6);
        for (let j = 0; j < warnCount; j++) {
            const year = 2023 + Math.floor(Math.random() * 2);
            const month = Math.floor(Math.random() * 12) + 1;
            const day = Math.floor(Math.random() * 28) + 1;
            const sanction: Sanction = {
                id: `s${i}-w${j}`,
                date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
                type: 'Warn',
                reason: warnReasons[Math.floor(Math.random() * warnReasons.length)],
                moderator: moderators[Math.floor(Math.random() * moderators.length)],
            };
            user.sanctions.push(sanction);
        }

        if (warnCount >= 3) {
            const year = 2024;
            const month = Math.floor(Math.random() * 6) + 6; // last half of 2024
            const day = Math.floor(Math.random() * 28) + 1;
            const banSanction: Sanction = {
                id: `s${i}-b1`,
                date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
                type: 'Ban',
                reason: 'Acumulación de sanciones',
                duration: banDurations[Math.floor(Math.random() * banDurations.length)],
                moderator: moderators[Math.floor(Math.random() * moderators.length)],
            };
            user.sanctions.push(banSanction);
        }
        
        user.sanctions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        users.push(user);
    }
    return users;
};

const MOCK_USER_DATA: UserData[] = generateMockUsers(50);


export function UserSearch() {
    const [steamId, setSteamId] = useState('');
    const [searchedUser, setSearchedUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const handleSearch = () => {
        setIsLoading(true);
        setError(null);
        setSearchedUser(null);

        setTimeout(() => {
            const foundUser = MOCK_USER_DATA.find(user => user.steamId === steamId);
            if (foundUser) {
                setSearchedUser(foundUser);
            } else {
                setError('No se encontró ningún usuario con ese Steam ID.');
            }
            setIsLoading(false);
        }, 1000);
    };

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <Card className="lg:col-span-1 bg-card/80 backdrop-blur-sm h-full hover:border-[#fbbf24] transition-all duration-300 hover:shadow-[0_0_20px_#fbbf24]">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search />
                            Buscar Usuario
                        </CardTitle>
                        <CardDescription>
                            Ingresa el Steam ID del usuario que deseas consultar.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex w-full items-center space-x-2">
                            <Input
                                type="text"
                                placeholder="Steam ID..."
                                value={steamId}
                                onChange={(e) => setSteamId(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <Button onClick={handleSearch} disabled={isLoading} style={{backgroundColor: '#172e63'}}>
                                {isLoading ? 'Buscando...' : 'Buscar'}
                            </Button>
                        </div>
                        <div>
                            <Label htmlFor="mock-user-select" className="text-sm text-muted-foreground">Usuarios de prueba</Label>
                            <Select onValueChange={(value) => setSteamId(value)}>
                                <SelectTrigger id="mock-user-select">
                                    <SelectValue placeholder="Selecciona un usuario de ejemplo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {MOCK_USER_DATA.map(user => (
                                        <SelectItem key={user.steamId} value={user.steamId}>{user.username} - ({user.steamId})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground mt-2">Nota: Los datos de los usuarios son ficticios y para fines de prototipado.</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="lg:col-span-2">
                    <Card className="bg-card/80 backdrop-blur-sm min-h-[300px] hover:border-[#fbbf24] transition-all duration-300 hover:shadow-[0_0_20px_#fbbf24]">
                        <CardContent className="p-6 h-full flex flex-col justify-center">
                            {!searchedUser && !isLoading && !error && (
                                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                                    <Search className="w-16 h-16 mb-4" />
                                    <p>Los resultados de la búsqueda aparecerán aquí.</p>
                                </div>
                            )}
                            {isLoading && (
                                <div className="flex justify-center items-center h-full">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                </div>
                            )}
                            {error && (
                                <div className="flex flex-col items-center justify-center h-full text-center text-destructive">
                                    <ShieldBan className="w-16 h-16 mb-4" />
                                    <p className="font-semibold">{error}</p>
                                </div>
                            )}
                            {searchedUser && (
                                <div className="flex items-center gap-6">
                                    <Image src={searchedUser.avatarUrl} alt="User Avatar" width={128} height={128} className="rounded-full border-4 border-primary" />
                                    <div className="space-y-2 flex-grow">
                                        <h3 className="text-3xl font-bold" style={{color: '#fbbf24'}}>{searchedUser.username}</h3>
                                        <p className="text-sm text-muted-foreground">{searchedUser.steamId}</p>
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {searchedUser.packages.slice(0, 4).map(pkg => (
                                                <Badge key={pkg} variant="secondary">{pkg}</Badge>
                                            ))}
                                            {searchedUser.packages.length > 4 && <Badge variant="outline">+{searchedUser.packages.length - 4} más</Badge>}
                                        </div>
                                    </div>
                                    <Button onClick={() => setIsDetailsOpen(true)} size="lg" style={{backgroundColor: '#172e63'}}>
                                        <View className="mr-2 h-5 w-5" />
                                        Ver Detalles
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
            {searchedUser && (
                <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                    <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-3">
                                <Image src={searchedUser.avatarUrl} alt="User Avatar" width={40} height={40} className="rounded-full" />
                                {searchedUser.username}
                            </DialogTitle>
                            <DialogDescription>{searchedUser.steamId}</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                             <div className="space-y-3">
                                <h4 className="font-semibold text-lg flex items-center gap-2">
                                    <Package />
                                    Paquetes Comprados
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {searchedUser.packages.map(pkg => (
                                        <Badge key={pkg} variant="secondary" className="text-base">{pkg}</Badge>
                                    ))}
                                    {searchedUser.packages.length === 0 && <p className="text-sm text-muted-foreground">Este usuario no tiene paquetes comprados.</p>}
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-3">
                                <h4 className="font-semibold text-lg flex items-center gap-2">
                                    <History />
                                    Historial de Sanciones
                                </h4>
                                <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                    {searchedUser.sanctions.map(sanction => (
                                        <li key={sanction.id} className="flex flex-col sm:flex-row justify-between p-2 bg-black/30 rounded-md">
                                            <div>
                                                <div className="font-medium flex items-center gap-2">
                                                    <Badge variant={sanction.type === 'Ban' ? 'destructive' : 'default'}>{sanction.type}</Badge>
                                                    {sanction.reason}
                                                    {sanction.duration && <span className="text-xs text-muted-foreground">({sanction.duration})</span>}
                                                </div>
                                                <p className="text-xs text-muted-foreground ml-2">Aplicada por: {sanction.moderator}</p>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1 sm:mt-0 flex-shrink-0">{sanction.date}</p>
                                        </li>
                                    ))}
                                    {searchedUser.sanctions.length === 0 && <p className="text-sm text-muted-foreground">Este usuario no tiene sanciones.</p>}
                                </ul>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={() => setIsDetailsOpen(false)}>Cerrar</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
