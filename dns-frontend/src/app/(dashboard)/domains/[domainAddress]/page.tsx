"use client";

import client from "@/app/client";
import { useParams } from "next/navigation";
import React, { useMemo } from "react";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Settings,
  Globe,
  Mail,
  Database,
  Server,
  FileText,
  Copy,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LoadingCard, LoadingSkeleton } from "@/components/ui/loading";
import { PageHeader } from "@/components/ui/page-header";
import { toast } from "sonner";

const DomainPage: React.FC = () => {
  const { domainAddress } = useParams();
  const resolvedDomain = domainAddress as string;

  const contract = getContract({
    client,
    address: resolvedDomain,
    chain: sepolia,
  });

  const { data: domainNameData, isPending: domainNamePending } =
    useReadContract({
      contract,
      method: "function domainName() view returns (string)",
      params: [],
    });

  const domainLabel =
    typeof domainNameData === "string" && domainNameData.length > 0
      ? domainNameData
      : resolvedDomain;

  // Fetch DNS records
  const { data: ARecord, isPending: aPending } = useReadContract({
    contract,
    method: "function getRecord(string recordType) view returns (string[])",
    params: ["A"],
  });

  const { data: NSRecord, isPending: nsPending } = useReadContract({
    contract,
    method: "function getRecord(string recordType) view returns (string[])",
    params: ["NS"],
  });

  const { data: TXTRecord, isPending: txtPending } = useReadContract({
    contract,
    method: "function getRecord(string recordType) view returns (string[])",
    params: ["TXT"],
  });

  const { data: AAAARecord, isPending: aaaaPending } = useReadContract({
    contract,
    method: "function getRecord(string recordType) view returns (string[])",
    params: ["AAAA"],
  });

  const { data: CNAMERecord, isPending: cnamePending } = useReadContract({
    contract,
    method: "function getRecord(string recordType) view returns (string[])",
    params: ["CNAME"],
  });

  const { data: MXRecord, isPending: mxPending } = useReadContract({
    contract,
    method: "function getMX() view returns ((uint256 priority, string value)[])",
    params: [],
  });

  const { data: SRVRecord, isPending: srvPending } = useReadContract({
    contract,
    method: "function getSRV() view returns ((uint256 priority, uint256 weight, uint256 port, string target)[])",
    params: [],
  });

  const { data: subdomains, isPending: subdomainPending } = useReadContract({
    contract,
    method: "function listSubdomains() view returns (string[])",
    params: [],
  });

  const subdomainList = useMemo(
    () => (Array.isArray(subdomains) ? (subdomains as string[]) : []),
    [subdomains]
  );

  const hasSubdomains = subdomainList.length > 0;

  const isLoading =
    aPending ||
    nsPending ||
    txtPending ||
    aaaaPending ||
    cnamePending ||
    mxPending ||
    srvPending ||
    subdomainPending ||
    domainNamePending;

  if (isLoading) {
    return (
      <div className="w-full py-6 animate-fade-in">
        <PageHeader
          title="Domain Records"
          subtitle={
            <span className="flex flex-col">
              <span>DNS records for: <span className="font-semibold text-primary">{domainLabel}</span></span>
              <span className="text-xs text-muted-foreground font-mono truncate">{resolvedDomain}</span>
            </span>
          }
          showBackButton
          backHref="/domains"
        >
          <LoadingSkeleton className="h-10 w-40" />
        </PageHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  const recordDefinitions = [
    { type: "A", title: "A", description: "IPv4 Address", Icon: Globe, data: (ARecord as string[]) ?? [] },
    { type: "AAAA", title: "AAAA", description: "IPv6 Address", Icon: Globe, data: (AAAARecord as string[]) ?? [] },
    { type: "CNAME", title: "CNAME", description: "Alias", Icon: Globe, data: (CNAMERecord as string[]) ?? [] },
    { type: "TXT", title: "TXT", description: "Text Metadata", Icon: FileText, data: (TXTRecord as string[]) ?? [] },
    { type: "NS", title: "NS", description: "Name Servers", Icon: Server, data: (NSRecord as string[]) ?? [] },
    { 
      type: "MX", title: "MX", description: "Mail Exchange", Icon: Mail, 
      data: (MXRecord as readonly { priority: bigint; value: string }[])?.map(r => `${r.priority.toString()} ${r.value}`) ?? [] 
    },
    { 
      type: "SRV", title: "SRV", description: "Service Discovery", Icon: Database, 
      data: (SRVRecord as readonly { priority: bigint; weight: bigint; port: bigint; target: string }[])?.map(r => `${r.priority.toString()} ${r.weight.toString()} ${r.port.toString()} ${r.target}`) ?? [] 
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(resolvedDomain);
    toast.success("Address copied");
  };

  return (
    <div className="w-full py-6 animate-fade-in space-y-8">
      <PageHeader
        title="Domain Records"
        subtitle={
          <span className="flex flex-col">
            <span>DNS records for: <span className="font-semibold text-primary">{domainLabel}</span></span>
            <span className="text-xs text-muted-foreground font-mono truncate">{resolvedDomain}</span>
          </span>
        }
        showBackButton
        backHref="/domains"
      >
        <Link href={`/domains/${resolvedDomain}/manage`}>
          <Button className="rounded-xl h-10 px-6 font-semibold shadow-lg shadow-primary/20">
            <Settings className="h-4 w-4 mr-2" />
            Manage Domain
          </Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border/50 bg-secondary/5">
          <CardContent className="flex flex-col sm:flex-row items-center justify-between p-6 gap-4">
             <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Contract Hash</p>
                <code className="text-xs font-mono bg-background p-2 rounded-lg border border-border/30 block break-all">
                  {resolvedDomain}
                </code>
             </div>
             <Button variant="outline" size="sm" onClick={handleCopy} className="rounded-xl shrink-0">
               <Copy className="h-3.5 w-3.5 mr-2" /> Copy Hash
             </Button>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-secondary/5">
           <CardContent className="flex items-center justify-center p-6 h-full text-center">
              <div className="space-y-1">
                 <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Subdomains</p>
                 <p className="text-xl font-bold">{subdomainList.length}</p>
              </div>
           </CardContent>
        </Card>
      </div>

      {hasSubdomains && (
        <Card className="border-border/50">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-lg font-bold">Subdomain Inventory</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border/30 p-0">
            {subdomainList.map((label) => (
              <div key={label} className="flex items-center justify-between p-4 hover:bg-secondary/5">
                <span className="font-mono text-sm">{label}.{domainLabel}</span>
                <Link href={`/domains/${resolvedDomain}/manage?sub=${label}`}>
                   <Button variant="ghost" size="sm" className="text-xs text-primary font-bold">Configure</Button>
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {recordDefinitions.map((record) => (
          <Card key={record.type} className="border-border/50 group h-full">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-base font-bold tracking-tight">{record.type} Records</CardTitle>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">{record.description}</p>
              </div>
              <record.Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              {record.data.length > 0 ? (
                <div className="space-y-1.5">
                  {record.data.map((item, i) => (
                    <div key={i} className="text-xs font-mono bg-secondary/20 p-2.5 rounded-lg border border-border/20 truncate">
                      {item}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-[10px] text-muted-foreground italic border-t border-border/20">
                  No defined records
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DomainPage;
