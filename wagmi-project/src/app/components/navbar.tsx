"use client"

import { useState } from "react"
import Link from "next/link"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { ChevronDown, Wallet } from "lucide-react"

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { address, isConnected } = useAccount()
    const { connectors, connect } = useConnect()
    const { disconnect } = useDisconnect()

    return (
        <nav className="bg-zinc-900/80 backdrop-blur-lg border-b border-zinc-800">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-emerald-400">
                    DEXchange
                </Link>
                <div className="hidden md:flex space-x-4 items-center">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="text-gray-200 hover:text-emerald-400">
                                    Actions
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-zinc-900 border border-zinc-800">
                                        <li className="row-span-3">
                                            <NavigationMenuLink asChild>
                                                <a
                                                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-emerald-600 to-teal-800 p-6 no-underline outline-none focus:shadow-md"
                                                    href="/"
                                                >
                                                    <div className="mb-2 mt-4 text-lg font-medium text-gray-100">DEXchange</div>
                                                    <p className="text-sm leading-tight text-gray-200">Your gateway to decentralized trading</p>
                                                </a>
                                            </NavigationMenuLink>
                                        </li>
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href="/mintToken"
                                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-zinc-800 hover:text-emerald-400"
                                                >
                                                    <div className="text-sm font-medium leading-none">Mint Tokens</div>
                                                    <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                                                        Create new tokens for trading on our platform
                                                    </p>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href="/createPool"
                                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-zinc-800 hover:text-emerald-400"
                                                >
                                                    <div className="text-sm font-medium leading-none">Create Pool</div>
                                                    <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                                                        Set up new liquidity pools for token pairs
                                                    </p>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href="/createToken"
                                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-zinc-800 hover:text-emerald-400"
                                                >
                                                    <div className="text-sm font-medium leading-none">Create Token</div>
                                                    <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                                                        Launch your own custom token on our DEX
                                                    </p>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="border-zinc-700 hover:border-emerald-500/50 text-gray-200 hover:text-emerald-400">
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
                                        className="w-full mb-2 bg-emerald-600 hover:bg-emerald-700"
                                    >
                                        {connector.name}
                                    </Button>
                                ))
                            )}
                        </PopoverContent>
                    </Popover>
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    className="md:hidden border-zinc-700 hover:border-emerald-500/50 text-gray-200 hover:text-emerald-400"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <ChevronDown className={`h-4 w-4 transition-transform ${isMenuOpen ? "rotate-180" : ""}`} />
                </Button>
            </div>
            {isMenuOpen && (
                <div className="md:hidden px-4 py-2 space-y-2 border-t border-zinc-800">
                    <Link href="/mintToken" className="block py-2 text-gray-200 hover:text-emerald-400">
                        Mint Tokens
                    </Link>
                    <Link href="/createPool" className="block py-2 text-gray-200 hover:text-emerald-400">
                        Create Pool
                    </Link>
                    <Link href="/createToken" className="block py-2 text-gray-200 hover:text-emerald-400">
                        Create Token
                    </Link>
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
                                        className="w-full mb-2 bg-emerald-600 hover:bg-emerald-700"
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