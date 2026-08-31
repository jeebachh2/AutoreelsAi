import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Sparkles,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Send,
  MessageCircle,
  Clock,
  Share2,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Music2,
  Ghost,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onNavigateToDashboard?: () => void;
  onNavigateToPricing?: () => void;
  onNavigateToPlatforms?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateToDashboard,
  onNavigateToPricing,
  onNavigateToPlatforms,
}) => {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const contactInfo = {
    email: 'jeebachhk69@gmail.com',
    phone: '9262987046',
    displayPhone: '+91 92629 87046',
    address: 'Spaze Plazo, Near Vatika Chowk, Sector 69, Gurgaon, Haryana, India',
    mapsUrl: 'https://maps.google.com/?q=Spaze+Palazo+Sector+69+Gurgaon',
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => {
      setCopiedItem(null);
    }, 2000);
  };

  return (
    <footer id="main-footer" className="border-t border-slate-800/80 bg-slate-950 text-slate-400 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Footer Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-16 relative z-10">
        
        {/* Top Contact Highlight Banner */}
        <div className="mb-12 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* Email Card */}
            <div className="flex items-start gap-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-indigo-500/40 transition-all">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Mail className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Direct Email</span>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="font-semibold text-sm text-white hover:text-indigo-400 transition-colors truncate block"
                >
                  {contactInfo.email}
                </a>
                <button
                  type="button"
                  onClick={() => copyToClipboard(contactInfo.email, 'email')}
                  className="mt-1 inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  {copiedItem === 'email' ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400">Email Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Phone Card */}
            <div className="flex items-start gap-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/40 transition-all">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Phone className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Phone & WhatsApp</span>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="font-semibold text-sm text-white hover:text-emerald-400 transition-colors truncate block"
                >
                  {contactInfo.displayPhone}
                </a>
                <div className="mt-1 flex items-center gap-3">
                  <a
                    href={`https://wa.me/91${contactInfo.phone}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-medium"
                  >
                    <MessageCircle className="h-3 w-3" />
                    <span>WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(contactInfo.phone, 'phone')}
                    className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-300 font-medium"
                  >
                    {copiedItem === 'phone' ? (
                      <span className="text-emerald-400">Copied!</span>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Office Address Card */}
            <div className="flex items-start gap-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-amber-500/40 transition-all">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Office Location</span>
                <p className="text-xs text-white leading-snug font-medium line-clamp-2">
                  Spaze Plazo, Near Vatika Chowk, Sector 69, Gurgaon
                </p>
                <a
                  href={contactInfo.mapsUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-1 inline-flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-medium"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Open in Maps</span>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* 4 Column Layout: Brand & Info, Quick Links, Integration Channels, Location Detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand & Overview */}
          <div className="space-y-4">
            <BrandLogo
              size="lg"
              showBadge={true}
              onClick={onNavigateToDashboard}
            />
            <p className="text-xs leading-relaxed text-slate-400">
              Autonomous AI agent system for high-converting 9:16 short-form video generation, automated audio ducking, and synchronized multi-platform publishing.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Official OAuth 2.0 Direct API Integrations</span>
            </div>
          </div>

          {/* Col 2: Navigation & Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Platform Navigation</h4>
            <ul className="space-y-2 text-xs">
              {onNavigateToDashboard && (
                <li>
                  <button
                    onClick={onNavigateToDashboard}
                    className="hover:text-indigo-400 transition-colors text-left"
                  >
                    Interactive SaaS Dashboard
                  </button>
                </li>
              )}
              {onNavigateToPlatforms && (
                <li>
                  <button
                    onClick={onNavigateToPlatforms}
                    className="hover:text-indigo-400 transition-colors text-left"
                  >
                    Social Media Integration Hub
                  </button>
                </li>
              )}
              {onNavigateToPricing && (
                <li>
                  <button
                    onClick={onNavigateToPricing}
                    className="hover:text-indigo-400 transition-colors text-left"
                  >
                    Pricing Plans & Credits ($5 Pro)
                  </button>
                </li>
              )}
              <li>
                <span className="text-slate-500">6-Agent Pipeline Architecture</span>
              </li>
              <li>
                <span className="text-slate-500">ElevenLabs Audio & Speech-to-Text</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Supported Channels */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Supported Platforms</h4>
              <span className="text-[10px] text-cyan-400 font-semibold bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.5 rounded">6 Channels</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              
              {/* Instagram Reels */}
              <button
                type="button"
                onClick={onNavigateToPlatforms}
                className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-pink-500/40 hover:bg-slate-900 transition-all text-left group"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-sm shadow-pink-500/20 group-hover:scale-105 transition-transform">
                  <Instagram className="h-3.5 w-3.5" />
                </div>
                <span className="text-slate-300 group-hover:text-white font-medium truncate">Instagram Reels</span>
              </button>

              {/* TikTok */}
              <button
                type="button"
                onClick={onNavigateToPlatforms}
                className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-rose-500/40 hover:bg-slate-900 transition-all text-left group"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-slate-900 via-rose-600 to-cyan-500 text-white shadow-sm border border-slate-700 group-hover:scale-105 transition-transform">
                  <Music2 className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-slate-300 group-hover:text-white font-medium truncate">TikTok</span>
              </button>

              {/* YouTube Shorts */}
              <button
                type="button"
                onClick={onNavigateToPlatforms}
                className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-red-500/40 hover:bg-slate-900 transition-all text-left group"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-red-600 to-red-700 text-white shadow-sm shadow-red-600/20 group-hover:scale-105 transition-transform">
                  <Youtube className="h-3.5 w-3.5" />
                </div>
                <span className="text-slate-300 group-hover:text-white font-medium truncate">YouTube Shorts</span>
              </button>

              {/* Facebook Reels */}
              <button
                type="button"
                onClick={onNavigateToPlatforms}
                className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/40 hover:bg-slate-900 transition-all text-left group"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-600/20 group-hover:scale-105 transition-transform">
                  <Facebook className="h-3.5 w-3.5" />
                </div>
                <span className="text-slate-300 group-hover:text-white font-medium truncate">Facebook Reels</span>
              </button>

              {/* X / Twitter */}
              <button
                type="button"
                onClick={onNavigateToPlatforms}
                className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-sky-500/40 hover:bg-slate-900 transition-all text-left group"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-slate-800 to-slate-950 text-white shadow-sm border border-slate-700 group-hover:scale-105 transition-transform">
                  <Twitter className="h-3.5 w-3.5 text-sky-400" />
                </div>
                <span className="text-slate-300 group-hover:text-white font-medium truncate">X / Twitter</span>
              </button>

              {/* Snapchat Spotlight */}
              <button
                type="button"
                onClick={onNavigateToPlatforms}
                className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-amber-400/40 hover:bg-slate-900 transition-all text-left group"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-yellow-400 to-amber-500 text-slate-950 shadow-sm shadow-amber-400/20 group-hover:scale-105 transition-transform">
                  <Ghost className="h-3.5 w-3.5 text-slate-950 fill-slate-950" />
                </div>
                <span className="text-slate-300 group-hover:text-white font-medium truncate">Snapchat</span>
              </button>

            </div>
          </div>

          {/* Col 4: Corporate & Office Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Corporate Contact</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="leading-snug text-slate-300">
                  Spaze Plazo, near Vatika Chowk, Sector 69, Gurgaon, Haryana
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <a href="mailto:jeebachhk69@gmail.com" className="text-slate-300 hover:text-indigo-400 transition-colors truncate">
                  jeebachhk69@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                <a href="tel:9262987046" className="text-slate-300 hover:text-emerald-400 transition-colors">
                  +91 9262987046
                </a>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>Support: 24/7 Automation & Inquiries</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AutoReel AI. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Security & Compliance</span>
            <span>•</span>
            <span className="text-indigo-400 font-medium">Gurgaon HQ (Sector 69)</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
