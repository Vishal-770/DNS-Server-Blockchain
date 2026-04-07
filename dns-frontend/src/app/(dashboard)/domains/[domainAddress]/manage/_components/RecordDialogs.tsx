"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Button } from "@/components/ui/button";
import { TransactionButton } from "thirdweb/react";
import { prepareContractCall, type ThirdwebContract } from "thirdweb";
import { toast } from "sonner";
import { Plus, Edit, Mail, Database, Layers, Globe, ExternalLink, FileText, Server } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// --- Types ---

export interface DNSRecord {
  type: string;
  value: string;
  index: number;
}

export interface MXRecord {
  priority: number;
  value: string;
  index: number;
}

export interface SRVRecord {
  priority: number;
  weight: number;
  port: number;
  target: string;
  index: number;
}

export type RecordData = DNSRecord | MXRecord | SRVRecord | null;

// --- Schemas ---

const domainNameSchema = z.string().regex(/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, "Invalid domain name format");
const ipv4Schema = z.string().ip({ version: "v4", message: "Invalid IPv4 address" });
const ipv6Schema = z.string().ip({ version: "v6", message: "Invalid IPv6 address" });
const passwordSchema = z.string().min(1, "Password is required");

const addRecordSchema = z.object({
  type: z.string(),
  value: z.string().min(1, "Value is required"),
  password: passwordSchema,
}).superRefine((data, ctx) => {
  if (data.type === "A") {
    const res = ipv4Schema.safeParse(data.value);
    if (!res.success) ctx.addIssue({ code: "custom", message: res.error.errors[0].message, path: ["value"] });
  } else if (data.type === "AAAA") {
    const res = ipv6Schema.safeParse(data.value);
    if (!res.success) ctx.addIssue({ code: "custom", message: res.error.errors[0].message, path: ["value"] });
  } else if (["CNAME", "NS"].includes(data.type)) {
    const res = domainNameSchema.safeParse(data.value);
    if (!res.success) ctx.addIssue({ code: "custom", message: "Invalid hostname format", path: ["value"] });
  }
});

const mxRecordSchema = z.object({
  priority: z.coerce.number().min(0, "Priority must be at least 0").max(65535, "Priority must be at most 65535"),
  value: domainNameSchema,
  password: passwordSchema,
});

const srvRecordSchema = z.object({
  priority: z.coerce.number().min(0).max(65535),
  weight: z.coerce.number().min(0).max(65535),
  port: z.coerce.number().min(0).max(65535),
  target: domainNameSchema,
  password: passwordSchema,
});

const subdomainSchema = z.object({
  label: z.string().min(1, "Label is required").regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens allowed"),
  password: passwordSchema,
});

type AddRecordValues = z.infer<typeof addRecordSchema>;
type MXRecordValues = z.infer<typeof mxRecordSchema>;
type SRVRecordValues = z.infer<typeof srvRecordSchema>;
type SubdomainValues = z.infer<typeof subdomainSchema>;

// --- Components ---

interface CommonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contract: ThirdwebContract;
  refetchAllRecords: () => void;
}

interface ScopedDialogProps extends CommonDialogProps {
  selectedScope: "root" | "subdomain";
  activeSubdomain: string | null;
}

const recordTypes = [
  { value: "A", label: "A Record", icon: Globe, description: "IPv4 Address" },
  { value: "AAAA", label: "AAAA Record", icon: Globe, description: "IPv6 Address" },
  { value: "CNAME", label: "CNAME Record", icon: ExternalLink, description: "Canonical Name" },
  { value: "TXT", label: "TXT Record", icon: FileText, description: "Text Record" },
  { value: "NS", label: "NS Record", icon: Server, description: "Name Server" },
];

export const AddRecordDialog: React.FC<ScopedDialogProps> = ({ isOpen, onClose, contract, refetchAllRecords, selectedScope, activeSubdomain }) => {
  const form = useForm<AddRecordValues>({
    resolver: zodResolver(addRecordSchema),
    defaultValues: { type: "A", value: "", password: "" },
    mode: "onChange",
  });

  const { register, formState: { errors, isValid }, watch, setValue } = form;
  const currentType = watch("type");

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold flex items-center gap-3">
            <Plus className="h-5 w-5 text-primary" />
            Add DNS Record
          </DialogTitle>
          <p className="text-sm text-muted-foreground">Create a new DNS record for your domain</p>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="recordType" className="text-sm font-medium">Record Type</Label>
            <Select value={currentType} onValueChange={(val) => setValue("type", val, { shouldValidate: true })}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {recordTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-3 py-1">
                      <type.icon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="recordValue" className="text-sm font-medium">Record Value</Label>
            <Input
              id="recordValue"
              placeholder={currentType === "A" ? "e.g., 192.168.1.1" : currentType === "AAAA" ? "e.g., 2001:db8::1" : "Enter record value"}
              {...register("value")}
              className={`h-11 ${errors.value ? "border-destructive" : ""}`}
            />
            {errors.value && <p className="text-xs text-destructive">{errors.value.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your domain password"
              {...register("password")}
              className={`h-11 ${errors.password ? "border-destructive" : ""}`}
            />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>
        </div>
        <DialogFooter className="gap-3 pt-4">
          <Button variant="outline" onClick={handleClose} className="flex-1">Cancel</Button>
          <TransactionButton
            className="flex-1"
            transaction={async () => {
              const vals = form.getValues();
              const baseParams = [vals.type, vals.value, vals.password] as const;
              if (selectedScope === "subdomain" && activeSubdomain) {
                return prepareContractCall({
                  contract,
                  method: "function addSubdomainRecord(string label, string recordType, string value, string _password)",
                  params: [activeSubdomain, ...baseParams],
                });
              }
              return prepareContractCall({
                contract,
                method: "function addRecord(string recordType, string value, string _password)",
                params: [...baseParams],
              });
            }}
            onTransactionConfirmed={() => {
              toast.success("DNS record added successfully");
              handleClose();
              refetchAllRecords();
            }}
            onError={(error) => {
              toast.error("Failed to add DNS record");
              console.error(error);
            }}
            disabled={!isValid || (selectedScope === "subdomain" && !activeSubdomain)}
          >
            Add Record
          </TransactionButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const EditRecordDialog: React.FC<ScopedDialogProps & { record: DNSRecord | null }> = ({ isOpen, onClose, contract, refetchAllRecords, selectedScope, activeSubdomain, record }) => {
  const form = useForm<AddRecordValues>({
    resolver: zodResolver(addRecordSchema),
    defaultValues: { type: "", value: "", password: "" },
    mode: "onChange",
  });

  useEffect(() => {
    if (record && "type" in record) {
      form.reset({ type: record.type, value: record.value, password: "" });
    }
  }, [record, form]);

  const { register, formState: { errors, isValid } } = form;

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!record) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold flex items-center gap-3">
            <Edit className="h-5 w-5 text-primary" />
            Edit DNS Record
          </DialogTitle>
          <p className="text-sm text-muted-foreground">Update the DNS record for your domain</p>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Record Type</Label>
            <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
              <Badge variant="outline" className="text-sm">{(record as DNSRecord).type}</Badge>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="editRecordValue" className="text-sm font-medium">Record Value</Label>
            <Input
              id="editRecordValue"
              placeholder="Enter record value"
              {...register("value")}
              className={`h-11 ${errors.value ? "border-destructive" : ""}`}
            />
            {errors.value && <p className="text-xs text-destructive">{errors.value.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="editPassword" className="text-sm font-medium">Password</Label>
            <Input
              id="editPassword"
              type="password"
              placeholder="Enter your domain password"
              {...register("password")}
              className={`h-11 ${errors.password ? "border-destructive" : ""}`}
            />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>
        </div>
        <DialogFooter className="gap-3 pt-4">
          <Button variant="outline" onClick={handleClose} className="flex-1">Cancel</Button>
          <TransactionButton
            className="flex-1"
            transaction={async () => {
              const vals = form.getValues();
              const params = [vals.type, BigInt((record as DNSRecord).index), vals.value, vals.password] as const;
              if (selectedScope === "subdomain" && activeSubdomain) {
                return prepareContractCall({
                  contract,
                  method: "function updateSubdomainRecord(string label, string recordType, uint256 index, string newValue, string _password)",
                  params: [activeSubdomain, ...params],
                });
              }
              return prepareContractCall({
                contract,
                method: "function updateRecord(string recordType, uint256 index, string newValue, string _password)",
                params: [...params],
              });
            }}
            onTransactionConfirmed={() => {
              toast.success("DNS record updated successfully");
              handleClose();
              refetchAllRecords();
            }}
            onError={(error) => {
              toast.error("Failed to update DNS record");
              console.error(error);
            }}
            disabled={!isValid || (selectedScope === "subdomain" && !activeSubdomain)}
          >
            Update Record
          </TransactionButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const AddMXRecordDialog: React.FC<ScopedDialogProps> = ({ isOpen, onClose, contract, refetchAllRecords, selectedScope, activeSubdomain }) => {
  const form = useForm<MXRecordValues>({
    resolver: zodResolver(mxRecordSchema),
    defaultValues: { priority: 10, value: "", password: "" },
    mode: "onChange",
  });

  const { register, formState: { errors, isValid } } = form;

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold flex items-center gap-3">
            <Mail className="h-5 w-5 text-primary" />
            Add MX Record
          </DialogTitle>
          <p className="text-sm text-muted-foreground">Configure mail exchange records for your domain</p>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="mxPriority" className="text-sm font-medium">Priority</Label>
            <Input
              id="mxPriority"
              type="number"
              placeholder="e.g., 10"
              {...register("priority")}
              className={`h-11 ${errors.priority ? "border-destructive" : ""}`}
            />
            {errors.priority && <p className="text-xs text-destructive">{errors.priority.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="mxValue" className="text-sm font-medium">Mail Server</Label>
            <Input
              id="mxValue"
              placeholder="e.g., mail.example.com"
              {...register("value")}
              className={`h-11 ${errors.value ? "border-destructive" : ""}`}
            />
            {errors.value && <p className="text-xs text-destructive">{errors.value.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="mxPassword" className="text-sm font-medium">Password</Label>
            <Input
              id="mxPassword"
              type="password"
              placeholder="Enter your domain password"
              {...register("password")}
              className={`h-11 ${errors.password ? "border-destructive" : ""}`}
            />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>
        </div>
        <DialogFooter className="gap-3 pt-4">
          <Button variant="outline" onClick={handleClose} className="flex-1">Cancel</Button>
          <TransactionButton
            className="flex-1"
            transaction={async () => {
              const vals = form.getValues();
              const params = [BigInt(vals.priority), vals.value, vals.password] as const;
              if (selectedScope === "subdomain" && activeSubdomain) {
                return prepareContractCall({
                  contract,
                  method: "function addSubdomainMX(string label, uint256 priority, string value, string _password)",
                  params: [activeSubdomain, ...params],
                });
              }
              return prepareContractCall({
                contract,
                method: "function addMX(uint256 priority, string value, string _password)",
                params: [...params],
              });
            }}
            onTransactionConfirmed={() => {
              toast.success("MX record added successfully");
              handleClose();
              refetchAllRecords();
            }}
            onError={(error) => {
              toast.error("Failed to add MX record");
              console.error(error);
            }}
            disabled={!isValid || (selectedScope === "subdomain" && !activeSubdomain)}
          >
            Add MX Record
          </TransactionButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const AddSRVRecordDialog: React.FC<ScopedDialogProps> = ({ isOpen, onClose, contract, refetchAllRecords, selectedScope, activeSubdomain }) => {
  const form = useForm<SRVRecordValues>({
    resolver: zodResolver(srvRecordSchema),
    defaultValues: { priority: 0, weight: 0, port: 0, target: "", password: "" },
    mode: "onChange",
  });

  const { register, formState: { errors, isValid } } = form;

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold flex items-center gap-3">
            <Database className="h-5 w-5 text-primary" />
            Add SRV Record
          </DialogTitle>
          <p className="text-sm text-muted-foreground">Configure service records for your domain</p>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="srvPriority" className="text-sm font-medium">Priority</Label>
              <Input id="srvPriority" type="number" {...register("priority")} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="srvWeight" className="text-sm font-medium">Weight</Label>
              <Input id="srvWeight" type="number" {...register("weight")} className="h-11" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="srvPort" className="text-sm font-medium">Port</Label>
            <Input id="srvPort" type="number" {...register("port")} className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="srvTarget" className="text-sm font-medium">Target</Label>
            <Input id="srvTarget" placeholder="e.g., server.example.com" {...register("target")} className="h-11" />
            {errors.target && <p className="text-xs text-destructive">{errors.target.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="srvPassword" className="text-sm font-medium">Password</Label>
            <Input id="srvPassword" type="password" {...register("password")} className="h-11" />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>
        </div>
        <DialogFooter className="gap-3 pt-4">
          <Button variant="outline" onClick={handleClose} className="flex-1">Cancel</Button>
          <TransactionButton
            className="flex-1"
            transaction={async () => {
              const vals = form.getValues();
              const params = [BigInt(vals.priority), BigInt(vals.weight), BigInt(vals.port), vals.target, vals.password] as const;
              if (selectedScope === "subdomain" && activeSubdomain) {
                return prepareContractCall({
                  contract,
                  method: "function addSubdomainSRV(string label, uint256 priority, uint256 weight, uint256 port, string target, string _password)",
                  params: [activeSubdomain, ...params],
                });
              }
              return prepareContractCall({
                contract,
                method: "function addSRV(uint256 priority, uint256 weight, uint256 port, string target, string _password)",
                params: [...params],
              });
            }}
            onTransactionConfirmed={() => {
              toast.success("SRV record added successfully");
              handleClose();
              refetchAllRecords();
            }}
            onError={(error) => {
              toast.error("Failed to add SRV record");
              console.error(error);
            }}
            disabled={!isValid || (selectedScope === "subdomain" && !activeSubdomain)}
          >
            Add SRV Record
          </TransactionButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const CreateSubdomainDialog: React.FC<CommonDialogProps & { domainLabel: string, setScope: React.Dispatch<React.SetStateAction<"root" | "subdomain">>, setSub: React.Dispatch<React.SetStateAction<string | null>> }> = ({ isOpen, onClose, contract, refetchAllRecords, domainLabel, setScope, setSub }) => {
  const form = useForm<SubdomainValues>({
    resolver: zodResolver(subdomainSchema),
    defaultValues: { label: "", password: "" },
    mode: "onChange",
  });

  const { register, formState: { errors, isValid }, watch } = form;
  const labelVal = watch("label");

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold flex items-center gap-3">
            <Layers className="h-5 w-5 text-primary" />
            Create Subdomain
          </DialogTitle>
          <p className="text-sm text-muted-foreground">Define a new subdomain under {domainLabel}</p>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="subdomainLabel" className="text-sm font-medium">Subdomain Label</Label>
            <Input id="subdomainLabel" placeholder="e.g., blog" {...register("label")} className="h-11" />
            <p className="text-xs text-muted-foreground">Full address: {labelVal || "your-label"}.{domainLabel}</p>
            {errors.label && <p className="text-xs text-destructive">{errors.label.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="subdomainPassword" className="text-sm font-medium">Password</Label>
            <Input id="subdomainPassword" type="password" {...register("password")} className="h-11" />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>
        </div>
        <DialogFooter className="gap-3 pt-4">
          <Button variant="outline" onClick={handleClose} className="flex-1">Cancel</Button>
          <TransactionButton
            className="flex-1"
            transaction={async () => {
              const vals = form.getValues();
              return prepareContractCall({
                contract,
                method: "function createSubdomain(string label, string _password)",
                params: [vals.label.trim(), vals.password],
              });
            }}
            onTransactionConfirmed={() => {
              const label = form.getValues("label").trim();
              toast.success(`${label}.${domainLabel} created successfully`);
              handleClose();
              setScope("subdomain");
              setSub(label);
              refetchAllRecords();
            }}
            onError={(error) => {
              toast.error("Failed to create subdomain");
              console.error(error);
            }}
            disabled={!isValid}
          >
            Create Subdomain
          </TransactionButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const DeleteRecordDialog: React.FC<ScopedDialogProps & { record: RecordData, recordType: string }> = ({ isOpen, onClose, contract, refetchAllRecords, selectedScope, activeSubdomain, record, recordType }) => {
  const form = useForm<{ password: string }>({
    resolver: zodResolver(z.object({ password: passwordSchema })),
    defaultValues: { password: "" },
    mode: "onChange",
  });

  const { register, formState: { errors, isValid } } = form;

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!record) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold flex items-center gap-3 text-destructive">
            Delete DNS Record
          </DialogTitle>
          <p className="text-sm text-muted-foreground">This action cannot be undone. Please confirm.</p>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm">
            <p><strong>Type:</strong> {recordType.toUpperCase()}</p>
            {record && "value" in record && <p><strong>Value:</strong> {(record as DNSRecord).value}</p>}
            {record && "target" in record && <p><strong>Target:</strong> {(record as SRVRecord).target}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="deletePassword">Password Confirmation</Label>
            <Input id="deletePassword" type="password" {...register("password")} className="h-11" />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>
        </div>
        <DialogFooter className="gap-3 pt-4">
          <Button variant="outline" onClick={handleClose} className="flex-1">Cancel</Button>
          <TransactionButton
            className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            transaction={async () => {
              const password = form.getValues("password");
              if (recordType === "mx") {
                const mxRecord = record as MXRecord;
                const params = [BigInt(mxRecord.index), password] as const;
                if (selectedScope === "subdomain" && activeSubdomain) {
                  return prepareContractCall({
                    contract,
                    method: "function deleteSubdomainMX(string label, uint256 index, string _password)",
                    params: [activeSubdomain, ...params],
                  });
                }
                return prepareContractCall({
                  contract,
                  method: "function deleteMX(uint256 index, string _password)",
                  params,
                });
              }
              if (recordType === "srv") {
                const srvRecord = record as SRVRecord;
                const params = [BigInt(srvRecord.index), password] as const;
                if (selectedScope === "subdomain" && activeSubdomain) {
                  return prepareContractCall({
                    contract,
                    method: "function deleteSubdomainSRV(string label, uint256 index, string _password)",
                    params: [activeSubdomain, ...params],
                  });
                }
                return prepareContractCall({
                  contract,
                  method: "function deleteSRV(uint256 index, string _password)",
                  params,
                });
              }
              const params = [(record as DNSRecord).type, BigInt((record as DNSRecord).index), password] as const;
              if (selectedScope === "subdomain" && activeSubdomain) {
                return prepareContractCall({
                  contract,
                  method: "function deleteSubdomainRecord(string label, string recordType, uint256 index, string _password)",
                  params: [activeSubdomain, ...params],
                });
              }
              return prepareContractCall({
                contract,
                method: "function deleteRecord(string recordType, uint256 index, string _password)",
                params,
              });
            }}
            onTransactionConfirmed={() => {
              toast.success("DNS record deleted successfully");
              handleClose();
              refetchAllRecords();
            }}
            onError={(error) => {
              toast.error("Failed to delete DNS record");
              console.error(error);
            }}
            disabled={!isValid || (selectedScope === "subdomain" && !activeSubdomain)}
          >
            Delete Record
          </TransactionButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
