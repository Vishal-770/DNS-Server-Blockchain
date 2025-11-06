// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Domain {
    address public owner;
    string public domainName;
    bytes32 private passwordHash;

    mapping(string => string[]) private records; // Generic DNS records: A, AAAA, CNAME, TXT, NS
    MXRecord[] private MX;
    SRVRecord[] private SRV;

    string[] private subdomains;
    mapping(string => bool) private subdomainExists;
    mapping(string => mapping(string => string[])) private subdomainRecords;
    mapping(string => MXRecord[]) private subdomainMX;
    mapping(string => SRVRecord[]) private subdomainSRV;

    struct MXRecord {
        uint256 priority;
        string value;
    }

    struct SRVRecord {
        uint256 priority;
        uint256 weight;
        uint256 port;
        string target;
    }

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );
    event RecordUpdated(string recordType, string[] values);
    event SubdomainCreated(string indexed label);
    event SubdomainRecordUpdated(
        string indexed label,
        string recordType,
        string[] values
    );

    constructor(
        string memory _domainName,
        string memory _password,
        address _owner
    ) {
        owner = _owner;
        domainName = _domainName;
        passwordHash = keccak256(abi.encodePacked(_password));
    }

    modifier onlyOwnerWithPassword(string memory _password) {
        require(msg.sender == owner, "Not owner");
        require(
            keccak256(abi.encodePacked(_password)) == passwordHash,
            "Invalid password"
        );
        _;
    }

    // ------------------- DOMAIN TRANSFER -------------------
    function transferDomain(
        address newOwner,
        string memory _password
    ) external onlyOwnerWithPassword(_password) {
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    // ------------------- CRUD FOR GENERIC RECORDS -------------------
    function addRecord(
        string memory recordType,
        string memory value,
        string memory _password
    ) external onlyOwnerWithPassword(_password) {
        records[recordType].push(value);
        emit RecordUpdated(recordType, records[recordType]);
    }

    function updateRecord(
        string memory recordType,
        uint index,
        string memory newValue,
        string memory _password
    ) external onlyOwnerWithPassword(_password) {
        require(index < records[recordType].length, "Index out of bounds");
        records[recordType][index] = newValue;
        emit RecordUpdated(recordType, records[recordType]);
    }

    function deleteRecord(
        string memory recordType,
        uint index,
        string memory _password
    ) external onlyOwnerWithPassword(_password) {
        require(index < records[recordType].length, "Index out of bounds");
        records[recordType][index] = records[recordType][
            records[recordType].length - 1
        ];
        records[recordType].pop();
        emit RecordUpdated(recordType, records[recordType]);
    }

    // ------------------- CRUD FOR MX -------------------
    function addMX(
        uint priority,
        string memory value,
        string memory _password
    ) external onlyOwnerWithPassword(_password) {
        MX.push(MXRecord(priority, value));
    }

    function updateMX(
        uint index,
        uint priority,
        string memory value,
        string memory _password
    ) external onlyOwnerWithPassword(_password) {
        require(index < MX.length, "Index out of bounds");
        MX[index] = MXRecord(priority, value);
    }

    function deleteMX(
        uint index,
        string memory _password
    ) external onlyOwnerWithPassword(_password) {
        require(index < MX.length, "Index out of bounds");
        MX[index] = MX[MX.length - 1];
        MX.pop();
    }

    // ------------------- CRUD FOR SRV -------------------
    function addSRV(
        uint priority,
        uint weight,
        uint port,
        string memory target,
        string memory _password
    ) external onlyOwnerWithPassword(_password) {
        SRV.push(SRVRecord(priority, weight, port, target));
    }

    function updateSRV(
        uint index,
        uint priority,
        uint weight,
        uint port,
        string memory target,
        string memory _password
    ) external onlyOwnerWithPassword(_password) {
        require(index < SRV.length, "Index out of bounds");
        SRV[index] = SRVRecord(priority, weight, port, target);
    }

    function deleteSRV(
        uint index,
        string memory _password
    ) external onlyOwnerWithPassword(_password) {
        require(index < SRV.length, "Index out of bounds");
        SRV[index] = SRV[SRV.length - 1];
        SRV.pop();
    }

    // ------------------- SUBDOMAIN MANAGEMENT -------------------
    function createSubdomain(
        string memory label,
        string memory _password
    ) external onlyOwnerWithPassword(_password) {
        require(bytes(label).length > 0, "Invalid subdomain");
        require(!subdomainExists[label], "Subdomain exists");

        subdomainExists[label] = true;
        subdomains.push(label);

        emit SubdomainCreated(label);
    }

    function addSubdomainRecord(
        string memory label,
        string memory recordType,
        string memory value,
        string memory _password
    ) external onlyOwnerWithPassword(_password) {
        require(subdomainExists[label], "Subdomain missing");
        subdomainRecords[label][recordType].push(value);

        emit SubdomainRecordUpdated(
            label,
            recordType,
            subdomainRecords[label][recordType]
        );
    }

    function updateSubdomainRecord(
        string memory label,
        string memory recordType,
        uint256 index,
        string memory newValue,
        string memory _password
    ) external onlyOwnerWithPassword(_password) {
        require(subdomainExists[label], "Subdomain missing");
        require(
            index < subdomainRecords[label][recordType].length,
            "Index out of bounds"
        );

        subdomainRecords[label][recordType][index] = newValue;

        emit SubdomainRecordUpdated(
            label,
            recordType,
            subdomainRecords[label][recordType]
        );
    }

    function deleteSubdomainRecord(
        string memory label,
        string memory recordType,
        uint256 index,
        string memory _password
    ) external onlyOwnerWithPassword(_password) {
        require(subdomainExists[label], "Subdomain missing");
        require(
            index < subdomainRecords[label][recordType].length,
            "Index out of bounds"
        );

        string[] storage values = subdomainRecords[label][recordType];
        values[index] = values[values.length - 1];
        values.pop();

        emit SubdomainRecordUpdated(label, recordType, values);
    }

    function addSubdomainMX(
        string memory label,
        uint256 priority,
        string memory value,
        string memory _password
    ) external onlyOwnerWithPassword(_password) {
        require(subdomainExists[label], "Subdomain missing");
        subdomainMX[label].push(MXRecord(priority, value));
    }

    function updateSubdomainMX(
        string memory label,
        uint256 index,
        uint256 priority,
        string memory value,
        string memory _password
    ) external onlyOwnerWithPassword(_password) {
        require(subdomainExists[label], "Subdomain missing");
        require(index < subdomainMX[label].length, "Index out of bounds");

        subdomainMX[label][index] = MXRecord(priority, value);
    }

    function deleteSubdomainMX(
        string memory label,
        uint256 index,
        string memory _password
    ) external onlyOwnerWithPassword(_password) {
        require(subdomainExists[label], "Subdomain missing");
        require(index < subdomainMX[label].length, "Index out of bounds");

        MXRecord[] storage recordsForSubdomain = subdomainMX[label];
        recordsForSubdomain[index] = recordsForSubdomain[
            recordsForSubdomain.length - 1
        ];
        recordsForSubdomain.pop();
    }

    function addSubdomainSRV(
        string memory label,
        uint256 priority,
        uint256 weight,
        uint256 port,
        string memory target,
        string memory _password
    ) external onlyOwnerWithPassword(_password) {
        require(subdomainExists[label], "Subdomain missing");
        subdomainSRV[label].push(SRVRecord(priority, weight, port, target));
    }

    function updateSubdomainSRV(
        string memory label,
        uint256 index,
        uint256 priority,
        uint256 weight,
        uint256 port,
        string memory target,
        string memory _password
    ) external onlyOwnerWithPassword(_password) {
        require(subdomainExists[label], "Subdomain missing");
        require(index < subdomainSRV[label].length, "Index out of bounds");

        subdomainSRV[label][index] = SRVRecord(priority, weight, port, target);
    }

    function deleteSubdomainSRV(
        string memory label,
        uint256 index,
        string memory _password
    ) external onlyOwnerWithPassword(_password) {
        require(subdomainExists[label], "Subdomain missing");
        require(index < subdomainSRV[label].length, "Index out of bounds");

        SRVRecord[] storage recordsForSubdomain = subdomainSRV[label];
        recordsForSubdomain[index] = recordsForSubdomain[
            recordsForSubdomain.length - 1
        ];
        recordsForSubdomain.pop();
    }

    // ------------------- QUERY FUNCTIONS -------------------
    function getRecord(
        string memory recordType
    ) external view returns (string[] memory) {
        string[] memory recs = records[recordType];
        if (
            keccak256(abi.encodePacked(recordType)) == keccak256("A") &&
            recs.length == 0
        ) {
            return records["CNAME"]; // fallback
        }
        return recs;
    }

    function getMX() external view returns (MXRecord[] memory) {
        return MX;
    }

    function getSRV() external view returns (SRVRecord[] memory) {
        return SRV;
    }

    function getSubdomainRecord(
        string memory label,
        string memory recordType
    ) external view returns (string[] memory) {
        string[] memory recs = subdomainRecords[label][recordType];
        if (
            keccak256(abi.encodePacked(recordType)) == keccak256("A") &&
            recs.length == 0
        ) {
            return subdomainRecords[label]["CNAME"];
        }
        return recs;
    }

    function getSubdomainMX(
        string memory label
    ) external view returns (MXRecord[] memory) {
        return subdomainMX[label];
    }

    function getSubdomainSRV(
        string memory label
    ) external view returns (SRVRecord[] memory) {
        return subdomainSRV[label];
    }

    function listSubdomains() external view returns (string[] memory) {
        return subdomains;
    }

    function subdomainHasRecords(
        string memory label
    ) external view returns (bool) {
        if (!subdomainExists[label]) {
            return false;
        }

        string[5] memory genericTypes = ["A", "AAAA", "CNAME", "TXT", "NS"];
        for (uint256 j = 0; j < genericTypes.length; j++) {
            if (subdomainRecords[label][genericTypes[j]].length > 0) {
                return true;
            }
        }

        return subdomainMX[label].length > 0 || subdomainSRV[label].length > 0;
    }

    // ------------------- FRONTEND HELPER -------------------
    function getAllRecordTypes()
        external
        pure
        returns (string[] memory typesList)
    {
        typesList = new string[](7);
        typesList[0] = "A";
        typesList[1] = "AAAA";
        typesList[2] = "CNAME";
        typesList[3] = "MX";
        typesList[4] = "TXT";
        typesList[5] = "NS";
        typesList[6] = "SRV";
    }
}
