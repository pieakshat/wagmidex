"use client"

import { Navbar } from "./components/navbar"
import { Button } from "../components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-stone-900 to-neutral-900 text-gray-100">
      <Navbar />

      <main className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
          Welcome to DEXchange
        </h1>
        <p className="text-xl mb-12 text-center max-w-2xl mx-auto text-gray-300">
          Experience the future of decentralized trading with our cutting-edge platform. Swap, provide liquidity, and
          earn rewards with ease and security.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-zinc-800/50 backdrop-blur-lg rounded-lg p-6 border border-zinc-700 hover:border-emerald-500/50 transition-colors">
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">Mint Tokens</h2>
            <p className="mb-4 text-gray-300">Create and distribute your own custom tokens on our platform.</p>
            <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
              <Link href="/mintToken">Get Started</Link>
            </Button>
          </div>

          <div className="bg-zinc-800/50 backdrop-blur-lg rounded-lg p-6 border border-zinc-700 hover:border-emerald-500/50 transition-colors">
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">Create Pool</h2>
            <p className="mb-4 text-gray-300">Set up liquidity pools for various token pairs and earn fees.</p>
            <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
              <Link href="/createPool">Create Now</Link>
            </Button>
          </div>

          <div className="bg-zinc-800/50 backdrop-blur-lg rounded-lg p-6 border border-zinc-700 hover:border-emerald-500/50 transition-colors">
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">Create Token</h2>
            <p className="mb-4 text-gray-300">Launch your own token with customizable parameters and features.</p>
            <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
              <Link href="/createToken">Launch Token</Link>
            </Button>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-semibold mb-4 text-emerald-400">Ready to dive in?</h2>
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" asChild>
            <Link href="#" className="text-lg">
              Start Trading Now
            </Link>
          </Button>
        </div>
      </main>

      <footer className="bg-zinc-900/80 backdrop-blur-lg mt-16 py-8 border-t border-zinc-800">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2025 DEXchange. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}