"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
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
} from "lucide-react";

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
    address: domainAddress as string,
    chain: sepolia,
  });

  // Read all record types
  const { data: ARecords, refetch: refetchA } = useReadContract({
    contract,
    method: "function getRecord(string recordType) view returns (string[])",
    params: ["A"],
  });

  const { data: AAAARecords, refetch: refetchAAAA } = useReadContract({
    contract,
    method: "function getRecord(string recordType) view returns (string[])",
    params: ["AAAA"],
  });

  const { data: CNAMERecords, refetch: refetchCNAME } = useReadContract({
    contract,
    method: "function getRecord(string recordType) view returns (string[])",
    params: ["CNAME"],
  });

  const { data: TXTRecords, refetch: refetchTXT } = useReadContract({
    contract,
    method: "function getRecord(string recordType) view returns (string[])",
    params: ["TXT"],
  });

  const { data: NSRecords, refetch: refetchNS } = useReadContract({
    contract,
    method: "function getRecord(string recordType) view returns (string[])",
    params: ["NS"],
  });

  // Read MX records
  const { data: MXRecords, refetch: refetchMX } = useReadContract({
    contract,
    method:
      "function getMX() view returns ((uint256 priority, string value)[])",
    params: [],
  });

  // Read SRV records
  const { data: SRVRecords, refetch: refetchSRV } = useReadContract({
    contract,
    method:
      "function getSRV() view returns ((uint256 priority, uint256 weight, uint256 port, string target)[])",
    params: [],
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

    ARecords?.forEach((value, index) => {
      records.push({ type: "A", value, index });
    });

    AAAARecords?.forEach((value, index) => {
      records.push({ type: "AAAA", value, index });
    });

    CNAMERecords?.forEach((value, index) => {
      records.push({ type: "CNAME", value, index });
    });

    TXTRecords?.forEach((value, index) => {
      records.push({ type: "TXT", value, index });
    });

    NSRecords?.forEach((value, index) => {
      records.push({ type: "NS", value, index });
    });

    MXRecords?.forEach((record, index) => {
      records.push({
        priority: Number(record.priority),
        value: record.value,
        index,
        type: "MX",
      } as MXRecord & { type: string });
    });

    SRVRecords?.forEach((record, index) => {
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

  return (
    <div className="min-h-screen bg-background mt-20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
              DNS Management
            </h1>
            <p className="text-sm md:text-base text-muted-foreground break-all lg:break-normal">
              Manage DNS records for domain:{" "}
              <span className="font-mono text-primary">{domainAddress}</span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              onClick={handleAddRecord}
              className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Record</span>
              <span className="sm:hidden">Add DNS</span>
            </Button>
            <Button
              onClick={handleAddMXRecord}
              variant="outline"
              className="flex items-center justify-center gap-2 hover:bg-accent hover:text-accent-foreground"
            >
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Add MX</span>
              <span className="sm:hidden">MX</span>
            </Button>
            <Button
              onClick={handleAddSRVRecord}
              variant="outline"
              className="flex items-center justify-center gap-2 hover:bg-accent hover:text-accent-foreground"
            >
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Add SRV</span>
              <span className="sm:hidden">SRV</span>
            </Button>
          </div>
        </div>

        {/* Records Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 md:gap-4 mb-8">
          {recordTypes.map((recordType) => {
            let count = 0;
            if (recordType.value === "MX") {
              count = MXRecords?.length || 0;
            } else if (recordType.value === "SRV") {
              count = SRVRecords?.length || 0;
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
        <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
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
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
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
                            <span className="text-accent-foreground font-mono">
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
                            <span className="text-secondary-foreground font-mono">
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
                      className="flex flex-col md:flex-row md:items-center md:justify-between p-4 md:p-6 hover:bg-muted/30 transition-colors duration-200 space-y-3 md:space-y-0"
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
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
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
                transaction={() =>
                  prepareContractCall({
                    contract,
                    method:
                      "function addRecord(string recordType, string value, string _password)",
                    params: [
                      newRecord.type,
                      newRecord.value,
                      newRecord.password,
                    ],
                  })
                }
                onTransactionConfirmed={() => {
                  toast.success("DNS record added successfully");
                  resetAddForm();
                  refetchAllRecords();
                }}
                onError={(error) => {
                  toast.error("Failed to add DNS record");
                  console.error(error);
                }}
                disabled={!newRecord.value || !newRecord.password}
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
                transaction={() =>
                  prepareContractCall({
                    contract,
                    method:
                      "function updateRecord(string recordType, uint256 index, string newValue, string _password)",
                    params: [
                      editRecord.type,
                      BigInt(editRecord.index),
                      editRecord.value,
                      editRecord.password,
                    ],
                  })
                }
                onTransactionConfirmed={() => {
                  toast.success("DNS record updated successfully");
                  resetEditForm();
                  refetchAllRecords();
                }}
                onError={(error) => {
                  toast.error("Failed to update DNS record");
                  console.error(error);
                }}
                disabled={!editRecord.value || !editRecord.password}
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
                transaction={() =>
                  prepareContractCall({
                    contract,
                    method:
                      "function addMX(uint256 priority, string value, string _password)",
                    params: [
                      BigInt(newMXRecord.priority),
                      newMXRecord.value,
                      newMXRecord.password,
                    ],
                  })
                }
                onTransactionConfirmed={() => {
                  toast.success("MX record added successfully");
                  resetMXForm();
                  refetchAllRecords();
                }}
                onError={(error) => {
                  toast.error("Failed to add MX record");
                  console.error(error);
                }}
                disabled={!newMXRecord.value || !newMXRecord.password}
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
                transaction={() =>
                  prepareContractCall({
                    contract,
                    method:
                      "function addSRV(uint256 priority, uint256 weight, uint256 port, string target, string _password)",
                    params: [
                      BigInt(newSRVRecord.priority),
                      BigInt(newSRVRecord.weight),
                      BigInt(newSRVRecord.port),
                      newSRVRecord.target,
                      newSRVRecord.password,
                    ],
                  })
                }
                onTransactionConfirmed={() => {
                  toast.success("SRV record added successfully");
                  resetSRVForm();
                  refetchAllRecords();
                }}
                onError={(error) => {
                  toast.error("Failed to add SRV record");
                  console.error(error);
                }}
                disabled={!newSRVRecord.target || !newSRVRecord.password}
              >
                Add SRV Record
              </TransactionButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit MX Record Dialog */}
        <Dialog open={isEditMXDialogOpen} onOpenChange={setIsEditMXDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Edit MX Record
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editMxPriority">Priority</Label>
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
                />
              </div>
              <div>
                <Label htmlFor="editMxValue">Mail Server</Label>
                <Input
                  id="editMxValue"
                  placeholder="e.g., mail.example.com"
                  value={editMXRecord.value}
                  onChange={(e) =>
                    setEditMXRecord({ ...editMXRecord, value: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="editMxPassword">Password</Label>
                <Input
                  id="editMxPassword"
                  type="password"
                  placeholder="Enter password"
                  value={editMXRecord.password}
                  onChange={(e) =>
                    setEditMXRecord({
                      ...editMXRecord,
                      password: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetEditMXForm}>
                Cancel
              </Button>
              <TransactionButton
                transaction={() =>
                  prepareContractCall({
                    contract,
                    method:
                      "function updateMX(uint256 index, uint256 priority, string value, string _password)",
                    params: [
                      BigInt(editMXRecord.index),
                      BigInt(editMXRecord.priority),
                      editMXRecord.value,
                      editMXRecord.password,
                    ],
                  })
                }
                onTransactionConfirmed={() => {
                  toast.success("MX record updated successfully");
                  resetEditMXForm();
                  refetchAllRecords();
                }}
                onError={(error) => {
                  toast.error("Failed to update MX record");
                  console.error(error);
                }}
                disabled={!editMXRecord.value || !editMXRecord.password}
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
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Edit SRV Record
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editSrvPriority">Priority</Label>
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
                  />
                </div>
                <div>
                  <Label htmlFor="editSrvWeight">Weight</Label>
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
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="editSrvPort">Port</Label>
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
                />
              </div>
              <div>
                <Label htmlFor="editSrvTarget">Target</Label>
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
                />
              </div>
              <div>
                <Label htmlFor="editSrvPassword">Password</Label>
                <Input
                  id="editSrvPassword"
                  type="password"
                  placeholder="Enter password"
                  value={editSRVRecord.password}
                  onChange={(e) =>
                    setEditSRVRecord({
                      ...editSRVRecord,
                      password: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetEditSRVForm}>
                Cancel
              </Button>
              <TransactionButton
                transaction={() =>
                  prepareContractCall({
                    contract,
                    method:
                      "function updateSRV(uint256 index, uint256 priority, uint256 weight, uint256 port, string target, string _password)",
                    params: [
                      BigInt(editSRVRecord.index),
                      BigInt(editSRVRecord.priority),
                      BigInt(editSRVRecord.weight),
                      BigInt(editSRVRecord.port),
                      editSRVRecord.target,
                      editSRVRecord.password,
                    ],
                  })
                }
                onTransactionConfirmed={() => {
                  toast.success("SRV record updated successfully");
                  resetEditSRVForm();
                  refetchAllRecords();
                }}
                onError={(error) => {
                  toast.error("Failed to update SRV record");
                  console.error(error);
                }}
                disabled={!editSRVRecord.target || !editSRVRecord.password}
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
              <DialogTitle className="text-lg font-semibold text-foreground">
                Delete DNS Record
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-4 text-sm text-muted-foreground">
                {deleteAlert.recordType === "mx" &&
                  deleteAlert.record &&
                  "priority" in deleteAlert.record &&
                  "value" in deleteAlert.record && (
                    <div className="space-y-2">
                      <p>Are you sure you want to delete this MX record?</p>
                      <div className="bg-muted p-3 rounded-lg space-y-1">
                        <div>
                          <span className="font-medium text-foreground">
                            Priority:
                          </span>{" "}
                          {(deleteAlert.record as MXRecord).priority}
                        </div>
                        <div>
                          <span className="font-medium text-foreground">
                            Value:
                          </span>{" "}
                          {(deleteAlert.record as MXRecord).value}
                        </div>
                      </div>
                    </div>
                  )}
                {deleteAlert.recordType === "srv" &&
                  deleteAlert.record &&
                  "priority" in deleteAlert.record &&
                  "weight" in deleteAlert.record && (
                    <div className="space-y-2">
                      <p>Are you sure you want to delete this SRV record?</p>
                      <div className="bg-muted p-3 rounded-lg space-y-1">
                        <div>
                          <span className="font-medium text-foreground">
                            Priority/Weight/Port:
                          </span>{" "}
                          {(deleteAlert.record as SRVRecord).priority}/
                          {(deleteAlert.record as SRVRecord).weight}/
                          {(deleteAlert.record as SRVRecord).port}
                        </div>
                        <div>
                          <span className="font-medium text-foreground">
                            Target:
                          </span>{" "}
                          {(deleteAlert.record as SRVRecord).target}
                        </div>
                      </div>
                    </div>
                  )}
                {deleteAlert.recordType === "standard" &&
                  deleteAlert.record &&
                  "type" in deleteAlert.record && (
                    <div className="space-y-2">
                      <p>
                        Are you sure you want to delete this{" "}
                        {(deleteAlert.record as DNSRecord).type} record?
                      </p>
                      <div className="bg-muted p-3 rounded-lg">
                        <div>
                          <span className="font-medium text-foreground">
                            Value:
                          </span>{" "}
                          {(deleteAlert.record as DNSRecord).value}
                        </div>
                      </div>
                    </div>
                  )}
                <p className="text-destructive font-medium">
                  This action cannot be undone.
                </p>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="deletePassword"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </Label>
                <Input
                  id="deletePassword"
                  type="password"
                  placeholder="Enter password to confirm"
                  value={editRecord.password}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, password: e.target.value })
                  }
                  className="h-11"
                />
              </div>
            </div>
            <DialogFooter className="gap-3">
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
              >
                Cancel
              </Button>
              <TransactionButton
                transaction={() => {
                  if (deleteAlert.recordType === "mx") {
                    return prepareContractCall({
                      contract,
                      method:
                        "function deleteMX(uint256 index, string _password)",
                      params: [
                        BigInt(deleteAlert.record!.index),
                        editRecord.password,
                      ],
                    });
                  } else if (deleteAlert.recordType === "srv") {
                    return prepareContractCall({
                      contract,
                      method:
                        "function deleteSRV(uint256 index, string _password)",
                      params: [
                        BigInt(deleteAlert.record!.index),
                        editRecord.password,
                      ],
                    });
                  } else {
                    return prepareContractCall({
                      contract,
                      method:
                        "function deleteRecord(string recordType, uint256 index, string _password)",
                      params: [
                        (deleteAlert.record as DNSRecord).type,
                        BigInt(deleteAlert.record!.index),
                        editRecord.password,
                      ],
                    });
                  }
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
                disabled={!editRecord.password}
                className="bg-red-600 hover:bg-red-700 text-white"
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
