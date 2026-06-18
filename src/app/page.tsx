"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"

export default function LandingPage() {
  const { data: session } = useSession()

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden font-sans">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 h-full w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/uploads/background1.jfif")' }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* Light Sweep Animation */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="animate-sweep absolute -inset-full top-0 z-0 block h-[200%] w-[50%] -rotate-45 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />
      </div>

      {/* Top Navbar */}
      <header className="absolute top-0 z-10 flex w-full items-center justify-between p-6">
        <h1 className="text-4xl font-bold tracking-tighter text-white drop-shadow-md">
          Tintar
        </h1>
        <nav>
          {session ? (
            <Link href="/dashboard">
              <Button variant="secondary" className="font-semibold text-amber-900 hover:bg-amber-100 hover:text-amber-950">
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/auth/login">
              <Button variant="secondary" className="font-semibold text-foreground">
                Login
              </Button>
            </Link>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="z-10 flex w-full flex-col items-start px-6 md:px-24">
        <div className="max-w-2xl space-y-6">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg leading-tight">
            Menulis Kisah, <br />
            Meresapi Makna.
          </h2>
          <p className="text-lg md:text-xl text-white/90 drop-shadow-md font-medium leading-relaxed">
            Tintar adalah ruang personal untuk tenggelam dalam ribuan halaman eBook 
            dan kanvas kosong bagi mahakaryamu selanjutnya. Kelola koleksi buku dan 
            ciptakan dunia barumu di satu tempat yang estetis.
          </p>
          <div className="flex gap-4 pt-4">
            {session ? (
              <Link href="/dashboard">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white shadow-lg">
                  Lanjut Membaca
                </Button>
              </Link>
            ) : (
              <Link href="/auth/register">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white shadow-lg">
                  Mulai Perjalanan
                </Button>
              </Link>
            )}
          </div>
        </div>
      </main>
      
      {/* Add inline style for custom animation keyframes since Tailwind doesn't have sweep out of the box */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes sweep {
          0% {
            transform: translateX(-200%) rotate(-45deg);
          }
          50% {
            transform: translateX(300%) rotate(-45deg);
          }
          100% {
            transform: translateX(300%) rotate(-45deg);
          }
        }
        .animate-sweep {
          animation: sweep 8s ease-in-out infinite;
        }
      `}} />
    </div>
  )
}
