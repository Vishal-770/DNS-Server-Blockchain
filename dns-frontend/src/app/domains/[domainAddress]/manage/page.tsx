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

  // Note: SRV records might be handled via standard record functions
  // depending on the contract implementation

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

    // Note: SRV records might need to be handled differently if there's no dedicated getSRV function
    // For now, treating SRV as standard records
    // SRVRecords?.forEach((record, index) => {
    //   records.push({
    //     priority: Number(record.priority),
    //     weight: Number(record.weight),
    //     port: Number(record.port),
    //     target: record.target,
    //     index,
    //     type: "SRV"
    //   } as SRVRecord & { type: string });
    // });

    return records;
  };

  const refetchAllRecords = () => {
    refetchA();
    refetchAAAA();
    refetchCNAME();
    refetchTXT();
    refetchNS();
    refetchMX();
    // refetchSRV(); // Comment out if SRV is handled as standard records
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
    <div className="container mx-auto px-4 py-8 max-w-6xl mt-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            DNS Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage DNS records for domain: {domainAddress}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAddRecord} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Record
          </Button>
          <Button
            onClick={handleAddMXRecord}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            Add MX
          </Button>
          <Button
            onClick={handleAddSRVRecord}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Database className="h-4 w-4" />
            Add SRV
          </Button>
        </div>
      </div>

      {/* Records Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mb-8">
        {recordTypes.map((recordType) => {
          let count = 0;
          if (recordType.value === "MX") {
            count = MXRecords?.length || 0;
          } else if (recordType.value === "SRV") {
            // Count SRV records from standard records if treated as standard
            count = allRecords.filter(
              (r) => "type" in r && r.type === "SRV"
            ).length;
          } else {
            count = allRecords.filter(
              (r) => "type" in r && r.type === recordType.value
            ).length;
          }
          const IconComponent = recordType.icon;

          return (
            <Card key={recordType.value}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-semibold">{recordType.label}</p>
                      <p className="text-xs text-gray-500">
                        {recordType.description}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Records Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            DNS Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          {allRecords.length === 0 ? (
            <div className="text-center py-12">
              <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No DNS Records
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Get started by adding your first DNS record
              </p>
              <Button onClick={handleAddRecord}>
                <Plus className="h-4 w-4 mr-2" />
                Add Record
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
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
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Priority: {mxRecord.priority} | Value:{" "}
                          {mxRecord.value}
                        </p>
                        <p className="text-sm text-gray-500">
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
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {srvRecord.priority}/{srvRecord.weight}/
                          {srvRecord.port} {srvRecord.target}
                        </p>
                        <p className="text-sm text-gray-500">Service Record</p>
                      </div>
                    );
                  } else {
                    // Standard DNS Record
                    const dnsRecord = record as DNSRecord;
                    return (
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {dnsRecord.value}
                        </p>
                        <p className="text-sm text-gray-500">
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

                return (
                  <div
                    key={`${recordType}-${record.index}-${recordIndex}`}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getRecordIcon(recordType)}
                        <Badge variant="outline">{recordType}</Badge>
                      </div>
                      {getRecordDisplay()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditRecord(record)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteRecord(record)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add DNS Record</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="recordType">Record Type</Label>
              <Select
                value={newRecord.type}
                onValueChange={(value) =>
                  setNewRecord({ ...newRecord, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {recordTypes
                    .filter(
                      (type) => type.value !== "MX" && type.value !== "SRV"
                    )
                    .map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="recordValue">Record Value</Label>
              <Input
                id="recordValue"
                placeholder="Enter record value"
                value={newRecord.value}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, value: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={newRecord.password}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, password: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetAddForm}>
              Cancel
            </Button>
            <TransactionButton
              transaction={() =>
                prepareContractCall({
                  contract,
                  method:
                    "function addRecord(string recordType, string value, string _password)",
                  params: [newRecord.type, newRecord.value, newRecord.password],
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit DNS Record</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Record Type</Label>
              <div className="flex items-center gap-2 p-2 border rounded">
                {getRecordIcon(editRecord.type)}
                <Badge variant="outline">{editRecord.type}</Badge>
              </div>
            </div>
            <div>
              <Label htmlFor="editRecordValue">Record Value</Label>
              <Input
                id="editRecordValue"
                placeholder="Enter record value"
                value={editRecord.value}
                onChange={(e) =>
                  setEditRecord({ ...editRecord, value: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="editPassword">Password</Label>
              <Input
                id="editPassword"
                type="password"
                placeholder="Enter password"
                value={editRecord.password}
                onChange={(e) =>
                  setEditRecord({ ...editRecord, password: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetEditForm}>
              Cancel
            </Button>
            <TransactionButton
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Add MX Record
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="mxPriority">Priority</Label>
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
              />
            </div>
            <div>
              <Label htmlFor="mxValue">Mail Server</Label>
              <Input
                id="mxValue"
                placeholder="e.g., mail.example.com"
                value={newMXRecord.value}
                onChange={(e) =>
                  setNewMXRecord({ ...newMXRecord, value: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="mxPassword">Password</Label>
              <Input
                id="mxPassword"
                type="password"
                placeholder="Enter password"
                value={newMXRecord.password}
                onChange={(e) =>
                  setNewMXRecord({ ...newMXRecord, password: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetMXForm}>
              Cancel
            </Button>
            <TransactionButton
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Add SRV Record
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="srvPriority">Priority</Label>
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
                />
              </div>
              <div>
                <Label htmlFor="srvWeight">Weight</Label>
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
                />
              </div>
            </div>
            <div>
              <Label htmlFor="srvPort">Port</Label>
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
              />
            </div>
            <div>
              <Label htmlFor="srvTarget">Target</Label>
              <Input
                id="srvTarget"
                placeholder="e.g., server.example.com"
                value={newSRVRecord.target}
                onChange={(e) =>
                  setNewSRVRecord({ ...newSRVRecord, target: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="srvPassword">Password</Label>
              <Input
                id="srvPassword"
                type="password"
                placeholder="Enter password"
                value={newSRVRecord.password}
                onChange={(e) =>
                  setNewSRVRecord({ ...newSRVRecord, password: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetSRVForm}>
              Cancel
            </Button>
            <TransactionButton
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
                  setEditMXRecord({ ...editMXRecord, password: e.target.value })
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
      <Dialog open={isEditSRVDialogOpen} onOpenChange={setIsEditSRVDialogOpen}>
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
                  setEditSRVRecord({ ...editSRVRecord, target: e.target.value })
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete DNS Record</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {deleteAlert.recordType === "mx" &&
                deleteAlert.record &&
                "priority" in deleteAlert.record &&
                "value" in deleteAlert.record && (
                  <>
                    Are you sure you want to delete this MX record?
                    <br />
                    <strong>Priority:</strong>{" "}
                    {(deleteAlert.record as MXRecord).priority}
                    <br />
                    <strong>Value:</strong>{" "}
                    {(deleteAlert.record as MXRecord).value}
                  </>
                )}
              {deleteAlert.recordType === "srv" &&
                deleteAlert.record &&
                "priority" in deleteAlert.record &&
                "weight" in deleteAlert.record && (
                  <>
                    Are you sure you want to delete this SRV record?
                    <br />
                    <strong>Priority/Weight/Port:</strong>{" "}
                    {(deleteAlert.record as SRVRecord).priority}/
                    {(deleteAlert.record as SRVRecord).weight}/
                    {(deleteAlert.record as SRVRecord).port}
                    <br />
                    <strong>Target:</strong>{" "}
                    {(deleteAlert.record as SRVRecord).target}
                  </>
                )}
              {deleteAlert.recordType === "standard" &&
                deleteAlert.record &&
                "type" in deleteAlert.record && (
                  <>
                    Are you sure you want to delete this{" "}
                    {(deleteAlert.record as DNSRecord).type} record?
                    <br />
                    <strong>Value:</strong>{" "}
                    {(deleteAlert.record as DNSRecord).value}
                  </>
                )}
              <br />
              <br />
              This action cannot be undone.
            </div>
            <div>
              <Label htmlFor="deletePassword">Password</Label>
              <Input
                id="deletePassword"
                type="password"
                placeholder="Enter password to confirm"
                value={editRecord.password}
                onChange={(e) =>
                  setEditRecord({ ...editRecord, password: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
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
  );
};

export default DNSManagementDashboard;
