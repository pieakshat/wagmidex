"use client"

import { useState } from "react"
import Link from "next/link"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Wallet } from "lucide-react"

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { address, isConnected } = useAccount()
    const { connectors, connect } = useConnect()
    const { disconnect } = useDisconnect()

    const navLinks = [
        { href: "/swap", label: "Swap" },
        { href: "/mintToken", label: "Mint Tokens" },
        { href: "/createPool", label: "Create Pool" },
        { href: "/createToken", label: "Create Token" },
    ]

    return (
        <nav className="bg-zinc-900/80 backdrop-blur-lg border-b border-zinc-800">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-emerald-400">
                    DEXchange
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                    {/* Navigation Links */}
                    <div className="flex space-x-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-gray-200 hover:text-emerald-400 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Wallet Connection */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="border-zinc-700 hover:border-emerald-500/50 text-gray-500 hover:text-emerald-400">
                                {isConnected ? (
                                    <span>
                                        {address?.slice(0, 6)}...{address?.slice(-4)}
                                    </span>
                                ) : (
                                    <>
                                        Connect Wallet
                                        <Wallet className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 bg-zinc-900 border border-zinc-800">
                            {isConnected ? (
                                <Button onClick={() => disconnect()} className="w-full bg-emerald-600 hover:bg-emerald-700">
                                    Disconnect
                                </Button>
                            ) : (
                                connectors.map((connector) => (
                                    <Button
                                        key={connector.id}
                                        onClick={() => connect({ connector })}
                                        className="w-full mb-2 last:mb-0 bg-emerald-600 hover:bg-emerald-700"
                                    >
                                        {connector.name}
                                    </Button>
                                ))
                            )}
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Mobile Menu Button */}
                <Button
                    variant="outline"
                    size="icon"
                    className="md:hidden border-zinc-700 hover:border-emerald-500/50 text-gray-200 hover:text-emerald-400"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        {isMenuOpen ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        )}
                    </svg>
                </Button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden px-4 py-2 space-y-2 border-t border-zinc-800">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="block py-2 text-gray-200 hover:text-emerald-400"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full border-zinc-700 hover:border-emerald-500/50 text-gray-200 hover:text-emerald-400">
                                {isConnected ? (
                                    <span>
                                        {address?.slice(0, 6)}...{address?.slice(-4)}
                                    </span>
                                ) : (
                                    <>
                                        Connect Wallet
                                        <Wallet className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 bg-zinc-900 border border-zinc-800">
                            {isConnected ? (
                                <Button onClick={() => disconnect()} className="w-full bg-emerald-600 hover:bg-emerald-700">
                                    Disconnect
                                </Button>
                            ) : (
                                connectors.map((connector) => (
                                    <Button
                                        key={connector.id}
                                        onClick={() => connect({ connector })}
                                        className="w-full mb-2 last:mb-0 bg-emerald-600 hover:bg-emerald-700"
                                    >
                                        {connector.name}
                                    </Button>
                                ))
                            )}
                        </PopoverContent>
                    </Popover>
                </div>
            )}
        </nav>
    )
}