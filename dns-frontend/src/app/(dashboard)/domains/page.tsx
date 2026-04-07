"use client";

import React, { useMemo, useState } from "react";
import { getContract, prepareContractCall } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import {
  TransactionButton,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import client from "@/app/client";
import { contractAddress } from "@/constants/contract";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { LoadingPage } from "@/components/ui/loading";
import { Plus, ExternalLink, Globe, Search, ArrowRight, ShieldCheck, Activity, Database } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function UnifiedDomainsHub() {
  const account = useActiveAccount();
  const router = useRouter();

  // Blockchain Sync
  const contract = getContract({
    address: contractAddress as string,
    chain: sepolia,
    client,
  });

  const { data, isPending, error, refetch } = useReadContract({
    contract,
    method:
      "function getDomainsByUser(address user) view returns (string[] domainNames, address[] domainContracts)",
    params: [account?.address as string],
  });

  // State
  const [domain, setDomain] = useState("");
  const [password, setPassword] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isFormValid = useMemo(
    () => domain.trim().length > 2 && password.trim().length >= 6,
    [domain, password]
  );

  const resetForm = () => {
    setDomain("");
    setPassword("");
  };

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 animate-fade-in text-center">
        <h2 className="text-2xl font-bold tracking-tight">Connect Wallet</h2>
        <p className="text-muted-foreground text-sm max-w-sm">
          Please connect your wallet to manage your domains.
        </p>
      </div>
    );
  }

  if (isPending)
    return (
      <LoadingPage
        title="Loading Domains"
        subtitle="Fetching your portfolio..."
      />
    );

  const domainNames = data?.[0] || [];
  const domainContracts = data?.[1] || [];

  return (
    <div className="w-full space-y-8 animate-fade-in pb-20">
      <div className="flex items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Domains</h1>
          <p className="text-muted-foreground text-sm">
            {domainNames.length} domain{domainNames.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl h-10 px-6 font-semibold">
              <Plus className="mr-2 h-4 w-4" /> Add Domain
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Domain</DialogTitle>
            </DialogHeader>

            <form className="grid gap-4 py-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-1.5">
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  placeholder="domain.xyz"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="rounded-xl h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl h-10"
                />
              </div>

              <DialogFooter className="pt-2">
                <TransactionButton
                  disabled={!isFormValid}
                  className="w-full h-10 rounded-xl"
                  transaction={() =>
                    prepareContractCall({
                      contract,
                      method: "function createDomain(string domainName, string password)",
                      params: [domain, password],
                    })
                  }
                  onTransactionConfirmed={() => {
                    toast.success("Domain added");
                    resetForm();
                    setIsDialogOpen(false);
                    refetch?.();
                  }}
                  onError={(err) => toast.error(err?.message ?? "Error")}
                >
                  Create
                </TransactionButton>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {domainNames.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border rounded-2xl bg-secondary/5">
           <p className="text-muted-foreground text-sm mb-4">No domains in this wallet.</p>
           <Button onClick={() => setIsDialogOpen(true)} variant="outline" className="rounded-xl">
             Add First Domain
           </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {domainNames.map((name, index) => (
            <Card
              key={name}
              className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/30"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-bold truncate tracking-tight">{name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Contract</p>
                  <p className="text-xs font-mono bg-secondary/40 p-2 rounded-lg truncate border border-border/30">
                    {domainContracts[index]}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Link href={`/domains/${domainContracts[index]}`}>
                    <Button variant="outline" className="w-full rounded-xl gap-2 h-9 text-xs">
                      <ExternalLink className="h-3.5 w-3.5" /> View
                    </Button>
                  </Link>
                  <Link href={`/domains/${domainContracts[index]}/manage`}>
                    <Button className="w-full rounded-xl gap-2 h-9 text-xs">
                      Manage <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
