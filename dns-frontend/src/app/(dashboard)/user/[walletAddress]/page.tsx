"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useActiveAccount } from "thirdweb/react";
import { LoadingPage } from "@/components/ui/loading";

export default function UserProfileRedirect() {
  const router = useRouter();
  const { walletAddress } = useParams();
  const account = useActiveAccount();

  useEffect(() => {
    // If viewing own profile, redirect to the unified Domains Hub
    if (account?.address && walletAddress && account.address.toLowerCase() === (walletAddress as string).toLowerCase()) {
      router.replace("/domains");
    }
  }, [account, walletAddress, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <LoadingPage 
        title="Redirecting to Portfolio"
        subtitle="Optimizing your decentralized management experience..."
      />
      <p className="text-xs text-muted-foreground animate-pulse">
        Directing you to the unified Domains Hub.
      </p>
    </div>
  );
}
