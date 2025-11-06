"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getContract, prepareContractCall } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { TransactionButton, useReadContract } from "thirdweb/react";
import client from "@/app/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Plus,
  Edit,
  Trash2,
  Shield,
  Globe,
  FileText,
  Server,
  ExternalLink,
  Mail,
  Database,
  Layers,
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
  const [isEditMXDialogOpen, setIsEditMXDialogOpen] = useState(false);
  const [isEditSRVDialogOpen, setIsEditSRVDialogOpen] = useState(false);
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
  const [newSubdomain, setNewSubdomain] = useState({
    label: "",
    password: "",
  });

  const [newRecord, setNewRecord] = useState({
    type: "A",
    value: "",
    password: "",
  });

  const [newMXRecord, setNewMXRecord] = useState({
    priority: 0,
    value: "",
    password: "",
  });

  const [newSRVRecord, setNewSRVRecord] = useState({
    priority: 0,
    weight: 0,
    port: 0,
    target: "",
    password: "",
  });

  const [editRecord, setEditRecord] = useState<
    DNSRecord & { password: string }
  >({
    type: "",
    value: "",
    index: 0,
    password: "",
  });

  const [editMXRecord, setEditMXRecord] = useState<
    MXRecord & { password: string }
  >({
    priority: 0,
    value: "",
    index: 0,
    password: "",
  });

  const [editSRVRecord, setEditSRVRecord] = useState<
    SRVRecord & { password: string }
  >({
    priority: 0,
    weight: 0,
    port: 0,
    target: "",
    index: 0,
    password: "",
  });

  const contract = getContract({
    client,
    address: resolvedDomain,
    chain: sepolia,
  });

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
    data: subARecords,
    refetch: refetchSubA,
    isPending: subAPending,
  } = useReadContract({
    queryOptions: {
      enabled: isSubdomainScope,
    },
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
    queryOptions: {
      enabled: isSubdomainScope,
    },
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
    queryOptions: {
      enabled: isSubdomainScope,
    },
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
    queryOptions: {
      enabled: isSubdomainScope,
    },
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
    queryOptions: {
      enabled: isSubdomainScope,
    },
    contract,
    method:
      "function getSubdomainRecord(string label, string recordType) view returns (string[])",
    params: [currentSubdomain, "NS"],
  });

  // Read MX records
  const {
    data: MXRecords,
    refetch: refetchMX,
    isPending: mxPending,
  } = useReadContract({
    queryOptions: {
      enabled: selectedScope === "root",
    },
    contract,
    method:
      "function getMX() view returns ((uint256 priority, string value)[])",
    params: [],
  });

  const {
    data: MXRecordsSub,
    refetch: refetchMXSub,
    isPending: mxSubPending,
  } = useReadContract({
    queryOptions: {
      enabled: selectedScope === "subdomain" && Boolean(activeSubdomain),
    },
    contract,
    method:
      "function getSubdomainMX(string label) view returns ((uint256 priority, string value)[])",
    params: [activeSubdomain || ""],
  });

  // Read SRV records
  const {
    data: SRVRecords,
    refetch: refetchSRV,
    isPending: srvPending,
  } = useReadContract({
    queryOptions: {
      enabled: selectedScope === "root",
    },
    contract,
    method:
      "function getSRV() view returns ((uint256 priority, uint256 weight, uint256 port, string target)[])",
    params: [],
  });

  const {
    data: SRVRecordsSub,
    refetch: refetchSRVSub,
    isPending: srvSubPending,
  } = useReadContract({
    queryOptions: {
      enabled: selectedScope === "subdomain" && Boolean(activeSubdomain),
    },
    contract,
    method:
      "function getSubdomainSRV(string label) view returns ((uint256 priority, uint256 weight, uint256 port, string target)[])",
    params: [activeSubdomain || ""],
  });

  const recordTypes = [
    { value: "A", label: "A Record", icon: Globe, description: "IPv4 Address" },
    {
      value: "AAAA",
      label: "AAAA Record",
      icon: Globe,
      description: "IPv6 Address",
    },
    {
      value: "CNAME",
      label: "CNAME Record",
      icon: ExternalLink,
      description: "Canonical Name",
    },
    {
      value: "TXT",
      label: "TXT Record",
      icon: FileText,
      description: "Text Record",
    },
    {
      value: "NS",
      label: "NS Record",
      icon: Server,
      description: "Name Server",
    },
    {
      value: "MX",
      label: "MX Record",
      icon: Mail,
      description: "Mail Exchange",
    },
    {
      value: "SRV",
      label: "SRV Record",
      icon: Database,
      description: "Service Record",
    },
  ];

  const getRecordIcon = (type: string) => {
    const recordType = recordTypes.find((rt) => rt.value === type);
    const IconComponent = recordType?.icon || Globe;
    return <IconComponent className="h-4 w-4" />;
  };

  const getAllRecords = (): (DNSRecord | MXRecord | SRVRecord)[] => {
    const records: (DNSRecord | MXRecord | SRVRecord)[] = [];

    const toStringArray = (value: unknown) =>
      Array.isArray(value) ? (value as string[]) : [];
    const toMxArray = (
      value: unknown
    ): { priority: bigint | number; value: string }[] =>
      Array.isArray(value)
        ? (value as { priority: bigint | number; value: string }[])
        : [];
    const toSrvArray = (
      value: unknown
    ): {
      priority: bigint | number;
      weight: bigint | number;
      port: bigint | number;
      target: string;
    }[] =>
      Array.isArray(value)
        ? (value as {
            priority: bigint | number;
            weight: bigint | number;
            port: bigint | number;
            target: string;
          }[])
        : [];

    const activeARecords = isSubdomainScope
      ? toStringArray(subARecords)
      : toStringArray(ARecords);
    const activeAAAARecords = isSubdomainScope
      ? toStringArray(subAAAARecords)
      : toStringArray(AAAARecords);
    const activeCNAMERecords = isSubdomainScope
      ? toStringArray(subCNAMERecords)
      : toStringArray(CNAMERecords);
    const activeTXTRecords = isSubdomainScope
      ? toStringArray(subTXTRecords)
      : toStringArray(TXTRecords);
    const activeNSRecords = isSubdomainScope
      ? toStringArray(subNSRecords)
      : toStringArray(NSRecords);
    const activeMXRecords = isSubdomainScope
      ? toMxArray(MXRecordsSub)
      : toMxArray(MXRecords);
    const activeSRVRecords = isSubdomainScope
      ? toSrvArray(SRVRecordsSub)
      : toSrvArray(SRVRecords);

    activeARecords.forEach((value, index) => {
      records.push({ type: "A", value, index });
    });

    activeAAAARecords.forEach((value, index) => {
      records.push({ type: "AAAA", value, index });
    });

    activeCNAMERecords.forEach((value, index) => {
      records.push({ type: "CNAME", value, index });
    });

    activeTXTRecords.forEach((value, index) => {
      records.push({ type: "TXT", value, index });
    });

    activeNSRecords.forEach((value, index) => {
      records.push({ type: "NS", value, index });
    });

    activeMXRecords.forEach((record, index) => {
      records.push({
        priority: Number(record.priority),
        value: record.value,
        index,
        type: "MX",
      } as MXRecord & { type: string });
    });

    activeSRVRecords.forEach((record, index) => {
      records.push({
        priority: Number(record.priority),
        weight: Number(record.weight),
        port: Number(record.port),
        target: record.target,
        index,
        type: "SRV",
      } as SRVRecord & { type: string });
    });

    return records;
  };

  const refetchAllRecords = () => {
    refetchA();
    refetchAAAA();
    refetchCNAME();
    refetchTXT();
    refetchNS();
    refetchMX();
    refetchSRV();
    refetchSubdomains();

    if (activeSubdomain) {
      refetchSubA();
      refetchSubAAAA();
      refetchSubCNAME();
      refetchSubTXT();
      refetchSubNS();
      refetchMXSub();
      refetchSRVSub();
    }
  };

  const handleAddRecord = () => {
    setNewRecord({ type: "A", value: "", password: "" });
    setIsAddDialogOpen(true);
  };

  const handleAddMXRecord = () => {
    setNewMXRecord({ priority: 0, value: "", password: "" });
    setIsMXDialogOpen(true);
  };

  const handleAddSRVRecord = () => {
    setNewSRVRecord({
      priority: 0,
      weight: 0,
      port: 0,
      target: "",
      password: "",
    });
    setIsSRVDialogOpen(true);
  };

  const handleEditRecord = (record: DNSRecord | MXRecord | SRVRecord) => {
    if ("priority" in record && "value" in record && !("weight" in record)) {
      // MX Record
      setEditMXRecord({ ...(record as MXRecord), password: "" });
      setIsEditMXDialogOpen(true);
    } else if (
      "priority" in record &&
      "weight" in record &&
      "port" in record &&
      "target" in record
    ) {
      // SRV Record
      setEditSRVRecord({ ...(record as SRVRecord), password: "" });
      setIsEditSRVDialogOpen(true);
    } else {
      // Standard DNS Record
      setEditRecord({ ...(record as DNSRecord), password: "" });
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
      setDeleteAlert({ isOpen: true, record, recordType: "standard" });
    }
  };

  const resetAddForm = () => {
    setNewRecord({ type: "A", value: "", password: "" });
    setIsAddDialogOpen(false);
  };

  const resetSubdomainForm = () => {
    setNewSubdomain({ label: "", password: "" });
    setIsCreateSubdomainOpen(false);
  };

  const resetEditForm = () => {
    setEditRecord({ type: "", value: "", index: 0, password: "" });
    setIsEditDialogOpen(false);
  };

  const resetMXForm = () => {
    setNewMXRecord({ priority: 0, value: "", password: "" });
    setIsMXDialogOpen(false);
  };

  const resetSRVForm = () => {
    setNewSRVRecord({
      priority: 0,
      weight: 0,
      port: 0,
      target: "",
      password: "",
    });
    setIsSRVDialogOpen(false);
  };

  const resetEditMXForm = () => {
    setEditMXRecord({ priority: 0, value: "", index: 0, password: "" });
    setIsEditMXDialogOpen(false);
  };

  const resetEditSRVForm = () => {
    setEditSRVRecord({
      priority: 0,
      weight: 0,
      port: 0,
      target: "",
      index: 0,
      password: "",
    });
    setIsEditSRVDialogOpen(false);
  };

  const allRecords = getAllRecords();

  const rootLoading =
    aPending ||
    aaaaPending ||
    cnamePending ||
    txtPending ||
    nsPending ||
    mxPending ||
    srvPending;

  const subdomainRecordsLoading =
    selectedScope === "subdomain" && Boolean(activeSubdomain)
      ? subAPending ||
        subAAAAPending ||
        subCNAMEPending ||
        subTXTPending ||
        subNSPending ||
        mxSubPending ||
        srvSubPending
      : false;

  const shouldShowLoading =
    selectedScope === "subdomain"
      ? subdomainsPending || subdomainRecordsLoading
      : rootLoading;

  if (shouldShowLoading) {
    const scopeTitle =
      selectedScope === "subdomain" && activeSubdomain
        ? `Loading ${activeSubdomain} records`
        : "Loading DNS Records";

    return (
      <LoadingPage
        title={scopeTitle}
        subtitle="Fetching domain configuration from blockchain..."
      />
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background mt-20">
      <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in">
        <PageHeader
          title="DNS Management"
          subtitle={
            <span>
              Manage DNS records for domain:{" "}
              <span className="font-mono text-primary">{resolvedDomain}</span>
            </span>
          }
          showBackButton
          backHref={`/domains/${resolvedDomain}`}
        >
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              onClick={handleAddRecord}
              className="flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={!canMutateRecords}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Record</span>
              <span className="sm:hidden">Add DNS</span>
            </Button>
            <Button
              onClick={handleAddMXRecord}
              variant="outline"
              className="flex items-center justify-center gap-2"
              disabled={!canMutateRecords}
            >
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Add MX</span>
              <span className="sm:hidden">MX</span>
            </Button>
            <Button
              onClick={handleAddSRVRecord}
              variant="outline"
              className="flex items-center justify-center gap-2"
              disabled={!canMutateRecords}
            >
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Add SRV</span>
              <span className="sm:hidden">SRV</span>
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Select
              value={selectedScope}
              onValueChange={(value) => {
                const scope = value as "root" | "subdomain";
                setSelectedScope(scope);
                if (scope === "root") {
                  setActiveSubdomain(null);
                } else if (!activeSubdomain && subdomainList.length > 0) {
                  setActiveSubdomain(subdomainList[0]);
                }
              }}
            >
              <SelectTrigger className="h-11 min-w-[150px]">
                <SelectValue placeholder="Select scope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="root">Root Domain</SelectItem>
                <SelectItem value="subdomain">Subdomain</SelectItem>
              </SelectContent>
            </Select>
            {selectedScope === "subdomain" && (
              <Select
                value={activeSubdomain ?? ""}
                onValueChange={(value) => {
                  if (!value) return;
                  setActiveSubdomain(value);
                }}
                disabled={subdomainList.length === 0}
              >
                <SelectTrigger className="h-11 min-w-[200px]">
                  <SelectValue placeholder="Choose subdomain" />
                </SelectTrigger>
                <SelectContent>
                  {subdomainList.length > 0 ? (
                    subdomainList.map((label) => (
                      <SelectItem key={label} value={label}>
                        {label}.{resolvedDomain}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="__no_subdomains__" disabled>
                      No subdomains
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setIsCreateSubdomainOpen(true)}
            >
              <Layers className="h-4 w-4" />
              New Subdomain
            </Button>
          </div>
        </PageHeader>
        {/* Records Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 md:gap-4 mb-8">
          {recordTypes.map((recordType) => {
            let count = 0;
            if (recordType.value === "MX") {
              count = isSubdomainScope
                ? MXRecordsSub?.length || 0
                : MXRecords?.length || 0;
            } else if (recordType.value === "SRV") {
              count = isSubdomainScope
                ? SRVRecordsSub?.length || 0
                : SRVRecords?.length || 0;
            } else {
              count = allRecords.filter(
                (r) => "type" in r && r.type === recordType.value
              ).length;
            }
            const IconComponent = recordType.icon;

            const getRecordColor = () => {
              // Use global CSS colors instead of specific color classes
              return "text-primary";
            };

            return (
              <Card
                key={recordType.value}
                className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-transparent hover:border-l-primary"
              >
                <CardContent className="p-3 md:p-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <IconComponent
                        className={`h-4 w-4 md:h-5 md:w-5 ${getRecordColor()}`}
                      />
                      <Badge
                        variant={count > 0 ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {count}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-semibold text-xs md:text-sm text-foreground">
                        {recordType.label}
                      </p>
                      <p className="text-xs text-muted-foreground hidden md:block">
                        {recordType.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        {/* Records Table */}
        <Card className="shadow-lg border bg-card">
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Shield className="h-5 w-5 text-primary" />
              DNS Records
              {allRecords.length > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {allRecords.length} total
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {allRecords.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="max-w-sm mx-auto">
                  <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    No DNS Records
                  </h3>
                  <p className="text-muted-foreground mb-6 text-sm">
                    Get started by adding your first DNS record to manage your
                    domain
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button
                      onClick={handleAddRecord}
                      className="shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add DNS Record
                    </Button>
                    <Button onClick={handleAddMXRecord} variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Add MX Record
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {allRecords.map((record, recordIndex) => {
                  const getRecordDisplay = () => {
                    if (
                      "priority" in record &&
                      "value" in record &&
                      !("weight" in record)
                    ) {
                      // MX Record
                      const mxRecord = record as MXRecord & { type: string };
                      return (
                        <div className="space-y-1">
                          <p className="font-medium text-foreground text-sm md:text-base">
                            <span className="text-primary font-mono">
                              {mxRecord.priority}
                            </span>{" "}
                            <span className="break-all">{mxRecord.value}</span>
                          </p>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            Mail Exchange Record
                          </p>
                        </div>
                      );
                    } else if (
                      "priority" in record &&
                      "weight" in record &&
                      "port" in record &&
                      "target" in record
                    ) {
                      // SRV Record
                      const srvRecord = record as SRVRecord & { type: string };
                      return (
                        <div className="space-y-1">
                          <p className="font-medium text-foreground text-sm md:text-base">
                            <span className="text-primary font-mono">
                              {srvRecord.priority}/{srvRecord.weight}/
                              {srvRecord.port}
                            </span>{" "}
                            <span className="break-all">
                              {srvRecord.target}
                            </span>
                          </p>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            Service Record
                          </p>
                        </div>
                      );
                    } else {
                      // Standard DNS Record
                      const dnsRecord = record as DNSRecord;
                      return (
                        <div className="space-y-1">
                          <p className="font-medium text-foreground text-sm md:text-base break-all">
                            {dnsRecord.value}
                          </p>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            {
                              recordTypes.find(
                                (rt) => rt.value === dnsRecord.type
                              )?.description
                            }
                          </p>
                        </div>
                      );
                    }
                  };

                  const getRecordType = () => {
                    if (
                      "priority" in record &&
                      "value" in record &&
                      !("weight" in record)
                    ) {
                      return "MX";
                    } else if (
                      "priority" in record &&
                      "weight" in record &&
                      "port" in record &&
                      "target" in record
                    ) {
                      return "SRV";
                    } else {
                      return (record as DNSRecord).type;
                    }
                  };

                  const recordType = getRecordType();

                  const getTypeColor = (type: string) => {
                    switch (type) {
                      case "A":
                        return "bg-chart-4/20 text-chart-4 border-chart-4/30";
                      case "AAAA":
                        return "bg-chart-2/20 text-chart-2 border-chart-2/30";
                      case "CNAME":
                        return "bg-chart-3/20 text-chart-3 border-chart-3/30";
                      case "TXT":
                        return "bg-chart-1/20 text-chart-1 border-chart-1/30";
                      case "NS":
                        return "bg-chart-5/20 text-chart-5 border-chart-5/30";
                      case "MX":
                        return "bg-accent/50 text-accent-foreground border-accent";
                      case "SRV":
                        return "bg-secondary/50 text-secondary-foreground border-secondary";
                      default:
                        return "bg-muted/50 text-muted-foreground border-border";
                    }
                  };

                  return (
                    <div
                      key={`${recordType}-${record.index}-${recordIndex}`}
                      className="flex flex-col md:flex-row md:items-center md:justify-between p-4 md:p-6 hover:bg-muted/50 transition-colors duration-200 space-y-3 md:space-y-0"
                    >
                      <div className="flex items-start md:items-center gap-3 md:gap-4 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {getRecordIcon(recordType)}
                          <Badge
                            variant="outline"
                            className={`text-xs font-medium ${getTypeColor(
                              recordType
                            )}`}
                          >
                            {recordType}
                          </Badge>
                        </div>
                        <div className="flex-1 min-w-0">
                          {getRecordDisplay()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 md:ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditRecord(record)}
                          className="hover:bg-accent hover:text-accent-foreground"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="hidden sm:ml-1 sm:inline">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteRecord(record)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="hidden sm:ml-1 sm:inline">
                            Delete
                          </span>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
        {/* Create Subdomain Dialog */}
        <Dialog
          open={isCreateSubdomainOpen}
          onOpenChange={setIsCreateSubdomainOpen}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-xl font-semibold flex items-center gap-3">
                <Layers className="h-5 w-5 text-primary" />
                Create Subdomain
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Define a new subdomain under {resolvedDomain} and secure it with
                your owner password.
              </p>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="subdomainLabel" className="text-sm font-medium">
                  Subdomain Label
                </Label>
                <Input
                  id="subdomainLabel"
                  placeholder="e.g., blog"
                  value={newSubdomain.label}
                  onChange={(e) =>
                    setNewSubdomain({
                      ...newSubdomain,
                      label: e.target.value,
                    })
                  }
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">
                  Full address will be {newSubdomain.label || "your-label"}.
                  {resolvedDomain}
                </p>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="subdomainPassword"
                  className="text-sm font-medium"
                >
                  Password
                </Label>
                <Input
                  id="subdomainPassword"
                  type="password"
                  placeholder="Enter your domain password"
                  value={newSubdomain.password}
                  onChange={(e) =>
                    setNewSubdomain({
                      ...newSubdomain,
                      password: e.target.value,
                    })
                  }
                  className="h-11"
                />
              </div>
            </div>
            <DialogFooter className="gap-3 pt-4">
              <Button
                variant="outline"
                onClick={resetSubdomainForm}
                className="flex-1"
              >
                Cancel
              </Button>
              <TransactionButton
                className="flex-1"
                transaction={() => {
                  const label = newSubdomain.label.trim();
                  return prepareContractCall({
                    contract,
                    method:
                      "function createSubdomain(string label, string _password)",
                    params: [label, newSubdomain.password],
                  });
                }}
                onTransactionConfirmed={() => {
                  const label = newSubdomain.label.trim();
                  toast.success(
                    `${label}.${resolvedDomain} created successfully`
                  );
                  resetSubdomainForm();
                  setSelectedScope("subdomain");
                  setActiveSubdomain(label);
                  refetchAllRecords();
                }}
                onError={(error) => {
                  toast.error("Failed to create subdomain");
                  console.error(error);
                }}
                disabled={!newSubdomain.label.trim() || !newSubdomain.password}
              >
                Create Subdomain
              </TransactionButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Record Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-xl font-semibold flex items-center gap-3">
                <Plus className="h-5 w-5 text-primary" />
                Add DNS Record
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Create a new DNS record for your domain
              </p>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="recordType" className="text-sm font-medium">
                  Record Type
                </Label>
                <Select
                  value={newRecord.type}
                  onValueChange={(value) =>
                    setNewRecord({ ...newRecord, type: value })
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {recordTypes
                      .filter(
                        (type) => type.value !== "MX" && type.value !== "SRV"
                      )
                      .map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-3 py-1">
                            <type.icon className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{type.label}</div>
                              <div className="text-xs text-muted-foreground">
                                {type.description}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="recordValue" className="text-sm font-medium">
                  Record Value
                </Label>
                <Input
                  id="recordValue"
                  placeholder="Enter record value (e.g., 192.168.1.1)"
                  value={newRecord.value}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, value: e.target.value })
                  }
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your domain password"
                  value={newRecord.password}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, password: e.target.value })
                  }
                  className="h-11"
                />
              </div>
            </div>
            <DialogFooter className="gap-3 pt-4">
              <Button
                variant="outline"
                onClick={resetAddForm}
                className="flex-1"
              >
                Cancel
              </Button>
              <TransactionButton
                className="flex-1"
                transaction={() => {
                  const baseParams = [
                    newRecord.type,
                    newRecord.value,
                    newRecord.password,
                  ] as const;

                  if (selectedScope === "subdomain" && activeSubdomain) {
                    return prepareContractCall({
                      contract,
                      method:
                        "function addSubdomainRecord(string label, string recordType, string value, string _password)",
                      params: [activeSubdomain, ...baseParams],
                    });
                  }

                  return prepareContractCall({
                    contract,
                    method:
                      "function addRecord(string recordType, string value, string _password)",
                    params: [...baseParams],
                  });
                }}
                onTransactionConfirmed={() => {
                  toast.success("DNS record added successfully");
                  resetAddForm();
                  refetchAllRecords();
                }}
                onError={(error) => {
                  toast.error("Failed to add DNS record");
                  console.error(error);
                }}
                disabled={
                  !newRecord.value ||
                  !newRecord.password ||
                  (selectedScope === "subdomain" && !activeSubdomain)
                }
              >
                Add Record
              </TransactionButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Edit Record Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-xl font-semibold flex items-center gap-3">
                <Edit className="h-5 w-5 text-primary" />
                Edit DNS Record
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Update the DNS record for your domain
              </p>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Record Type</Label>
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                  {getRecordIcon(editRecord.type)}
                  <Badge variant="outline" className="text-sm">
                    {editRecord.type}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="editRecordValue"
                  className="text-sm font-medium"
                >
                  Record Value
                </Label>
                <Input
                  id="editRecordValue"
                  placeholder="Enter record value"
                  value={editRecord.value}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, value: e.target.value })
                  }
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPassword" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="editPassword"
                  type="password"
                  placeholder="Enter your domain password"
                  value={editRecord.password}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, password: e.target.value })
                  }
                  className="h-11"
                />
              </div>
            </div>
            <DialogFooter className="gap-3 pt-4">
              <Button
                variant="outline"
                onClick={resetEditForm}
                className="flex-1"
              >
                Cancel
              </Button>
              <TransactionButton
                className="flex-1"
                transaction={() => {
                  const params = [
                    editRecord.type,
                    BigInt(editRecord.index),
                    editRecord.value,
                    editRecord.password,
                  ] as const;

                  if (selectedScope === "subdomain" && activeSubdomain) {
                    return prepareContractCall({
                      contract,
                      method:
                        "function updateSubdomainRecord(string label, string recordType, uint256 index, string newValue, string _password)",
                      params: [activeSubdomain, ...params],
                    });
                  }

                  return prepareContractCall({
                    contract,
                    method:
                      "function updateRecord(string recordType, uint256 index, string newValue, string _password)",
                    params: [...params],
                  });
                }}
                onTransactionConfirmed={() => {
                  toast.success("DNS record updated successfully");
                  resetEditForm();
                  refetchAllRecords();
                }}
                onError={(error) => {
                  toast.error("Failed to update DNS record");
                  console.error(error);
                }}
                disabled={
                  !editRecord.value ||
                  !editRecord.password ||
                  (selectedScope === "subdomain" && !activeSubdomain)
                }
              >
                Update Record
              </TransactionButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Add MX Record Dialog */}
        <Dialog open={isMXDialogOpen} onOpenChange={setIsMXDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-xl font-semibold flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                Add MX Record
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Configure mail exchange records for your domain
              </p>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="mxPriority" className="text-sm font-medium">
                  Priority
                </Label>
                <Input
                  id="mxPriority"
                  type="number"
                  placeholder="e.g., 10"
                  value={newMXRecord.priority}
                  onChange={(e) =>
                    setNewMXRecord({
                      ...newMXRecord,
                      priority: Number(e.target.value),
                    })
                  }
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">
                  Lower numbers have higher priority
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mxValue" className="text-sm font-medium">
                  Mail Server
                </Label>
                <Input
                  id="mxValue"
                  placeholder="e.g., mail.example.com"
                  value={newMXRecord.value}
                  onChange={(e) =>
                    setNewMXRecord({ ...newMXRecord, value: e.target.value })
                  }
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mxPassword" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="mxPassword"
                  type="password"
                  placeholder="Enter your domain password"
                  value={newMXRecord.password}
                  onChange={(e) =>
                    setNewMXRecord({ ...newMXRecord, password: e.target.value })
                  }
                  className="h-11"
                />
              </div>
            </div>
            <DialogFooter className="gap-3 pt-4">
              <Button
                variant="outline"
                onClick={resetMXForm}
                className="flex-1"
              >
                Cancel
              </Button>
              <TransactionButton
                className="flex-1"
                transaction={() => {
                  const params = [
                    BigInt(newMXRecord.priority),
                    newMXRecord.value,
                    newMXRecord.password,
                  ] as const;

                  if (selectedScope === "subdomain" && activeSubdomain) {
                    return prepareContractCall({
                      contract,
                      method:
                        "function addSubdomainMX(string label, uint256 priority, string value, string _password)",
                      params: [activeSubdomain, ...params],
                    });
                  }

                  return prepareContractCall({
                    contract,
                    method:
                      "function addMX(uint256 priority, string value, string _password)",
                    params: [...params],
                  });
                }}
                onTransactionConfirmed={() => {
                  toast.success("MX record added successfully");
                  resetMXForm();
                  refetchAllRecords();
                }}
                onError={(error) => {
                  toast.error("Failed to add MX record");
                  console.error(error);
                }}
                disabled={
                  !newMXRecord.value ||
                  !newMXRecord.password ||
                  (selectedScope === "subdomain" && !activeSubdomain)
                }
              >
                Add MX Record
              </TransactionButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Add SRV Record Dialog */}
        <Dialog open={isSRVDialogOpen} onOpenChange={setIsSRVDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-xl font-semibold flex items-center gap-3">
                <Database className="h-5 w-5 text-primary" />
                Add SRV Record
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Configure service records for your domain
              </p>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="srvPriority" className="text-sm font-medium">
                    Priority
                  </Label>
                  <Input
                    id="srvPriority"
                    type="number"
                    placeholder="e.g., 10"
                    value={newSRVRecord.priority}
                    onChange={(e) =>
                      setNewSRVRecord({
                        ...newSRVRecord,
                        priority: Number(e.target.value),
                      })
                    }
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="srvWeight" className="text-sm font-medium">
                    Weight
                  </Label>
                  <Input
                    id="srvWeight"
                    type="number"
                    placeholder="e.g., 20"
                    value={newSRVRecord.weight}
                    onChange={(e) =>
                      setNewSRVRecord({
                        ...newSRVRecord,
                        weight: Number(e.target.value),
                      })
                    }
                    className="h-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="srvPort" className="text-sm font-medium">
                  Port
                </Label>
                <Input
                  id="srvPort"
                  type="number"
                  placeholder="e.g., 80"
                  value={newSRVRecord.port}
                  onChange={(e) =>
                    setNewSRVRecord({
                      ...newSRVRecord,
                      port: Number(e.target.value),
                    })
                  }
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="srvTarget" className="text-sm font-medium">
                  Target
                </Label>
                <Input
                  id="srvTarget"
                  placeholder="e.g., server.example.com"
                  value={newSRVRecord.target}
                  onChange={(e) =>
                    setNewSRVRecord({ ...newSRVRecord, target: e.target.value })
                  }
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="srvPassword" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="srvPassword"
                  type="password"
                  placeholder="Enter your domain password"
                  value={newSRVRecord.password}
                  onChange={(e) =>
                    setNewSRVRecord({
                      ...newSRVRecord,
                      password: e.target.value,
                    })
                  }
                  className="h-11"
                />
              </div>
            </div>
            <DialogFooter className="gap-3 pt-4">
              <Button
                variant="outline"
                onClick={resetSRVForm}
                className="flex-1"
              >
                Cancel
              </Button>
              <TransactionButton
                className="flex-1"
                transaction={() => {
                  const params = [
                    BigInt(newSRVRecord.priority),
                    BigInt(newSRVRecord.weight),
                    BigInt(newSRVRecord.port),
                    newSRVRecord.target,
                    newSRVRecord.password,
                  ] as const;

                  if (selectedScope === "subdomain" && activeSubdomain) {
                    return prepareContractCall({
                      contract,
                      method:
                        "function addSubdomainSRV(string label, uint256 priority, uint256 weight, uint256 port, string target, string _password)",
                      params: [activeSubdomain, ...params],
                    });
                  }

                  return prepareContractCall({
                    contract,
                    method:
                      "function addSRV(uint256 priority, uint256 weight, uint256 port, string target, string _password)",
                    params: [...params],
                  });
                }}
                onTransactionConfirmed={() => {
                  toast.success("SRV record added successfully");
                  resetSRVForm();
                  refetchAllRecords();
                }}
                onError={(error) => {
                  toast.error("Failed to add SRV record");
                  console.error(error);
                }}
                disabled={
                  !newSRVRecord.target ||
                  !newSRVRecord.password ||
                  (selectedScope === "subdomain" && !activeSubdomain)
                }
              >
                Add SRV Record
              </TransactionButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Edit MX Record Dialog */}
        <Dialog open={isEditMXDialogOpen} onOpenChange={setIsEditMXDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-xl font-semibold flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                Edit MX Record
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Update the mail exchange record for your domain
              </p>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="editMxPriority" className="text-sm font-medium">
                  Priority
                </Label>
                <Input
                  id="editMxPriority"
                  type="number"
                  placeholder="e.g., 10"
                  value={editMXRecord.priority}
                  onChange={(e) =>
                    setEditMXRecord({
                      ...editMXRecord,
                      priority: Number(e.target.value),
                    })
                  }
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">
                  Lower numbers have higher priority
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editMxValue" className="text-sm font-medium">
                  Mail Server
                </Label>
                <Input
                  id="editMxValue"
                  placeholder="e.g., mail.example.com"
                  value={editMXRecord.value}
                  onChange={(e) =>
                    setEditMXRecord({ ...editMXRecord, value: e.target.value })
                  }
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editMxPassword" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="editMxPassword"
                  type="password"
                  placeholder="Enter your domain password"
                  value={editMXRecord.password}
                  onChange={(e) =>
                    setEditMXRecord({
                      ...editMXRecord,
                      password: e.target.value,
                    })
                  }
                  className="h-11"
                />
              </div>
            </div>
            <DialogFooter className="gap-3 pt-4">
              <Button
                variant="outline"
                onClick={resetEditMXForm}
                className="flex-1"
              >
                Cancel
              </Button>
              <TransactionButton
                className="flex-1"
                transaction={() => {
                  const mxParams = [
                    BigInt(editMXRecord.index),
                    BigInt(editMXRecord.priority),
                    editMXRecord.value,
                    editMXRecord.password,
                  ] as const;

                  if (selectedScope === "subdomain" && activeSubdomain) {
                    return prepareContractCall({
                      contract,
                      method:
                        "function updateSubdomainMX(string label, uint256 index, uint256 priority, string value, string _password)",
                      params: [activeSubdomain, ...mxParams],
                    });
                  }

                  return prepareContractCall({
                    contract,
                    method:
                      "function updateMX(uint256 index, uint256 priority, string value, string _password)",
                    params: mxParams,
                  });
                }}
                onTransactionConfirmed={() => {
                  toast.success("MX record updated successfully");
                  resetEditMXForm();
                  refetchAllRecords();
                }}
                onError={(error) => {
                  toast.error("Failed to update MX record");
                  console.error(error);
                }}
                disabled={
                  !editMXRecord.value ||
                  !editMXRecord.password ||
                  (selectedScope === "subdomain" && !activeSubdomain)
                }
              >
                Update MX Record
              </TransactionButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Edit SRV Record Dialog */}
        <Dialog
          open={isEditSRVDialogOpen}
          onOpenChange={setIsEditSRVDialogOpen}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-xl font-semibold flex items-center gap-3">
                <Database className="h-5 w-5 text-primary" />
                Edit SRV Record
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Update the service record for your domain
              </p>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="editSrvPriority"
                    className="text-sm font-medium"
                  >
                    Priority
                  </Label>
                  <Input
                    id="editSrvPriority"
                    type="number"
                    placeholder="e.g., 10"
                    value={editSRVRecord.priority}
                    onChange={(e) =>
                      setEditSRVRecord({
                        ...editSRVRecord,
                        priority: Number(e.target.value),
                      })
                    }
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="editSrvWeight"
                    className="text-sm font-medium"
                  >
                    Weight
                  </Label>
                  <Input
                    id="editSrvWeight"
                    type="number"
                    placeholder="e.g., 20"
                    value={editSRVRecord.weight}
                    onChange={(e) =>
                      setEditSRVRecord({
                        ...editSRVRecord,
                        weight: Number(e.target.value),
                      })
                    }
                    className="h-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editSrvPort" className="text-sm font-medium">
                  Port
                </Label>
                <Input
                  id="editSrvPort"
                  type="number"
                  placeholder="e.g., 80"
                  value={editSRVRecord.port}
                  onChange={(e) =>
                    setEditSRVRecord({
                      ...editSRVRecord,
                      port: Number(e.target.value),
                    })
                  }
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editSrvTarget" className="text-sm font-medium">
                  Target
                </Label>
                <Input
                  id="editSrvTarget"
                  placeholder="e.g., server.example.com"
                  value={editSRVRecord.target}
                  onChange={(e) =>
                    setEditSRVRecord({
                      ...editSRVRecord,
                      target: e.target.value,
                    })
                  }
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="editSrvPassword"
                  className="text-sm font-medium"
                >
                  Password
                </Label>
                <Input
                  id="editSrvPassword"
                  type="password"
                  placeholder="Enter your domain password"
                  value={editSRVRecord.password}
                  onChange={(e) =>
                    setEditSRVRecord({
                      ...editSRVRecord,
                      password: e.target.value,
                    })
                  }
                  className="h-11"
                />
              </div>
            </div>
            <DialogFooter className="gap-3 pt-4">
              <Button
                variant="outline"
                onClick={resetEditSRVForm}
                className="flex-1"
              >
                Cancel
              </Button>
              <TransactionButton
                className="flex-1"
                transaction={() => {
                  const srvParams = [
                    BigInt(editSRVRecord.index),
                    BigInt(editSRVRecord.priority),
                    BigInt(editSRVRecord.weight),
                    BigInt(editSRVRecord.port),
                    editSRVRecord.target,
                    editSRVRecord.password,
                  ] as const;

                  if (selectedScope === "subdomain" && activeSubdomain) {
                    return prepareContractCall({
                      contract,
                      method:
                        "function updateSubdomainSRV(string label, uint256 index, uint256 priority, uint256 weight, uint256 port, string target, string _password)",
                      params: [activeSubdomain, ...srvParams],
                    });
                  }

                  return prepareContractCall({
                    contract,
                    method:
                      "function updateSRV(uint256 index, uint256 priority, uint256 weight, uint256 port, string target, string _password)",
                    params: srvParams,
                  });
                }}
                onTransactionConfirmed={() => {
                  toast.success("SRV record updated successfully");
                  resetEditSRVForm();
                  refetchAllRecords();
                }}
                onError={(error) => {
                  toast.error("Failed to update SRV record");
                  console.error(error);
                }}
                disabled={
                  !editSRVRecord.target ||
                  !editSRVRecord.password ||
                  (selectedScope === "subdomain" && !activeSubdomain)
                }
              >
                Update SRV Record
              </TransactionButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteAlert.isOpen}
          onOpenChange={(open) =>
            setDeleteAlert({
              isOpen: open,
              record: deleteAlert.record,
              recordType: deleteAlert.recordType,
            })
          }
        >
          <DialogContent className="max-w-lg">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-xl font-semibold flex items-center gap-3">
                <Trash2 className="h-5 w-5 text-destructive" />
                Delete DNS Record
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. Please confirm the deletion.
              </p>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                <div className="text-sm text-foreground space-y-2">
                  {deleteAlert.recordType === "mx" &&
                    deleteAlert.record &&
                    "priority" in deleteAlert.record &&
                    "value" in deleteAlert.record && (
                      <div className="space-y-1">
                        <p className="font-medium">MX Record Details:</p>
                        <p>
                          <strong>Priority:</strong>{" "}
                          {(deleteAlert.record as MXRecord).priority}
                        </p>
                        <p>
                          <strong>Mail Server:</strong>{" "}
                          {(deleteAlert.record as MXRecord).value}
                        </p>
                      </div>
                    )}
                  {deleteAlert.recordType === "srv" &&
                    deleteAlert.record &&
                    "priority" in deleteAlert.record &&
                    "weight" in deleteAlert.record && (
                      <div className="space-y-1">
                        <p className="font-medium">SRV Record Details:</p>
                        <p>
                          <strong>Priority/Weight/Port:</strong>{" "}
                          {(deleteAlert.record as SRVRecord).priority}/
                          {(deleteAlert.record as SRVRecord).weight}/
                          {(deleteAlert.record as SRVRecord).port}
                        </p>
                        <p>
                          <strong>Target:</strong>{" "}
                          {(deleteAlert.record as SRVRecord).target}
                        </p>
                      </div>
                    )}
                  {deleteAlert.recordType === "standard" &&
                    deleteAlert.record &&
                    "type" in deleteAlert.record && (
                      <div className="space-y-1">
                        <p className="font-medium">
                          {(deleteAlert.record as DNSRecord).type} Record
                          Details:
                        </p>
                        <p>
                          <strong>Value:</strong>{" "}
                          {(deleteAlert.record as DNSRecord).value}
                        </p>
                      </div>
                    )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deletePassword" className="text-sm font-medium">
                  Password Confirmation
                </Label>
                <Input
                  id="deletePassword"
                  type="password"
                  placeholder="Enter your domain password to confirm deletion"
                  value={editRecord.password}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, password: e.target.value })
                  }
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">
                  Enter your domain password to confirm this deletion
                </p>
              </div>
            </div>
            <DialogFooter className="gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteAlert({
                    isOpen: false,
                    record: null,
                    recordType: "standard",
                  });
                  setEditRecord({ ...editRecord, password: "" });
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <TransactionButton
                className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                transaction={() => {
                  if (!deleteAlert.record) {
                    throw new Error("No record selected for deletion");
                  }

                  if (deleteAlert.recordType === "mx") {
                    const mxParams = [
                      BigInt(deleteAlert.record.index),
                      editRecord.password,
                    ] as const;

                    if (selectedScope === "subdomain" && activeSubdomain) {
                      return prepareContractCall({
                        contract,
                        method:
                          "function deleteSubdomainMX(string label, uint256 index, string _password)",
                        params: [activeSubdomain, ...mxParams],
                      });
                    }

                    return prepareContractCall({
                      contract,
                      method:
                        "function deleteMX(uint256 index, string _password)",
                      params: mxParams,
                    });
                  }

                  if (deleteAlert.recordType === "srv") {
                    const srvParams = [
                      BigInt(deleteAlert.record.index),
                      editRecord.password,
                    ] as const;

                    if (selectedScope === "subdomain" && activeSubdomain) {
                      return prepareContractCall({
                        contract,
                        method:
                          "function deleteSubdomainSRV(string label, uint256 index, string _password)",
                        params: [activeSubdomain, ...srvParams],
                      });
                    }

                    return prepareContractCall({
                      contract,
                      method:
                        "function deleteSRV(uint256 index, string _password)",
                      params: srvParams,
                    });
                  }

                  const record = deleteAlert.record as DNSRecord;
                  const standardParams = [
                    record.type,
                    BigInt(record.index),
                    editRecord.password,
                  ] as const;

                  if (selectedScope === "subdomain" && activeSubdomain) {
                    return prepareContractCall({
                      contract,
                      method:
                        "function deleteSubdomainRecord(string label, string recordType, uint256 index, string _password)",
                      params: [activeSubdomain, ...standardParams],
                    });
                  }

                  return prepareContractCall({
                    contract,
                    method:
                      "function deleteRecord(string recordType, uint256 index, string _password)",
                    params: standardParams,
                  });
                }}
                onTransactionConfirmed={() => {
                  toast.success("DNS record deleted successfully");
                  setDeleteAlert({
                    isOpen: false,
                    record: null,
                    recordType: "standard",
                  });
                  setEditRecord({ ...editRecord, password: "" });
                  refetchAllRecords();
                }}
                onError={(error) => {
                  toast.error("Failed to delete DNS record");
                  console.error(error);
                }}
                disabled={
                  !editRecord.password ||
                  (selectedScope === "subdomain" && !activeSubdomain)
                }
              >
                Delete Record
              </TransactionButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DNSManagementDashboard;
