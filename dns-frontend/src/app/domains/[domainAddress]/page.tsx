"use client";

import client from "@/app/client";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useReadContract, useSendTransaction } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import {
  Settings,
  Globe,
  Mail,
  Database,
  Server,
  FileText,
  ExternalLink,
  ArrowRightLeft,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const DomainPage: React.FC = () => {
  const { domainAddress } = useParams();

  // State for transfer domain functionality
  const [transferDialog, setTransferDialog] = useState(false);
  const [transferData, setTransferData] = useState({
    newOwner: "",
    password: "",
  });

  const { mutate: sendTransaction } = useSendTransaction();

  const contract = getContract({
    client,
    address: domainAddress as string,
    chain: sepolia,
  });

  // Transfer domain function
  const handleTransferDomain = () => {
    if (!transferData.newOwner || !transferData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    const transaction = prepareContractCall({
      contract,
      method: "function transferDomain(address newOwner, string _password)",
      params: [transferData.newOwner, transferData.password],
    });

    sendTransaction(transaction, {
      onSuccess: () => {
        toast.success("Domain transfer initiated successfully!");
        setTransferDialog(false);
        setTransferData({ newOwner: "", password: "" });
      },
      onError: (error) => {
        toast.error("Failed to transfer domain: " + error.message);
      },
    });
  };

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
      <div className="text-center mt-16 text-primary">
        Loading domain records...
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
        return <Globe className="h-5 w-5 text-chart-4" />;
      case "CNAME":
        return <ExternalLink className="h-5 w-5 text-chart-3" />;
      case "TXT":
        return <FileText className="h-5 w-5 text-chart-1" />;
      case "NS":
        return <Server className="h-5 w-5 text-chart-5" />;
      case "MX":
        return <Mail className="h-5 w-5 text-accent-foreground" />;
      case "SRV":
        return <Database className="h-5 w-5 text-secondary-foreground" />;
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
      <div className="container mx-auto px-4 py-8 max-w-7xl">
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
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link href={`/domains/${domainAddress}/manage`}>
              <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto">
                <Settings className="h-4 w-4" />
                Manage Records
              </Button>
            </Link>
            <Dialog open={transferDialog} onOpenChange={setTransferDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-destructive text-destructive hover:text-destructive-foreground shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                  Transfer Domain
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader className="space-y-3">
                  <DialogTitle className="text-lg font-semibold text-foreground flex items-center gap-3">
                    <ArrowRightLeft className="h-5 w-5 text-destructive" />
                    Transfer Domain Ownership
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <p className="text-sm text-destructive font-medium mb-2">
                      ⚠️ Warning: This action is irreversible
                    </p>
                    <p className="text-xs text-muted-foreground">
                      You will permanently lose ownership of this domain. The
                      new owner will have full control over all DNS records and
                      settings.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="newOwner"
                        className="text-sm font-medium text-foreground"
                      >
                        New Owner Address *
                      </Label>
                      <Input
                        id="newOwner"
                        type="text"
                        placeholder="0x..."
                        value={transferData.newOwner}
                        onChange={(e) =>
                          setTransferData({
                            ...transferData,
                            newOwner: e.target.value,
                          })
                        }
                        className="h-11 font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="transferPassword"
                        className="text-sm font-medium text-foreground"
                      >
                        Confirm with Password *
                      </Label>
                      <Input
                        id="transferPassword"
                        type="password"
                        placeholder="Enter your password"
                        value={transferData.password}
                        onChange={(e) =>
                          setTransferData({
                            ...transferData,
                            password: e.target.value,
                          })
                        }
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter className="gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTransferDialog(false);
                      setTransferData({ newOwner: "", password: "" });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleTransferDomain}
                    disabled={!transferData.newOwner || !transferData.password}
                  >
                    <ArrowRightLeft className="h-4 w-4 mr-2" />
                    Transfer Domain
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-8">
          {records.map((record) => (
            <Card
              key={record.type}
              className="shadow-lg hover:shadow-xl transition-shadow duration-200 border-0 bg-card/80 backdrop-blur-sm"
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
          <div className="text-center bg-card/80 backdrop-blur-sm rounded-lg p-12 shadow-lg">
            <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No DNS Records Found
            </h3>
            <p className="text-muted-foreground mb-6">
              This domain doesn&apos;t have any DNS records configured yet.
            </p>
            <Link href={`/domains/${domainAddress}/manage`}>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
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
