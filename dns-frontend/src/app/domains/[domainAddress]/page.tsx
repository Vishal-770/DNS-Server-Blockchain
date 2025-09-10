"use client";

import client from "@/app/client";
import { useParams } from "next/navigation";
import React from "react";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Settings } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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

  const isLoading =
    aPending || nsPending || txtPending || aaaaPending || cnamePending;

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
  ];

  return (
    <div className="min-h-screen px-4 py-10 flex flex-col items-center mt-20">
      <div className="flex items-center justify-between w-full max-w-4xl mb-8">
        <h1 className="text-3xl font-bold text-primary">Domain Records</h1>
        <Link href={`/domains/${domainAddress}/manage`}>
          <Button className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Manage Records
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {records.map((record) => (
          <Card key={record.type} className="shadow-md">
            <CardHeader>
              <CardTitle>{record.type} Record</CardTitle>
            </CardHeader>
            <CardContent>
              {record.data && record.data.length > 0 ? (
                <ul className="list-disc list-inside text-muted-foreground">
                  {record.data.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">
                  No {record.type} records found
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {records.every((r) => !r.data || r.data.length === 0) && (
        <div className="text-center text-muted-foreground mt-8">
          No records found for this domain.
        </div>
      )}
    </div>
  );
};

export default DomainPage;
