import VoiceAgent from './components/VoiceAgent';
import { Cloud, Shield, Zap, Globe, Cpu, Lock, Database, Volume2 } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)]">
              <Cloud className="text-white w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight">MY CLOUD SPACE</span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-blue-400 font-semibold">Shoot Space Digital Pvt Ltd</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <a href="https://www.mycloudspace.live" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Website</a>
            <a href="#" className="hover:text-white transition-colors">Data Centre</a>
            <a href="#" className="hover:text-white transition-colors">SLB Model</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>

          <button className="px-5 py-2.5 bg-white text-black rounded-full text-sm font-semibold hover:bg-blue-400 transition-all">
            Contact Us
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3 h-3" />
            Revolution in Cloud Service
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
            Your Own <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
              Data Centre
            </span>
          </h1>
          
          <p className="text-lg text-white/60 max-w-lg leading-relaxed">
            Talk to SHOOTSPACE, our AI Voice Agent. Get instant information about our unique Sale & Lease Back (SLB) model and secure Data Centre assets.
          </p>

          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <Database className="text-blue-400 w-5 h-5" />
              <h3 className="font-semibold">Cloud Space</h3>
              <p className="text-xs text-white/40">Physical facilities housing critical applications and data.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <Zap className="text-indigo-400 w-5 h-5" />
              <h3 className="font-semibold">SLB Model</h3>
              <p className="text-xs text-white/40">Unique low-cost option to buy and rent out Data Centre assets.</p>
            </div>
          </div>
        </div>

        {/* Right Content - Voice Agent */}
        <div className="flex justify-center lg:justify-end w-full">
          <VoiceAgent />
        </div>
      </main>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Lock className="text-blue-400 w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold">Asset Ownership</h3>
            <p className="text-white/60 leading-relaxed">You are the owner of your Data Centre assets; our marketing affiliates take them on rent from you.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
              <Volume2 className="text-indigo-400 w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold">Monthly Rental</h3>
            <p className="text-white/60 leading-relaxed">Earn fixed monthly rental income on your assets with our long-term lease agreements.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <Shield className="text-purple-400 w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold">99.99% Uptime</h3>
            <p className="text-white/60 leading-relaxed">Our Service Level Agreement guarantees maximum uptime for your critical infrastructure.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-40">
            <Cloud className="w-5 h-5" />
            <span className="text-sm font-bold tracking-tight uppercase">Shoot Space Digital Pvt Ltd</span>
          </div>
          <div className="text-white/40 text-sm">
            © 2026 Shoot Space Digital Pvt Ltd. All rights reserved.
          </div>
          <div className="flex gap-8 text-sm text-white/40">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="https://www.mycloudspace.live" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Official Website</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

