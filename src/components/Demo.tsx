/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import frameSdk, { type FrameContext } from "@farcaster/frame-sdk";
import { usePrivy, useFarcasterSigner, type FarcasterWithMetadata } from '@privy-io/react-auth';
import { useLoginToFrame } from "@privy-io/react-auth/farcaster";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import { Button } from "~/components/ui/Button";
import { FullScreenLoader } from "~/components/ui/FullScreenLoader";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

export default function Demo({ title }: { title?: string } = { title: "Frames v2 Demo" }) {
  const { 
    login: privyLogin, 
    logout: privyLogout,
    authenticated: isPrivyAuthenticated,
    user,
    ready: isPrivyReady,
    createWallet,
    linkWallet
  } = usePrivy();
  
  const { client } = useSmartWallets();
  const { initLoginToFrame, loginToFrame } = useLoginToFrame();

  // Frame state
  const [context, setContext] = useState<FrameContext>();
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [isFrameContext, setIsFrameContext] = useState(false);

  // Web app state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [castInput, setCastInput] = useState('');
  const [isFrameContextOpen, setIsFrameContextOpen] = useState(false);
  const [isPrivyUserObjectOpen, setIsPrivyUserObjectOpen] = useState(false);

  // Farcaster setup
  const {
    getFarcasterSignerPublicKey,
    signFarcasterMessage,
    requestFarcasterSignerFromWarpcast,
  } = useFarcasterSigner();

  const farcasterAccount = user?.linkedAccounts?.find(
    (a) => a.type === 'farcaster'
  ) as FarcasterWithMetadata;
  
  const signerPublicKey = farcasterAccount?.signerPublicKey;

  // Initialize SDK and detect context
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        // Try to get Frame context
        const ctx = await frameSdk.context;
        if (mounted && ctx) {
          console.log('Frame context detected:', ctx);
          setContext(ctx);
          setIsFrameContext(true);
          frameSdk.actions.ready({});
        }
      } catch (error) {
        if (mounted) {
          console.log('Not in Frame context, using web app flow');
          setIsFrameContext(false);
        }
      } finally {
        if (mounted) {
          setIsSDKLoaded(true);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  // Create wallet if needed
  useEffect(() => {
    if (
      isPrivyAuthenticated &&
      isPrivyReady &&
      user &&
      user.linkedAccounts.filter(
        (account) =>
          account.type === "wallet" && account.walletClientType === "privy",
      ).length === 0
    ) {
      createWallet();
    }
  }, [isPrivyAuthenticated, isPrivyReady, user]);

  if (!isPrivyReady || !isSDKLoaded) {
    return <FullScreenLoader />;
  }

  // Show login screen for web app
  if (!isFrameContext && !isPrivyAuthenticated) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="text-center w-[300px]">
          <h1 className="text-2xl font-bold mb-8 tracking-tight">{title}</h1>
          <Button 
            onClick={privyLogin}
            className="w-full font-mono uppercase tracking-wider"
          >
            Sign in with Farcaster
          </Button>
        </div>
      </div>
    );
  }

  // Render Frame UI
  if (isFrameContext) {
    return (
      <div className="w-[360px] mx-auto py-4 px-2 flex flex-col justify-center h-full min-h-screen">
        <div className="flex-grow">
          <h1 className="text-2xl font-bold text-start mb-4">
            Farcaster Frame Demo
            <br />
            by Privy
          </h1>
          
          <div className="mb-4">
            <button
              onClick={() => setIsFrameContextOpen((prev) => !prev)}
              className="flex items-center gap-2 transition-colors"
            >
              <span className={`text-xs transform transition-transform ${isFrameContextOpen ? "rotate-90" : ""}`}>
                <ChevronRight size={15} />
              </span>
              <h2 className="font-2xl font-bold">Frame Context</h2>
            </button>

            {isFrameContextOpen && (
              <div className="p-4 mt-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-auto">
                  {JSON.stringify(context, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div className="mb-4">
            <button
              onClick={() => setIsPrivyUserObjectOpen((prev) => !prev)}
              className="flex items-center gap-2 transition-colors"
            >
              <span className={`text-xs transform transition-transform ${isPrivyUserObjectOpen ? "rotate-90" : ""}`}>
                <ChevronRight size={15} />
              </span>
              <h2 className="font-2xl font-bold">Privy User</h2>
            </button>

            {isPrivyUserObjectOpen && (
              <div className="p-4 mt-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Button onClick={linkWallet} variant="secondary">
              Connect external wallet
            </Button>
          </div>
        </div>
        
        <div className="w-full flex justify-center mb-4">
          <Image
            loading="eager"
            width={105}
            height={9}
            src="/wordmark.png"
            alt="Protected by Privy"
          />
        </div>
      </div>
    );
  }

  // Render Web App UI
  return (
    <div className="w-[300px] mx-auto py-4 px-2 relative">
      {isPrivyAuthenticated && user?.farcaster?.pfp && (
        <div className="absolute right-2 top-4">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="relative group"
          >
            <div className="w-12 h-12 border-2 border-black overflow-hidden transition-colors duration-200 bg-transparent group-hover:bg-white">
              <img 
                src={user.farcaster.pfp} 
                alt="Profile" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </button>

          {isDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)} 
              />
              
              <div className="absolute right-0 top-14 w-64 border-2 border-black bg-white z-20">
                <div className="p-4 space-y-3">
                  {user?.farcaster?.displayName && (
                    <div className="font-bold text-black">
                      {user.farcaster.displayName}
                    </div>
                  )}
                  <div className="font-mono text-sm text-black">
                    FID: {user?.farcaster?.fid || 'Unknown'}
                  </div>
                  <div className="font-mono text-xs text-neutral-600 break-all">
                    Signer: {signerPublicKey || 'None'}
                  </div>
                  <Button 
                    onClick={() => {
                      setIsDropdownOpen(false);
                      privyLogout();
                    }}
                    variant="secondary"
                    className="w-full font-mono uppercase tracking-wider"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <h1 className="text-2xl font-bold text-center mb-8 tracking-tight">{title}</h1>

      <div className="space-y-4">
        {!signerPublicKey && (
          <div className="text-center border-2 border-black p-4">
            <p className="text-sm mb-4 font-mono">Enable write access to post to Farcaster</p>
            <Button 
              onClick={requestFarcasterSignerFromWarpcast}
              className="w-full font-mono uppercase tracking-wider"
            >
              Request Write Access
            </Button>
          </div>
        )}

        {signerPublicKey && (
          <div className="space-y-4">
            <div className="border-2 border-black p-4">
              <textarea
                placeholder="What's on your mind?"
                className="w-full p-2 border-2 border-black font-mono text-sm resize-none focus:outline-none"
                rows={3}
                value={castInput}
                onChange={(e) => setCastInput(e.target.value)}
              />
              <Button 
                onClick={async () => {
                  if (!castInput.trim()) return;
                  try {
                    const response = await fetch('https://hub-api.neynar.com/v1/farcaster/cast', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'api_key': 'NEYNAR_PRIVY_DEMO'
                      },
                      body: JSON.stringify({
                        text: castInput,
                        signer_uuid: signerPublicKey
                      })
                    });
                    
                    if (!response.ok) {
                      throw new Error('Failed to cast');
                    }
                    
                    setCastInput('');
                  } catch (error) {
                    console.error('Error submitting cast:', error);
                  }
                }}
                disabled={!castInput.trim()}
                className="w-full mt-2 font-mono uppercase tracking-wider"
              >
                Cast
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
