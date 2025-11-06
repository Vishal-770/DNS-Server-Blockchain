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
  ExternalLink,
  Copy,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LoadingCard, LoadingSkeleton } from "@/components/ui/loading";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const DomainPage: React.FC = () => {
  const { domainAddress } = useParams();
  const resolvedDomain = domainAddress as string;

  const contract = getContract({
    client,
    address: resolvedDomain,
    chain: sepolia,
  });

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

  // Fetch MX records
  const { data: MXRecord, isPending: mxPending } = useReadContract({
    contract,
    method:
      "function getMX() view returns ((uint256 priority, string value)[])",
    params: [],
  });

  // Fetch SRV records
  const { data: SRVRecord, isPending: srvPending } = useReadContract({
    contract,
    method:
      "function getSRV() view returns ((uint256 priority, uint256 weight, uint256 port, string target)[])",
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
    subdomainPending;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background mt-20">
        <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in">
          <div className="mb-4">
            <LoadingSkeleton className="h-10 w-16" />
          </div>

          <PageHeader
            title="Domain Records"
            subtitle={
              <span>
                DNS records for:{" "}
                <span className="font-mono text-primary">{resolvedDomain}</span>
              </span>
            }
            showBackButton
            backHref="/user"
          >
            <LoadingSkeleton className="h-10 w-40" />
          </PageHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 7 }).map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const recordDefinitions = [
    {
      type: "A",
      title: "A record",
      description: "IPv4 address",
      Icon: Globe,
      data: (ARecord as string[] | undefined) ?? [],
    },
    {
      type: "AAAA",
      title: "AAAA record",
      description: "IPv6 address",
      Icon: Globe,
      data: (AAAARecord as string[] | undefined) ?? [],
    },
    {
      type: "CNAME",
      title: "CNAME record",
      description: "Canonical alias",
      Icon: ExternalLink,
      data: (CNAMERecord as string[] | undefined) ?? [],
    },
    {
      type: "TXT",
      title: "TXT record",
      description: "Verification metadata",
      Icon: FileText,
      data: (TXTRecord as string[] | undefined) ?? [],
    },
    {
      type: "NS",
      title: "NS record",
      description: "Name servers",
      Icon: Server,
      data: (NSRecord as string[] | undefined) ?? [],
    },
    {
      type: "MX",
      title: "MX record",
      description: "Mail exchange",
      Icon: Mail,
      data:
        (
          MXRecord as { priority: bigint | number; value: string }[] | undefined
        )?.map((record) => `${Number(record.priority)} ${record.value}`) ?? [],
    },
    {
      type: "SRV",
      title: "SRV record",
      description: "Service discovery",
      Icon: Database,
      data:
        (
          SRVRecord as
            | {
                priority: bigint | number;
                weight: bigint | number;
                port: bigint | number;
                target: string;
              }[]
            | undefined
        )?.map(
          (record) =>
            `${Number(record.priority)} ${Number(record.weight)} ${Number(
              record.port
            )} ${record.target}`
        ) ?? [],
    },
  ];

  const totalRecords = recordDefinitions.reduce(
    (acc, record) => acc + record.data.length,
    0
  );

  const hasRecords = recordDefinitions.some((record) => record.data.length);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resolvedDomain);
      toast.success("Contract address copied");
    } catch (error) {
      console.error(error);
      toast.error("Failed to copy address");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background mt-20">
      <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in">
        <PageHeader
          title="Domain Records"
          subtitle={
            <span>
              DNS records for:{" "}
              <span className="font-mono text-primary">{resolvedDomain}</span>
            </span>
          }
          showBackButton
          backHref="/user"
        >
          <Link href={`/domains/${resolvedDomain}/manage`}>
            <Button className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto">
              <Settings className="h-4 w-4" />
              Manage Records
            </Button>
          </Link>
        </PageHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          <Card className="lg:col-span-2 border shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="flex flex-wrap items-center gap-3 text-lg">
                <Globe className="h-5 w-5 text-primary" />
                <span className="font-semibold">{resolvedDomain}</span>
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  {totalRecords} {totalRecords === 1 ? "record" : "records"}
                </Badge>
                <Badge
                  className="rounded-full px-3 py-1"
                  variant={hasRecords ? "default" : "outline"}
                >
                  {hasRecords ? "Active" : "No Records"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3 pt-0">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleCopy}
              >
                <Copy className="h-4 w-4" />
                Copy contract address
              </Button>
              <Link href={`/domains/${resolvedDomain}/manage`}>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <ExternalLink className="h-4 w-4" />
                  Edit records
                </Button>
              </Link>
              <Badge variant="outline" className="ml-auto rounded-full px-3">
                {hasSubdomains
                  ? `${subdomainList.length} subdomain${
                      subdomainList.length === 1 ? "" : "s"
                    }`
                  : "No subdomains"}
              </Badge>
            </CardContent>
          </Card>

          <Card className="border shadow-md bg-muted/40">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Sparkles className="h-4 w-4 text-primary" />
                Quick tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground pt-0">
              <p>
                Records update on-chain instantly but may take time to
                propagate.
              </p>
              <p>
                Use the manage panel to add, edit, or remove DNS records
                securely.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border shadow-md mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-4 w-4 text-primary" />
              Subdomains
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {hasSubdomains ? (
              <div className="space-y-3">
                {subdomainList.map((label) => {
                  const fqdn = `${label}.${resolvedDomain}`;
                  return (
                    <div
                      key={label}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border rounded-lg bg-muted/40"
                    >
                      <div>
                        <p className="font-semibold text-foreground">{fqdn}</p>
                        <p className="text-sm text-muted-foreground">
                          Manage delegated records for this subdomain.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="rounded-full px-3"
                        >
                          Active
                        </Badge>
                        <Link
                          href={`/domains/${resolvedDomain}/manage?sub=${label}`}
                        >
                          <Button variant="outline" size="sm">
                            Configure
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center text-muted-foreground space-y-2">
                <p>
                  No subdomains yet. Use the management panel to create your
                  first subdomain and delegate records.
                </p>
                <p>
                  Example:{" "}
                  <span className="font-mono text-foreground">
                    {`blog.${resolvedDomain}`}
                  </span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-8">
          {recordDefinitions.map((record, index) => (
            <Card
              key={record.type}
              className="shadow-md hover:shadow-lg transition-all duration-300 border bg-card text-card-foreground animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <record.Icon className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-semibold capitalize">
                      {record.title}
                    </div>
                    <div className="text-sm font-normal text-muted-foreground">
                      {record.description}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {record.data && record.data.length > 0 ? (
                  <div className="space-y-2">
                    {record.data.map((item, index) => (
                      <div
                        key={index}
                        className="p-3 bg-muted/50 rounded-md border-l-4 border-l-primary"
                      >
                        <p className="text-sm font-mono text-foreground break-all">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-muted/50 rounded-md text-center">
                    <p className="text-sm text-muted-foreground">
                      No {record.type} records found
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {!hasRecords && (
          <div className="text-center bg-card rounded-lg p-12 shadow-lg border animate-fade-in">
            <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No DNS Records Found
            </h3>
            <p className="text-muted-foreground mb-6">
              This domain doesn&apos;t have any DNS records configured yet.
            </p>
            <Link href={`/domains/${resolvedDomain}/manage`}>
              <Button>
                <Settings className="h-4 w-4 mr-2" />
                Set Up DNS Records
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DomainPage;
