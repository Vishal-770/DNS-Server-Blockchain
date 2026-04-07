"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";
import client from "@/app/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  AddRecordDialog,
  EditRecordDialog,
  AddMXRecordDialog,
  AddSRVRecordDialog,
  CreateSubdomainDialog,
  DeleteRecordDialog,
} from "./_components/RecordDialogs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Edit,
  Trash2,
  Mail,
  Database,
  Layers,
  FileText,
} from "lucide-react";
import { LoadingPage } from "@/components/ui/loading";
import { PageHeader } from "@/components/ui/page-header";

interface DNSRecord {
  type: string;
  value: string;
  index: number;
}

interface MXRecord {
  priority: number;
  value: string;
  index: number;
}

interface SRVRecord {
  priority: number;
  weight: number;
  port: number;
  target: string;
  index: number;
}

const DNSManagementDashboard: React.FC = () => {
  const { domainAddress } = useParams();
  const searchParams = useSearchParams();
  const resolvedDomain = domainAddress as string;

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isMXDialogOpen, setIsMXDialogOpen] = useState(false);
  const [isSRVDialogOpen, setIsSRVDialogOpen] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState<{
    isOpen: boolean;
    record: DNSRecord | MXRecord | SRVRecord | null;
    recordType: "standard" | "mx" | "srv";
  }>({ isOpen: false, record: null, recordType: "standard" });

  const [selectedScope, setSelectedScope] = useState<"root" | "subdomain">(
    "root"
  );
  const [activeSubdomain, setActiveSubdomain] = useState<string | null>(null);
  const [isCreateSubdomainOpen, setIsCreateSubdomainOpen] = useState(false);

  const [editRecordState, setEditRecordState] = useState<DNSRecord | null>(null);

  const contract = getContract({
    client,
    address: resolvedDomain,
    chain: sepolia,
  });

  const { data: domainNameData } = useReadContract({
    contract,
    method: "function domainName() view returns (string)",
    params: [],
  });

  const domainLabel =
    typeof domainNameData === "string" && domainNameData.length > 0
      ? domainNameData
      : resolvedDomain;

  const {
    data: subdomainLabels,
    refetch: refetchSubdomains,
    isPending: subdomainsPending,
  } = useReadContract({
    contract,
    method: "function listSubdomains() view returns (string[])",
    params: [],
  });

  const subdomainList = useMemo(
    () => (Array.isArray(subdomainLabels) ? (subdomainLabels as string[]) : []),
    [subdomainLabels]
  );

  const initialSubdomain = searchParams.get("sub");

  useEffect(() => {
    if (initialSubdomain) {
      setSelectedScope("subdomain");
      setActiveSubdomain(initialSubdomain);
    }
  }, [initialSubdomain]);

  useEffect(() => {
    if (selectedScope !== "subdomain") {
      return;
    }

    if (subdomainList.length === 0) {
      setActiveSubdomain(null);
      return;
    }

    if (!activeSubdomain || !subdomainList.includes(activeSubdomain)) {
      setActiveSubdomain(subdomainList[0]);
    }
  }, [selectedScope, subdomainList, activeSubdomain]);

  const isSubdomainScope =
    selectedScope === "subdomain" && Boolean(activeSubdomain);
  const currentSubdomain = activeSubdomain ?? "";
  const canMutateRecords = selectedScope === "root" || Boolean(activeSubdomain);

  // Read all record types
  const {
    data: ARecords,
    refetch: refetchA,
    isPending: aPending,
  } = useReadContract({
    contract,
    method: "function getRecord(string recordType) view returns (string[])",
    params: ["A"],
  });

  const {
    data: AAAARecords,
    refetch: refetchAAAA,
    isPending: aaaaPending,
  } = useReadContract({
    contract,
    method: "function getRecord(string recordType) view returns (string[])",
    params: ["AAAA"],
  });

  const {
    data: CNAMERecords,
    refetch: refetchCNAME,
    isPending: cnamePending,
  } = useReadContract({
    contract,
    method: "function getRecord(string recordType) view returns (string[])",
    params: ["CNAME"],
  });

  const {
    data: TXTRecords,
    refetch: refetchTXT,
    isPending: txtPending,
  } = useReadContract({
    contract,
    method: "function getRecord(string recordType) view returns (string[])",
    params: ["TXT"],
  });

  const {
    data: NSRecords,
    refetch: refetchNS,
    isPending: nsPending,
  } = useReadContract({
    contract,
    method: "function getRecord(string recordType) view returns (string[])",
    params: ["NS"],
  });

  const {
    data: MXRecords,
    refetch: refetchMX,
    isPending: mxPending,
  } = useReadContract({
    contract,
    method: "function getMX() view returns ((uint256,string)[])",
    params: [],
  });

  const {
    data: SRVRecords,
    refetch: refetchSRV,
    isPending: srvPending,
  } = useReadContract({
    contract,
    method: "function getSRV() view returns ((uint256,uint256,uint256,string)[])",
    params: [],
  });

  // Subdomain record logic
  const {
    data: subARecords,
    refetch: refetchSubA,
    isPending: subAPending,
  } = useReadContract({
    contract,
    method:
      "function getSubdomainRecord(string label, string recordType) view returns (string[])",
    params: [currentSubdomain, "A"],
  });

  const {
    data: subAAAARecords,
    refetch: refetchSubAAAA,
    isPending: subAAAAPending,
  } = useReadContract({
    contract,
    method:
      "function getSubdomainRecord(string label, string recordType) view returns (string[])",
    params: [currentSubdomain, "AAAA"],
  });

  const {
    data: subCNAMERecords,
    refetch: refetchSubCNAME,
    isPending: subCNAMEPending,
  } = useReadContract({
    contract,
    method:
      "function getSubdomainRecord(string label, string recordType) view returns (string[])",
    params: [currentSubdomain, "CNAME"],
  });

  const {
    data: subTXTRecords,
    refetch: refetchSubTXT,
    isPending: subTXTPending,
  } = useReadContract({
    contract,
    method:
      "function getSubdomainRecord(string label, string recordType) view returns (string[])",
    params: [currentSubdomain, "TXT"],
  });

  const {
    data: subNSRecords,
    refetch: refetchSubNS,
    isPending: subNSPending,
  } = useReadContract({
    contract,
    method:
      "function getSubdomainRecord(string label, string recordType) view returns (string[])",
    params: [currentSubdomain, "NS"],
  });

  const {
    data: subMXRecords,
    refetch: refetchSubMX,
    isPending: subMXPending,
  } = useReadContract({
    contract,
    method:
      "function getSubdomainMX(string label) view returns ((uint256,string)[])",
    params: [currentSubdomain],
  });

  const {
    data: subSRVRecords,
    refetch: refetchSubSRV,
    isPending: subSRVPending,
  } = useReadContract({
    contract,
    method:
      "function getSubdomainSRV(string label) view returns ((uint256,uint256,uint256,string)[])",
    params: [currentSubdomain],
  });

  const isLoading =
    aPending ||
    aaaaPending ||
    cnamePending ||
    txtPending ||
    nsPending ||
    mxPending ||
    srvPending ||
    (isSubdomainScope &&
      (subAPending ||
        subAAAAPending ||
        subCNAMEPending ||
        subTXTPending ||
        subNSPending ||
        subMXPending ||
        subSRVPending)) ||
    subdomainsPending;

  const refetchRecords = () => {
    if (isSubdomainScope) {
      refetchSubA();
      refetchSubAAAA();
      refetchSubCNAME();
      refetchSubTXT();
      refetchSubNS();
    } else {
      refetchA();
      refetchAAAA();
      refetchCNAME();
      refetchTXT();
      refetchNS();
    }
  };

  const refetchMXRecords = () => {
    if (isSubdomainScope) {
      refetchSubMX();
    } else {
      refetchMX();
    }
  };

  const refetchSRVRecords = () => {
    if (isSubdomainScope) {
      refetchSubSRV();
    } else {
      refetchSRV();
    }
  };

  const refetchAllRecords = () => {
    refetchRecords();
    refetchMXRecords();
    refetchSRVRecords();
    refetchSubdomains();
  };

  const parseStandardRecords = (data: readonly string[] | undefined, type: string) => {
    if (!data || !Array.isArray(data)) return [];
    return data.map((val: string, idx: number) => ({
      type,
      value: val,
      index: idx,
    }));
  };

  const parseMXRecords = (data: readonly (readonly [bigint, string])[] | undefined) => {
    if (!data || !Array.isArray(data)) return [];
    return data.map((item: readonly [bigint, string], idx: number) => ({
      priority: Number(item[0]),
      value: item[1],
      index: idx,
    }));
  };

  const parseSRVRecords = (data: readonly (readonly [bigint, bigint, bigint, string])[] | undefined) => {
    if (!data || !Array.isArray(data)) return [];
    return data.map((item: readonly [bigint, bigint, bigint, string], idx: number) => ({
      priority: Number(item[0]),
      weight: Number(item[1]),
      port: Number(item[2]),
      target: item[3],
      index: idx,
    }));
  };

  const records = useMemo(() => {
    if (isSubdomainScope) {
      return [
        ...parseStandardRecords(subARecords, "A"),
        ...parseStandardRecords(subAAAARecords, "AAAA"),
        ...parseStandardRecords(subCNAMERecords, "CNAME"),
        ...parseStandardRecords(subTXTRecords, "TXT"),
        ...parseStandardRecords(subNSRecords, "NS"),
        ...parseMXRecords(subMXRecords),
        ...parseSRVRecords(subSRVRecords),
      ];
    }
    return [
      ...parseStandardRecords(ARecords, "A"),
      ...parseStandardRecords(AAAARecords, "AAAA"),
      ...parseStandardRecords(CNAMERecords, "CNAME"),
      ...parseStandardRecords(TXTRecords, "TXT"),
      ...parseStandardRecords(NSRecords, "NS"),
      ...parseMXRecords(MXRecords),
      ...parseSRVRecords(SRVRecords),
    ];
  }, [
    isSubdomainScope,
    ARecords,
    AAAARecords,
    CNAMERecords,
    TXTRecords,
    NSRecords,
    MXRecords,
    SRVRecords,
    subARecords,
    subAAAARecords,
    subCNAMERecords,
    subTXTRecords,
    subNSRecords,
    subMXRecords,
    subSRVRecords,
  ]);

  const handleAddRecord = () => {
    setIsAddDialogOpen(true);
  };

  const handleAddMXRecord = () => {
    setIsMXDialogOpen(true);
  };

  const handleAddSRVRecord = () => {
    setIsSRVDialogOpen(true);
  };

  const handleEditRecord = (record: DNSRecord | MXRecord | SRVRecord) => {
    if ("type" in record) {
      setEditRecordState(record as DNSRecord);
      setIsEditDialogOpen(true);
    }
  };

  const handleDeleteRecord = (record: DNSRecord | MXRecord | SRVRecord) => {
    if ("priority" in record && "value" in record && !("weight" in record)) {
      setDeleteAlert({ isOpen: true, record, recordType: "mx" });
    } else if (
      "priority" in record &&
      "weight" in record &&
      "port" in record &&
      "target" in record
    ) {
      setDeleteAlert({ isOpen: true, record, recordType: "srv" });
    } else {
      setDeleteAlert({
        isOpen: true,
        record: record as DNSRecord,
        recordType: "standard",
      });
    }
  };

  if (isLoading) return <LoadingPage />;

  return (
    <div className="w-full py-6">
      <div className="flex flex-col gap-8">
        <PageHeader
          title={
            selectedScope === "root"
              ? domainLabel
              : `${activeSubdomain}.${domainLabel}`
          }
          subtitle="Manage your decentralized DNS records and subdomains"
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1 shadow-sm border-muted/20">
            <CardHeader className="pb-3 border-b border-muted/10">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Layers className="h-4 w-4" /> Navigation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground px-1">
                  Scope
                </Label>
                <div className="grid grid-cols-2 gap-2 bg-muted/30 p-1 rounded-lg">
                  <Button
                    variant={selectedScope === "root" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      setSelectedScope("root");
                      setActiveSubdomain(null);
                    }}
                    className="h-9 transition-all"
                  >
                    Root
                  </Button>
                  <Button
                    variant={selectedScope === "subdomain" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      setSelectedScope("subdomain");
                      if (!activeSubdomain && subdomainList.length > 0) {
                        setActiveSubdomain(subdomainList[0]);
                      }
                    }}
                    className="h-9 transition-all"
                  >
                    Subs
                  </Button>
                </div>
              </div>

              {selectedScope === "subdomain" && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-1 duration-300">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground px-1 flex justify-between items-center">
                      Active Subdomain
                      <Badge variant="outline" className="px-1.5 py-0">
                        {subdomainList.length}
                      </Badge>
                    </Label>
                    <Select
                      value={activeSubdomain || ""}
                      onValueChange={setActiveSubdomain}
                    >
                      <SelectTrigger className="w-full bg-background border-muted/30">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {subdomainList.map((label) => (
                          <SelectItem key={label} value={label}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                className="w-full h-11 justify-start gap-2 border-dashed border-muted/50 hover:border-primary/50 hover:bg-primary/5 group"
                onClick={() => setIsCreateSubdomainOpen(true)}
              >
                <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span>New Subdomain</span>
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 shadow-sm border-muted/20">
            <CardHeader className="pb-3 border-b border-muted/10 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  DNS Records
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Current configuration for{" "}
                  {selectedScope === "root" ? "main domain" : "subdomain"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleAddRecord}
                  size="sm"
                  className="hidden md:flex gap-1.5"
                  disabled={!canMutateRecords}
                >
                  <Plus className="h-4 w-4" /> Add Record
                </Button>
                <Button
                  onClick={handleAddMXRecord}
                  variant="outline"
                  size="sm"
                  className="hidden md:flex gap-1.5"
                  disabled={!canMutateRecords}
                >
                  <Mail className="h-4 w-4" /> MX
                </Button>
                <Button
                  onClick={handleAddSRVRecord}
                  variant="outline"
                  size="sm"
                  className="hidden md:flex gap-1.5"
                  disabled={!canMutateRecords}
                >
                  <Database className="h-4 w-4" /> SRV
                </Button>

                <div className="flex md:hidden gap-1">
                  <Button
                    onClick={handleAddRecord}
                    size="icon"
                    className="h-8 w-8"
                    disabled={!canMutateRecords}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {records.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
                  <div className="h-12 w-12 rounded-full bg-muted/20 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">No records found</h3>
                    <p className="text-sm text-muted-foreground">
                      Start by adding your first DNS record
                    </p>
                  </div>
                  <Button
                    onClick={handleAddRecord}
                    variant="outline"
                    className="mt-2"
                  >
                    Create First Record
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-muted/10 overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-muted/10">
                      <tr>
                        <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Type
                        </th>
                        <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Value / Target
                        </th>
                        <th className="px-6 py-2 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-muted/10">
                      {records.map((record, idx) => {
                        const type =
                          "type" in record ? record.type : "priority" in record && !("weight" in record) ? "MX" : "SRV";
                        return (
                          <tr
                            key={`${type}-${idx}`}
                            className="hover:bg-muted/5 transition-colors group"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge
                                variant={
                                  type === "A" || type === "AAAA"
                                    ? "default"
                                    : "outline"
                                }
                                className="font-mono px-2"
                              >
                                {type}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <div className="max-w-[200px] md:max-w-md">
                                {(() => {
                                  if ("type" in record) {
                                    return (
                                      <p className="font-medium text-foreground text-sm md:text-base break-all">
                                        {record.value}
                                      </p>
                                    );
                                  } else if ("priority" in record && !("weight" in record)) {
                                    return (
                                      <p className="font-medium text-foreground text-sm md:text-base">
                                        <span className="text-primary font-mono mr-2">
                                          [{record.priority}]
                                        </span>
                                        <span className="break-all">{record.value}</span>
                                      </p>
                                    );
                                  } else if ("priority" in record && "weight" in record) {
                                    return (
                                      <p className="font-medium text-foreground text-sm md:text-base">
                                        <span className="text-primary font-mono mr-2">
                                          {record.priority}/{record.weight}/{record.port}
                                        </span>
                                        <span className="break-all">{record.target}</span>
                                      </p>
                                    );
                                  }
                                  return null;
                                })()}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {"type" in record && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                                    onClick={() => handleEditRecord(record)}
                                    disabled={!canMutateRecords}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                  onClick={() => handleDeleteRecord(record)}
                                  disabled={!canMutateRecords}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <CreateSubdomainDialog
          isOpen={isCreateSubdomainOpen}
          onClose={() => setIsCreateSubdomainOpen(false)}
          contract={contract}
          refetchAllRecords={refetchAllRecords}
          domainLabel={domainLabel}
          setScope={setSelectedScope}
          setSub={setActiveSubdomain}
        />

        <AddRecordDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          contract={contract}
          refetchAllRecords={refetchAllRecords}
          selectedScope={selectedScope}
          activeSubdomain={activeSubdomain}
        />

        <EditRecordDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          contract={contract}
          record={editRecordState}
          refetchAllRecords={refetchAllRecords}
          selectedScope={selectedScope}
          activeSubdomain={activeSubdomain}
        />

        <AddMXRecordDialog
          isOpen={isMXDialogOpen}
          onClose={() => setIsMXDialogOpen(false)}
          contract={contract}
          refetchAllRecords={refetchAllRecords}
          selectedScope={selectedScope}
          activeSubdomain={activeSubdomain}
        />

        <AddSRVRecordDialog
          isOpen={isSRVDialogOpen}
          onClose={() => setIsSRVDialogOpen(false)}
          contract={contract}
          refetchAllRecords={refetchAllRecords}
          selectedScope={selectedScope}
          activeSubdomain={activeSubdomain}
        />

        <DeleteRecordDialog
          isOpen={deleteAlert.isOpen}
          onClose={() => setDeleteAlert({ ...deleteAlert, isOpen: false })}
          contract={contract}
          refetchAllRecords={refetchAllRecords}
          selectedScope={selectedScope}
          activeSubdomain={activeSubdomain}
          record={deleteAlert.record}
          recordType={deleteAlert.recordType}
        />
      </div>
    </div>
  );
};

export default DNSManagementDashboard;
