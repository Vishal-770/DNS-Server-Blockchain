// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Domain {
    address public owner;
    string public domainName;
    bytes32 private passwordHash;

    mapping(string => string[]) private records; // Generic DNS records: A, AAAA, CNAME, TXT, NS
    MXRecord[] private MX;
    SRVRecord[] private SRV;

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

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event RecordUpdated(string recordType, string[] values);

    constructor(string memory _domainName, string memory _password, address _owner) {
        owner = _owner;
        domainName = _domainName;
        passwordHash = keccak256(abi.encodePacked(_password));
    }

    modifier onlyOwnerWithPassword(string memory _password) {
        require(msg.sender == owner, "Not owner");
        require(keccak256(abi.encodePacked(_password)) == passwordHash, "Invalid password");
        _;
    }

    // ------------------- DOMAIN TRANSFER -------------------
    function transferDomain(address newOwner, string memory _password) external onlyOwnerWithPassword(_password) {
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    // ------------------- CRUD FOR GENERIC RECORDS -------------------
    function addRecord(string memory recordType, string memory value, string memory _password) external onlyOwnerWithPassword(_password) {
        records[recordType].push(value);
        emit RecordUpdated(recordType, records[recordType]);
    }

    function updateRecord(string memory recordType, uint index, string memory newValue, string memory _password) external onlyOwnerWithPassword(_password) {
        require(index < records[recordType].length, "Index out of bounds");
        records[recordType][index] = newValue;
        emit RecordUpdated(recordType, records[recordType]);
    }

    function deleteRecord(string memory recordType, uint index, string memory _password) external onlyOwnerWithPassword(_password) {
        require(index < records[recordType].length, "Index out of bounds");
        records[recordType][index] = records[recordType][records[recordType].length - 1];
        records[recordType].pop();
        emit RecordUpdated(recordType, records[recordType]);
    }

    // ------------------- CRUD FOR MX -------------------
    function addMX(uint priority, string memory value, string memory _password) external onlyOwnerWithPassword(_password) {
        MX.push(MXRecord(priority, value));
    }

    function updateMX(uint index, uint priority, string memory value, string memory _password) external onlyOwnerWithPassword(_password) {
        require(index < MX.length, "Index out of bounds");
        MX[index] = MXRecord(priority, value);
    }

    function deleteMX(uint index, string memory _password) external onlyOwnerWithPassword(_password) {
        require(index < MX.length, "Index out of bounds");
        MX[index] = MX[MX.length - 1];
        MX.pop();
    }

    // ------------------- CRUD FOR SRV -------------------
    function addSRV(uint priority, uint weight, uint port, string memory target, string memory _password) external onlyOwnerWithPassword(_password) {
        SRV.push(SRVRecord(priority, weight, port, target));
    }

    function updateSRV(uint index, uint priority, uint weight, uint port, string memory target, string memory _password) external onlyOwnerWithPassword(_password) {
        require(index < SRV.length, "Index out of bounds");
        SRV[index] = SRVRecord(priority, weight, port, target);
    }

    function deleteSRV(uint index, string memory _password) external onlyOwnerWithPassword(_password) {
        require(index < SRV.length, "Index out of bounds");
        SRV[index] = SRV[SRV.length - 1];
        SRV.pop();
    }

    // ------------------- QUERY FUNCTIONS -------------------
    function getRecord(string memory recordType) external view returns(string[] memory) {
        string[] memory recs = records[recordType];
        if(keccak256(abi.encodePacked(recordType)) == keccak256("A") && recs.length == 0) {
            return records["CNAME"]; // fallback
        }
        return recs;
    }

    function getMX() external view returns(MXRecord[] memory) { return MX; }
    function getSRV() external view returns(SRVRecord[] memory) { return SRV; }

    // ------------------- FRONTEND HELPER -------------------
    function getAllRecordTypes() external pure returns(string[] memory typesList) {
        typesList = new string[](7) ;
        typesList[0] = "A";
        typesList[1] = "AAAA";
        typesList[2] = "CNAME";
        typesList[3] = "MX";
        typesList[4] = "TXT";
        typesList[5] = "NS";
        typesList[6] = "SRV";
    }
}
