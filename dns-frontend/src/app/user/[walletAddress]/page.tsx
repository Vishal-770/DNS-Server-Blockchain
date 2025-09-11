"use client";

import React, { useState } from "react";
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
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { LoadingPage } from "@/components/ui/loading";
import { Plus, ExternalLink, Globe } from "lucide-react";

const DomainsPage: React.FC = () => {
  const account = useActiveAccount();

  const contract = getContract({
    address: contractAddress as string,
    chain: sepolia,
    client,
  });

  const { data, isPending, error } = useReadContract({
    contract,
    method:
      "function getDomainsByUser(address user) view returns (string[] domainNames, address[] domainContracts)",
    params: [account?.address as string],
  });

  // ---------- useState instead of RHF ----------
  const [domain, setDomain] = useState("");
  const [password, setPassword] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    <div className="min-h-screen bg-background mt-20">
      <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Your Domains
            </h1>
            <p className="text-muted-foreground">
              Manage your decentralized domain portfolio
            </p>
          </div>

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
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add a New Domain</DialogTitle>
              </DialogHeader>

              <form
                className="grid gap-4 py-4"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="grid gap-1">
                  <Label htmlFor="domain">Domain</Label>
                  <Input
                    id="domain"
                    placeholder="Enter domain name"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                  />
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <DialogFooter>
                  <TransactionButton
                    transaction={() =>
                      prepareContractCall({
                        contract,
                        method:
                          "function createDomain(string domainName, string password)",
                        params: [domain, password],
                      })
                    }
                    onTransactionConfirmed={() => {
                      toast.success("Domain Added");
                      setIsDialogOpen(false); // close dialog after success
                    }}
                    onError={() => toast.error("Failed to add domain")}
                  >
                    Create Domain
                  </TransactionButton>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {domainNames.length === 0 ? (
          <div className="text-center py-20">
            <Card className="max-w-md mx-auto p-8 border-dashed">
              <CardContent className="space-y-4">
                <Globe className="h-16 w-16 text-muted-foreground mx-auto" />
                <h3 className="text-xl font-semibold text-foreground">
                  No Domains Found
                </h3>
                <p className="text-muted-foreground">
                  You haven&apos;t created any domains yet. Start by adding your
                  first domain!
                </p>
                <Button onClick={() => setIsDialogOpen(true)} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Domain
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-sm text-muted-foreground">
              Found {domainNames.length} domain
              {domainNames.length !== 1 ? "s" : ""}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {domainNames.map((domain, index) => (
                <Card
                  key={domain}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-primary" />
                      {domain}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">
                        Contract Address:
                      </p>
                      <p className="text-sm font-mono bg-muted/50 p-2 rounded break-all">
                        {domainContracts[index]}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/domains/${domainContracts[index]}`}
                        className="flex-1"
                      >
                        <Button variant="outline" className="w-full">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </Link>
                      <Link
                        href={`/domains/${domainContracts[index]}/manage`}
                        className="flex-1"
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
