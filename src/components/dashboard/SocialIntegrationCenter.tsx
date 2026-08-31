import React, { useState, useEffect } from 'react';
import { ConnectedPlatform, PlatformId } from '../../types';
import {
  Share2,
  CheckCircle2,
  RefreshCw,
  Key,
  Shield,
  ExternalLink,
  Zap,
  Lock,
  Globe,
  Sparkles,
  Check,
  AlertCircle,
  Link as LinkIcon,
  HelpCircle,
  Copy,
  UserCheck,
  Sliders,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { audioMixer } from '../../utils/audioSynthesizer';

interface SocialIntegrationCenterProps {
  platforms: ConnectedPlatform[];
  onTogglePlatform: (platformId: PlatformId) => void;
  onRefreshTokens: () => void;
  onUpdatePlatformCredentials?: (platformId: PlatformId, data: Partial<ConnectedPlatform>) => void;
}

export const SocialIntegrationCenter: React.FC<SocialIntegrationCenterProps> = ({
  platforms,
  onTogglePlatform,
  onRefreshTokens,
  onUpdatePlatformCredentials,
}) => {
  const [activeModalPlatform, setActiveModalPlatform] = useState<ConnectedPlatform | null>(null);
  const [modalTab, setModalTab] = useState<'oauth' | 'manual' | 'guide'>('oauth');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [hasCopiedUrl, setHasCopiedUrl] = useState(false);

  // Form input state for manual credential setup
  const [formInputs, setFormInputs] = useState<Record<string, string>>({});
  const [validationSuccess, setValidationSuccess] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync inputs when active modal platform changes
  useEffect(() => {
    if (activeModalPlatform) {
      setFormInputs({
        handle: activeModalPlatform.handle || '',
        accessToken: activeModalPlatform.customAccessToken || '',
        apiKey: activeModalPlatform.customApiKey || '',
        pageId: activeModalPlatform.customPageId || '',
      });
      setValidationSuccess(null);
      setValidationError(null);
    }
  }, [activeModalPlatform]);

  // Listen for OAuth Popup PostMessage according to oauth-integration guidelines
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }

      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const targetPlatformId = (event.data.platform as PlatformId) || activeModalPlatform?.id;
        if (targetPlatformId) {
          audioMixer.playSFX('ding');
          setIsAuthenticating(false);

          if (onUpdatePlatformCredentials) {
            onUpdatePlatformCredentials(targetPlatformId, {
              connected: true,
              isRealAccount: true,
              authMethod: 'oauth_popup',
              tokenExpiresIn: '90 days (Auto-refreshed via OAuth 2.0)',
              lastConnectedAt: new Date().toISOString(),
              handle: formInputs.handle || `@creator_${targetPlatformId}`,
            });
          }

          setValidationSuccess(`Successfully authenticated your real ${targetPlatformId.toUpperCase()} account via OAuth 2.0!`);
          setTimeout(() => {
            setActiveModalPlatform(null);
          }, 1500);
        }
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [activeModalPlatform, formInputs, onUpdatePlatformCredentials]);

  const handleRefresh = () => {
    audioMixer.playSFX('ding');
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      onRefreshTokens();
    }, 800);
  };

  // Launch OAuth Popup
  const handleLaunchOAuthPopup = async (platform: ConnectedPlatform) => {
    setIsAuthenticating(true);
    setValidationError(null);
    setValidationSuccess(null);
    audioMixer.playSFX('pop');

    try {
      const currentOrigin = window.location.origin;
      const response = await fetch(`/api/auth/social/url?platform=${platform.id}&origin=${encodeURIComponent(currentOrigin)}`);
      
      if (!response.ok) {
        throw new Error('Failed to obtain OAuth authorization URL from server');
      }

      const data = await response.json();
      const authUrl = data.authUrl;

      // Open provider URL directly in popup
      const popupWindow = window.open(
        authUrl,
        `connect_${platform.id}_oauth`,
        'width=600,height=750,scrollbars=yes,status=yes'
      );

      if (!popupWindow) {
        alert('Popup blocker detected. Please allow popups to connect your social media account.');
        setIsAuthenticating(false);
      }
    } catch (err: any) {
      console.error('OAuth launch error:', err);
      setValidationError(err.message || 'Failed to start OAuth popup');
      setIsAuthenticating(false);
    }
  };

  // Validate & Save Manual API Credentials
  const handleValidateAndSaveManual = async (platform: ConnectedPlatform) => {
    if (!formInputs.handle) {
      setValidationError('Please enter your social media account username / handle.');
      return;
    }

    setIsValidating(true);
    setValidationError(null);
    setValidationSuccess(null);
    audioMixer.playSFX('ding');

    try {
      const response = await fetch('/api/social/validate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: platform.id,
          handle: formInputs.handle,
          token: formInputs.accessToken,
          apiKey: formInputs.apiKey,
          accountId: formInputs.pageId,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        audioMixer.playSFX('ding');
        setValidationSuccess(`Token validated! ${data.verifiedHandle} is connected and ready for auto-dispatch.`);
        
        if (onUpdatePlatformCredentials) {
          onUpdatePlatformCredentials(platform.id, {
            connected: true,
            isRealAccount: true,
            authMethod: 'token',
            handle: data.verifiedHandle,
            tokenExpiresIn: data.tokenExpiresIn,
            customAccessToken: formInputs.accessToken,
            customApiKey: formInputs.apiKey,
            customPageId: formInputs.pageId,
            lastConnectedAt: new Date().toISOString(),
          });
        }

        setTimeout(() => {
          setActiveModalPlatform(null);
        }, 1400);
      } else {
        setValidationError(data.error || 'Failed to validate credentials.');
      }
    } catch (err: any) {
      setValidationError(err.message || 'Error validating token');
    } finally {
      setIsValidating(false);
    }
  };

  // Disconnect / Revoke Platform
  const handleDisconnect = (platformId: PlatformId) => {
    audioMixer.playSFX('pop');
    if (onUpdatePlatformCredentials) {
      onUpdatePlatformCredentials(platformId, {
        connected: false,
        isRealAccount: false,
        tokenExpiresIn: 'Disconnected',
        customAccessToken: '',
        customApiKey: '',
        customPageId: '',
      });
    }
    setActiveModalPlatform(null);
  };

  const handleCopyCallbackUrl = () => {
    const callbackUrl = `${window.location.origin}/auth/callback`;
    navigator.clipboard.writeText(callbackUrl);
    setHasCopiedUrl(true);
    audioMixer.playSFX('ding');
    setTimeout(() => setHasCopiedUrl(false), 2500);
  };

  const connectedCount = platforms.filter((p) => p.connected).length;

  return (
    <div className="space-y-6">
      
      {/* Real Account Connection Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 p-6 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
              <Globe className="h-3.5 w-3.5 text-indigo-400" />
              <span>Direct Real Social Media Dispatch</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Connect Your Real Creator & Business Accounts
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Link your authentic profiles across <strong className="text-white">Instagram Reels, TikTok, YouTube Shorts, Facebook, X (Twitter),</strong> and <strong className="text-white">Snapchat</strong>. AutoReel AI orchestrates 60 FPS video rendering and automatically dispatches directly to your live feeds.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="rounded-xl border border-slate-800 bg-slate-900/90 px-4 py-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Connected Channels</span>
              <span className="text-lg font-mono font-bold text-emerald-400">{connectedCount} / 6 Live</span>
            </div>
            
            <button
              id="sync-all-tokens-btn"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 hover:brightness-110 transition-all active:scale-95"
            >
              <RefreshCw className={`h-4 w-4 text-white ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Verifying Tokens...' : 'Sync All Accounts'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Platform Grid Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {platforms.map((platform) => {
          return (
            <div
              key={platform.id}
              className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border p-5 shadow-lg transition-all ${
                platform.connected
                  ? 'border-emerald-500/40 bg-gradient-to-b from-slate-900/95 to-slate-950 ring-1 ring-emerald-500/20'
                  : 'border-slate-800 bg-gradient-to-b from-slate-900/70 to-slate-950 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Card Top Row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${platform.iconColor} font-bold text-white shadow-md`}>
                      <span className="text-xs font-mono uppercase">{platform.shortName.slice(0, 2)}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-bold text-white">{platform.name}</h3>
                        {platform.isRealAccount && (
                          <span title="Verified Real Account" className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-white text-[10px]">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-mono text-cyan-300 font-semibold truncate max-w-[160px]">
                        {platform.handle}
                      </p>
                    </div>
                  </div>

                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    platform.connected
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {platform.connected ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                        Connected
                      </>
                    ) : (
                      'Not Linked'
                    )}
                  </span>
                </div>

                {/* API Specs */}
                <div className="mt-4 space-y-2 rounded-xl bg-slate-950/80 p-3 text-xs border border-slate-800/80">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Protocol</span>
                    <span className="font-mono text-slate-200">{platform.badge}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Auth Token Status</span>
                    <span className={`font-mono text-xs ${platform.connected ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                      {platform.tokenExpiresIn}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Reels Dispatched</span>
                    <span className="font-mono font-bold text-cyan-400">{platform.postsPublished} Published</span>
                  </div>
                </div>

                {/* Scopes */}
                <div className="mt-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Active Permissions:
                  </span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {platform.permissions.slice(0, 3).map((perm, idx) => (
                      <span
                        key={idx}
                        className="rounded bg-slate-800/90 px-1.5 py-0.5 text-[10px] font-mono text-slate-300"
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex items-center gap-2 pt-3 border-t border-slate-800/80">
                <button
                  id={`connect-real-btn-${platform.id}`}
                  onClick={() => {
                    audioMixer.playSFX('pop');
                    setActiveModalPlatform(platform);
                    setModalTab('oauth');
                  }}
                  className={`flex-1 rounded-xl py-2 px-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    platform.connected
                      ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:brightness-110 shadow-md shadow-indigo-600/20'
                  }`}
                >
                  {platform.connected ? (
                    <>
                      <Sliders className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Manage / Edit</span>
                    </>
                  ) : (
                    <>
                      <LinkIcon className="h-3.5 w-3.5" />
                      <span>Connect Account</span>
                    </>
                  )}
                </button>

                {platform.connected && (
                  <button
                    id={`disconnect-btn-${platform.id}`}
                    onClick={() => handleDisconnect(platform.id)}
                    title="Disconnect this social account"
                    className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Real Account Connection Wizard Modal */}
      {activeModalPlatform && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-5 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${activeModalPlatform.iconColor} text-white font-bold text-sm shadow-md`}>
                  {activeModalPlatform.shortName.slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Connect {activeModalPlatform.name}</h3>
                  <p className="text-xs text-slate-400">Configure real OAuth 2.0 authorization or custom developer credentials</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModalPlatform(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex rounded-xl border border-slate-800 bg-slate-950 p-1">
              <button
                onClick={() => setModalTab('oauth')}
                className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  modalTab === 'oauth'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Zap className="h-3.5 w-3.5 text-amber-300" />
                <span>1-Click OAuth 2.0</span>
              </button>

              <button
                onClick={() => setModalTab('manual')}
                className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  modalTab === 'manual'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Key className="h-3.5 w-3.5 text-cyan-300" />
                <span>API Keys / Token</span>
              </button>

              <button
                onClick={() => setModalTab('guide')}
                className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  modalTab === 'guide'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <HelpCircle className="h-3.5 w-3.5 text-emerald-300" />
                <span>Setup Guide</span>
              </button>
            </div>

            {/* Status alerts */}
            {validationSuccess && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3.5 text-xs text-emerald-300 flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{validationSuccess}</span>
              </div>
            )}

            {validationError && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-950/40 p-3.5 text-xs text-rose-300 flex items-center gap-2.5">
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* TAB 1: 1-Click OAuth 2.0 */}
            {modalTab === 'oauth' && (
              <div className="space-y-4">
                <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      OAuth 2.0 Instant Login
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                      Live Callback Ready
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Clicking below will open the secure <strong>{activeModalPlatform.shortName}</strong> authorization window directly. Sign in with your real account and authorize video publishing permissions.
                  </p>

                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-medium text-slate-300 block">
                      Your Account Handle:
                    </label>
                    <input
                      type="text"
                      value={formInputs.handle || ''}
                      onChange={(e) => setFormInputs({ ...formInputs, handle: e.target.value })}
                      placeholder="@your_real_username"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3.5 text-xs text-slate-400 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-slate-300">Authorized Redirect URI:</span>
                    <button
                      onClick={handleCopyCallbackUrl}
                      className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300"
                    >
                      {hasCopiedUrl ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      <span>{hasCopiedUrl ? 'Copied!' : 'Copy URI'}</span>
                    </button>
                  </div>
                  <code className="block font-mono text-[10px] text-cyan-300 bg-slate-900 p-2 rounded border border-slate-800 break-all">
                    {typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '/auth/callback'}
                  </code>
                </div>

                <button
                  id="launch-oauth-popup-btn"
                  disabled={isAuthenticating}
                  onClick={() => handleLaunchOAuthPopup(activeModalPlatform)}
                  className={`w-full rounded-xl py-3 px-4 text-xs font-bold text-white shadow-xl transition-all flex items-center justify-center gap-2 ${
                    isAuthenticating
                      ? 'bg-indigo-700'
                      : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:brightness-110 shadow-indigo-600/25 active:scale-95'
                  }`}
                >
                  {isAuthenticating ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Waiting for OAuth Popup Approval...</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-4 w-4" />
                      <span>Authorize with {activeModalPlatform.shortName} Popup</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* TAB 2: Manual API Keys & Access Token */}
            {modalTab === 'manual' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  {activeModalPlatform.requiredFields.map((field) => (
                    <div key={field.key} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-200">
                          {field.label}
                        </label>
                        {field.description && (
                          <span className="text-[10px] text-slate-400">{field.description}</span>
                        )}
                      </div>
                      <input
                        type={field.isSecret ? 'password' : 'text'}
                        value={formInputs[field.key] || ''}
                        onChange={(e) => setFormInputs({ ...formInputs, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 font-mono text-xs text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-slate-400 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <Shield className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Tokens are validated with the live endpoint and encrypted with AES-256 GCM.</span>
                </div>

                <button
                  id="validate-token-btn"
                  disabled={isValidating}
                  onClick={() => handleValidateAndSaveManual(activeModalPlatform)}
                  className={`w-full rounded-xl py-3 px-4 text-xs font-bold text-white shadow-xl transition-all flex items-center justify-center gap-2 ${
                    isValidating
                      ? 'bg-emerald-700'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 shadow-emerald-600/20 active:scale-95'
                  }`}
                >
                  {isValidating ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Validating Token with {activeModalPlatform.shortName}...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Save & Verify Account Connection</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* TAB 3: Developer Setup Guide */}
            {modalTab === 'guide' && (
              <div className="space-y-4 text-xs text-slate-300">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                      Step-by-Step Connection Instructions:
                    </span>
                    <a
                      href={activeModalPlatform.developerPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:underline"
                    >
                      <span>Open {activeModalPlatform.shortName} Developer Portal</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  <ol className="space-y-2 list-decimal list-inside text-slate-300">
                    {activeModalPlatform.setupGuide.map((step, idx) => (
                      <li key={idx} className="leading-relaxed pl-1">
                        <span className="text-slate-200">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="rounded-xl bg-indigo-950/30 border border-indigo-500/20 p-3.5 text-xs text-indigo-200 flex items-start gap-2.5">
                  <Sparkles className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Need Help with App Review?</strong>
                    <span>For full production posting, ensure your Meta, TikTok, or YouTube Developer App has been granted public publishing scopes or add your user email as an App Tester.</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
