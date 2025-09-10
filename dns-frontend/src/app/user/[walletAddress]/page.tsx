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
import { ScrollArea } from "@/components/ui/scroll-area";
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
    return <div className="text-center mt-10">Loading your domains...</div>;
  if (error)
    return (
      <div className="text-center mt-10 text-destructive">
        Error: {error.message}
      </div>
    );

  const domainNames = data?.[0] || [];
  const domainContracts = data?.[1] || [];

  return (
    <div className="max-w-6xl mx-auto mt-22 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Domains</h1>

        {/* Dialog for adding new domain */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              Add a New Domain
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
        <div className="text-center text-muted-foreground">
          No domains found for your account.
        </div>
      ) : (
        <ScrollArea className="h-[70vh] pr-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {domainNames.map((domain, index) => (
              <Card key={domain}>
                <CardHeader>
                  <CardTitle>{domain}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground break-all">
                    Contract: {domainContracts[index]}
                  </p>
                  <div className="mt-4 flex justify-end">
                    <Link href={`/domains/${domainContracts[index]}`}>
                      <Button>Manage</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default DomainsPage;
