// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Domain.sol"; // Assuming Domain.sol is in the same folder

contract DNSFactory {
    mapping(string => address) public domains;                // domainName => Domain contract address
    mapping(address => address[]) private userDomains;        // user => list of domain contract addresses
    mapping(address => string[]) private userDomainNames;     // user => list of domain names

    address[] public allDomains;                              // List of all deployed domain contracts

    event DomainCreated(string domainName, address domainAddress, address owner);

    /// ------------------- CREATE DOMAIN -------------------
    function createDomain(string memory domainName, string memory password) external {
        require(domains[domainName] == address(0), "Domain already exists");

        // Deploy new Domain contract
        Domain newDomain = new Domain(domainName, password, msg.sender);

        // Save mappings
        domains[domainName] = address(newDomain);
        allDomains.push(address(newDomain));

        // Track user domains
        userDomains[msg.sender].push(address(newDomain));
        userDomainNames[msg.sender].push(domainName);

        emit DomainCreated(domainName, address(newDomain), msg.sender);
    }

    /// ------------------- GET DOMAIN CONTRACT -------------------
    function getDomainContract(string memory domainName) external view returns(address) {
        return domains[domainName];
    }

    /// ------------------- LIST ALL DOMAINS -------------------
    function getAllDomains() external view returns(address[] memory) {
        return allDomains;
    }

    /// ------------------- GET DOMAINS AND CONTRACTS BY USER -------------------
    function getDomainsByUser(address user) 
        external 
        view 
        returns (string[] memory domainNames, address[] memory domainContracts) 
    {
        return (userDomainNames[user], userDomains[user]);
    }
}
