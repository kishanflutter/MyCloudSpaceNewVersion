import VoiceAgent from './components/VoiceAgent';
import { Cloud, Server, Shield, Globe } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white font-sans selection:bg-emerald-500/30">
      {/* Navigation */}
      <nav className="border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Cloud className="text-white w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight">MY CLOUD SPACE</span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-semibold">Shoot Space Digital</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <a href="#" className="hover:text-white transition-colors">Services</a>
            <a href="#" className="hover:text-white transition-colors">Data Centers</a>
            <a href="#" className="hover:text-white transition-colors">SLB Model</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>

          <button className="px-5 py-2.5 bg-white text-black rounded-full text-sm font-semibold hover:bg-emerald-400 transition-all">
            Client Login
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Globe className="w-3 h-3" />
            Revolution in Cloud Service
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
            The Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
              Cloud Infrastructure
            </span>
          </h1>
          
          <p className="text-lg text-white/60 max-w-lg leading-relaxed">
            Experience SHOOTSPACE, our advanced AI voice agent. Get instant answers about our Data Centre assets, SLB models, and monthly rental plans.
          </p>

          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <Server className="text-emerald-400 w-5 h-5" />
              <h3 className="font-semibold">Data Centers</h3>
              <p className="text-xs text-white/40">Physical facilities housing critical applications and data.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <Shield className="text-blue-400 w-5 h-5" />
              <h3 className="font-semibold">SLB Model</h3>
              <p className="text-xs text-white/40">Sale & Lease Back model for consistent rental income.</p>
            </div>
          </div>
        </div>

        {/* Right Content - Voice Agent */}
        <div className="flex justify-center lg:justify-end">
          <VoiceAgent />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-white/40 text-sm">
            © 2026 SHOOT SPACE DIGITAL PVT LTD. All rights reserved.
          </div>
          <div className="flex gap-8 text-sm text-white/40">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">GIFT City Office</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
