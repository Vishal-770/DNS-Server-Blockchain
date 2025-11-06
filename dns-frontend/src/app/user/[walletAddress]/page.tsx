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
import { Plus, ExternalLink, Globe, Sparkles, Shield } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";

const DomainsPage: React.FC = () => {
  const account = useActiveAccount();

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

  // ---------- useState instead of RHF ----------
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

  if (isPending)
    return (
      <LoadingPage
        title="Loading Your Domains"
        subtitle="Fetching your domain portfolio from blockchain..."
      />
    );
  if (error)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center p-8">
          <CardContent className="space-y-4">
            <div className="text-destructive text-lg font-semibold">
              Error Loading Domains
            </div>
            <p className="text-muted-foreground">{error.message}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );

  const domainNames = data?.[0] || [];
  const domainContracts = data?.[1] || [];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background mt-20">
      <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
        <PageHeader
          title="Your Domains"
          subtitle="Manage your decentralized domain portfolio"
          showBackButton
          backHref="/"
        >
          {/* Dialog for adding new domain */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Domain
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add a New Domain</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Create a fresh smart contract instance and secure it with a
                  management password. Pick something memorable but secret.
                </DialogDescription>
              </DialogHeader>

              <form
                className="grid gap-5 py-4"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="grid gap-2">
                  <Label htmlFor="domain">Domain name</Label>
                  <Input
                    id="domain"
                    placeholder="Enter domain name"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    aria-describedby="domain-hint"
                  />
                  <p id="domain-hint" className="text-xs text-muted-foreground">
                    Use lowercase letters, numbers, and hyphens only (e.g.
                    wizardlabs.xyz).
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Management password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-describedby="password-hint"
                  />
                  <p
                    id="password-hint"
                    className="text-xs text-muted-foreground"
                  >
                    Minimum 6 characters. Required each time you update DNS
                    records.
                  </p>
                </div>

                <DialogFooter className="pt-2">
                  <TransactionButton
                    disabled={!isFormValid}
                    className="w-full justify-center gap-2"
                    transaction={() =>
                      prepareContractCall({
                        contract,
                        method:
                          "function createDomain(string domainName, string password)",
                        params: [domain, password],
                      })
                    }
                    onClick={() => {
                      if (!isFormValid) {
                        toast.error(
                          "Add a valid domain and password before continuing"
                        );
                      }
                    }}
                    onTransactionSent={() =>
                      toast("Transaction submitted to network")
                    }
                    onTransactionConfirmed={() => {
                      toast.success("Domain deployed and ready to manage");
                      resetForm();
                      setIsDialogOpen(false);
                      refetch?.();
                    }}
                    onError={(err) =>
                      toast.error(err?.message ?? "Failed to add domain")
                    }
                  >
                    Create Domain
                  </TransactionButton>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </PageHeader>

        {domainNames.length === 0 ? (
          <div className="text-center py-20">
            <Card className="max-w-lg mx-auto border-dashed border-primary/40 bg-primary/5">
              <CardContent className="space-y-6 p-10">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold text-foreground">
                    Launch your first decentralized domain
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Deploy ownership on-chain in seconds. Your DNS records,
                    protected by smart contracts and secure password gating.
                  </p>
                </div>
                <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" /> Create your first domain
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-muted-foreground">
                Managing {domainNames.length} domain
                {domainNames.length !== 1 ? "s" : ""}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" />
                Password protected writes keep each domain safe.
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {domainNames.map((domain, index) => (
                <Card
                  key={domain}
                  className="relative overflow-hidden border border-border/70 bg-background/95 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary/60 to-primary/20" />
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Globe className="h-5 w-5 text-primary" />
                      <span className="truncate" title={domain}>
                        {domain}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Contract address
                      </p>
                      <p className="text-sm font-mono bg-muted/40 p-2 rounded-md break-all">
                        {domainContracts[index]}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <Link
                        href={`/domains/${domainContracts[index]}`}
                        className="w-full"
                      >
                        <Button variant="outline" className="w-full gap-2">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </Link>
                      <Link
                        href={`/domains/${domainContracts[index]}/manage`}
                        className="w-full"
                      >
                        <Button className="w-full">Manage</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DomainsPage;
