"use client";

import client from "@/app/client";
import { useParams } from "next/navigation";
import React from "react";
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
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  LoadingSpinner,
  LoadingCard,
  LoadingSkeleton,
} from "@/components/ui/loading";

const DomainPage: React.FC = () => {
  const { domainAddress } = useParams();

  const contract = getContract({
    client,
    address: domainAddress as string,
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

  const isLoading =
    aPending ||
    nsPending ||
    txtPending ||
    aaaaPending ||
    cnamePending ||
    mxPending ||
    srvPending;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background mt-20">
        <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
            <div className="space-y-2">
              <LoadingSkeleton className="h-8 w-64" />
              <LoadingSkeleton className="h-5 w-80" />
            </div>
            <LoadingSkeleton className="h-10 w-40" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 7 }).map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const records = [
    { type: "A", data: ARecord },
    { type: "NS", data: NSRecord },
    { type: "TXT", data: TXTRecord },
    { type: "AAAA", data: AAAARecord },
    { type: "CNAME", data: CNAMERecord },
    {
      type: "MX",
      data: MXRecord?.map((record) => `${record.priority} ${record.value}`),
    },
    {
      type: "SRV",
      data: SRVRecord?.map(
        (record) =>
          `${record.priority} ${record.weight} ${record.port} ${record.target}`
      ),
    },
  ];

  const getRecordIcon = (type: string) => {
    switch (type) {
      case "A":
      case "AAAA":
        return <Globe className="h-5 w-5 text-primary" />;
      case "CNAME":
        return <ExternalLink className="h-5 w-5 text-primary" />;
      case "TXT":
        return <FileText className="h-5 w-5 text-primary" />;
      case "NS":
        return <Server className="h-5 w-5 text-primary" />;
      case "MX":
        return <Mail className="h-5 w-5 text-primary" />;
      case "SRV":
        return <Database className="h-5 w-5 text-primary" />;
      default:
        return <Globe className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getRecordDescription = (type: string) => {
    switch (type) {
      case "A":
        return "IPv4 Address";
      case "AAAA":
        return "IPv6 Address";
      case "CNAME":
        return "Canonical Name";
      case "TXT":
        return "Text Record";
      case "NS":
        return "Name Server";
      case "MX":
        return "Mail Exchange";
      case "SRV":
        return "Service Record";
      default:
        return "DNS Record";
    }
  };

  return (
    <div className="min-h-screen bg-background mt-20">
      <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
              Domain Records
            </h1>
            <p className="text-sm md:text-base text-muted-foreground break-all lg:break-normal">
              DNS records for:{" "}
              <span className="font-mono text-primary">{domainAddress}</span>
            </p>
          </div>
          <Link href={`/domains/${domainAddress}/manage`}>
            <Button className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto">
              <Settings className="h-4 w-4" />
              Manage Records
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-8">
          {records.map((record, index) => (
            <Card
              key={record.type}
              className="shadow-md hover:shadow-lg transition-all duration-300 border bg-card text-card-foreground animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  {getRecordIcon(record.type)}
                  <div>
                    <div className="font-semibold">{record.type} Record</div>
                    <div className="text-sm font-normal text-muted-foreground">
                      {getRecordDescription(record.type)}
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

        {records.every((r) => !r.data || r.data.length === 0) && (
          <div className="text-center bg-card rounded-lg p-12 shadow-lg border animate-fade-in">
            <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No DNS Records Found
            </h3>
            <p className="text-muted-foreground mb-6">
              This domain doesn&apos;t have any DNS records configured yet.
            </p>
            <Link href={`/domains/${domainAddress}/manage`}>
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
