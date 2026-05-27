import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { arbitrumSepolia } from 'wagmi/chains'

function WrongNetworkBanner() {
  const { isConnected, chainId } = useAccount()
  const { switchChain } = useSwitchChain()
  const [switching, setSwitching] = useState(false)

  if (!isConnected || chainId === arbitrumSepolia.id) return null

  return (
    <div className="w-full bg-amber-50 border-b border-amber-200 px-5 sm:px-12 py-2.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-amber-800 flex items-center gap-2">
          <svg className="w-4 h-4 text-amber-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="12" y1="9" x2="12" y2="13" strokeLinecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round"/>
          </svg>
          Wrong network — please switch to <strong>Arbitrum Sepolia</strong>
        </p>
        <button disabled={switching} onClick={() => { setSwitching(true); switchChain({ chainId: arbitrumSepolia.id }); setTimeout(() => setSwitching(false), 3000) }}
          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-800 hover:bg-amber-900 text-white transition-colors disabled:opacity-60 shrink-0">
          {switching ? 'Switching…' : 'Switch Network'}
        </button>
      </div>
    </div>
  )
}

export default function Layout() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { pathname } = useLocation()

  const navLink = (to: string, label: string) => (
    <Link to={to} className={`text-sm font-medium transition-colors ${pathname === to ? 'text-[#64e3e5]' : 'text-[#5d6870] hover:text-[#011823]'}`}>{label}</Link>
  )

  return (
    <div className="min-h-screen bg-[#f8fafa]">
      <header className="px-5 sm:px-12 py-6 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold tracking-tight text-[#011823]">fhenixforms</Link>
          <nav className="hidden sm:flex items-center gap-6">
            {navLink('/dashboard', 'Dashboard')}
            {navLink('/create', 'Create')}
          </nav>
        </div>
        {isConnected ? (
          <button onClick={() => disconnect()} className="text-xs font-mono bg-[#e0e8e9] px-4 py-2 rounded-full text-[#5d6870] hover:bg-[#a6eeef] transition-colors">
            {address?.slice(0, 6)}…{address?.slice(-4)}
          </button>
        ) : (
          <button onClick={() => connect({ connector: injected() })} className="text-sm font-medium bg-[#64e3e5] text-[#011823] px-5 py-2.5 rounded-full hover:bg-[#a6eeef] transition-colors">
            Connect Wallet
          </button>
        )}
      </header>
      <WrongNetworkBanner />
      <main className="max-w-6xl mx-auto px-5 sm:px-12 py-8">
        <Outlet />
      </main>
    </div>
  )
}
