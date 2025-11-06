# DNS Server Blockchain

A revolutionary decentralized DNS (Domain Name System) implementation that combines blockchain technology with traditional DNS protocols. This project enables domain registration and DNS record management on the blockchain while providing a fully functional DNS server that resolves queries from both on-chain and off-chain sources.

## 🌟 Project Overview

This project consists of three main components:

1. **Smart Contracts** - Solidity contracts for domain registration and DNS record management on zkSync Sepolia testnet
2. **DNS Server** - A UDP-based DNS server that resolves queries from blockchain and local databases
3. **Frontend Application** - A modern Next.js web interface for managing domains and DNS records

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
│          Domain Registration & Management Interface          │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ Web3 (thirdweb SDK)
                      │
┌─────────────────────▼───────────────────────────────────────┐
│              Smart Contracts (zkSync Sepolia)                │
│   ┌──────────────────┐      ┌─────────────────────────┐    │
│   │  DNSFactory.sol  │──────│     Domain.sol          │    │
│   │  Domain Registry │      │  DNS Records Storage    │    │
│   └──────────────────┘      └─────────────────────────┘    │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ Smart Contract Queries
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    DNS Server (Node.js)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Blockchain  │  │     Redis    │  │  Local Database  │  │
│  │   Resolver   │  │     Cache    │  │   (Fallback)     │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ UDP DNS Protocol (Port 53)
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                     DNS Clients                              │
│              (dig, nslookup, browsers, etc.)                 │
└─────────────────────────────────────────────────────────────┘
```

## ✨ Features

### Smart Contract Features
- **Domain Registration**: Register domains with password protection on the blockchain
- **DNS Record Management**: Full CRUD operations for multiple DNS record types:
  - A Records (IPv4 addresses)
  - AAAA Records (IPv6 addresses)
  - CNAME Records (Canonical names)
  - MX Records (Mail exchange with priority)
  - NS Records (Name servers)
  - TXT Records (Text records)
  - SRV Records (Service records with priority, weight, port)
- **Ownership Transfer**: Secure domain transfer with password authentication
- **Access Control**: Password-protected record modifications

### DNS Server Features
- **Blockchain Resolution**: Query DNS records directly from smart contracts
- **Redis Caching**: High-performance caching layer for blockchain queries
- **Rate Limiting**: Built-in protection against DNS amplification attacks
- **Fallback Resolution**: Automatic fallback to:
  - Local database for development/testing
  - Upstream DNS servers (Google DNS) for unregistered domains
- **CNAME Chain Resolution**: Automatic following of CNAME records
- **Multiple Record Types**: Support for all standard DNS record types
- **Error Handling**: Graceful error handling and logging

### Frontend Features
- **Domain Registration**: User-friendly interface for blockchain domain registration
- **Record Management**: Interactive UI for adding, updating, and deleting DNS records
- **Wallet Integration**: Web3 wallet connection with thirdweb
- **User Dashboard**: View and manage all domains owned by a user
- **Theme Support**: Dark/light mode with smooth transitions
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Real-time Updates**: Immediate feedback on blockchain transactions

## 🛠️ Technology Stack

### Smart Contracts
- **Solidity**: ^0.8.0
- **Hardhat**: Smart contract development framework
- **zkSync Era**: Layer 2 scaling solution
- **thirdweb**: Web3 development tools

### DNS Server
- **Node.js**: Runtime environment
- **dgram**: UDP socket implementation
- **dns-packet**: DNS protocol packet encoding/decoding
- **Redis**: Caching and rate limiting
- **thirdweb SDK**: Blockchain interaction
- **dotenv**: Environment variable management

### Frontend
- **Next.js 15**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Framer Motion**: Animation library
- **thirdweb SDK**: Web3 integration
- **Lucide React**: Icon library

## 📋 Prerequisites

- **Node.js**: v18 or higher
- **npm** or **yarn**: Package manager
- **Redis**: For DNS server caching (optional but recommended)
- **Web3 Wallet**: MetaMask or compatible wallet
- **zkSync Sepolia ETH**: For smart contract interactions

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Vishal-770/DNS-Server-Blockchain.git
cd DNS-Server-Blockchain
```

### 2. Install Smart Contract Dependencies

```bash
cd dnscontracts
npm install
```

### 3. Install DNS Server Dependencies

```bash
cd ../dns-server
npm install
```

### 4. Install Frontend Dependencies

```bash
cd ../dns-frontend
npm install
```

## ⚙️ Configuration

### DNS Server Configuration

Create a `.env` file in the `dns-server` directory:

```env
# Blockchain Configuration
THIRDWEB_CLIENT_ID=your_thirdweb_client_id_here

# Redis Configuration (Optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_USERNAME=default
REDIS_PASSWORD=your_redis_password
REDIS_CACHE_TTL=60

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=10
RATE_LIMIT_WINDOW_SECONDS=60
```

### Frontend Configuration

Create a `.env.local` file in the `dns-frontend` directory:

```env
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id_here
```

### Smart Contract Configuration

The contracts are deployed on zkSync Sepolia testnet. The factory contract address is configured in `dns-server/Contract.js`:

```javascript
export const contractAddress = "0xa9B2b50B0b3d6f24FC9E06a8b79E6b91B2843b30";
```

## 🎯 Usage

### Deploying Smart Contracts

```bash
cd dnscontracts
npx thirdweb deploy
```

This will:
1. Compile the smart contracts
2. Open a browser for deployment configuration
3. Deploy to zkSync Sepolia testnet

### Running the DNS Server

**Important**: The DNS server requires root/administrator privileges to bind to port 53.

```bash
cd dns-server

# On Linux/macOS
sudo npm run dev

# On Windows (Run as Administrator)
npm run dev
```

The server will:
- Start on UDP port 53
- Test blockchain connectivity
- Begin accepting DNS queries

### Running the Frontend

```bash
cd dns-frontend
npm run dev
```

Access the application at `http://localhost:3000`

### Testing DNS Resolution

Once the DNS server is running, you can test it with standard DNS tools:

```bash
# Query an A record
dig @localhost wallstreetwheels.store A

# Query an MX record
dig @localhost wallstreetwheels.store MX

# Query with nslookup
nslookup wallstreetwheels.store localhost
```

## 📖 API Documentation

### Smart Contract Functions

#### DNSFactory Contract

**createDomain(domainName, password)**
- Registers a new domain on the blockchain
- Parameters:
  - `domainName`: String - The domain name to register
  - `password`: String - Password for domain management
- Returns: Domain contract address

**getDomainContract(domainName)**
- Retrieves the contract address for a domain
- Parameters:
  - `domainName`: String - The domain name
- Returns: Address of the Domain contract

**getDomainsByUser(userAddress)**
- Lists all domains owned by a user
- Parameters:
  - `userAddress`: Address - The user's wallet address
- Returns: Array of domain names and contract addresses

#### Domain Contract

**addRecord(recordType, value, password)**
- Adds a new DNS record
- Parameters:
  - `recordType`: String - Type (A, AAAA, CNAME, TXT, NS)
  - `value`: String - Record value
  - `password`: String - Owner's password

**addMX(priority, value, password)**
- Adds an MX record
- Parameters:
  - `priority`: uint256 - Mail server priority
  - `value`: String - Mail server hostname
  - `password`: String - Owner's password

**addSRV(priority, weight, port, target, password)**
- Adds an SRV record
- Parameters:
  - `priority`: uint256 - Service priority
  - `weight`: uint256 - Load balancing weight
  - `port`: uint256 - Service port
  - `target`: String - Target hostname
  - `password`: String - Owner's password

**getRecord(recordType)**
- Retrieves records of a specific type
- Parameters:
  - `recordType`: String - The record type to query
- Returns: Array of record values

**transferDomain(newOwner, password)**
- Transfers domain ownership
- Parameters:
  - `newOwner`: Address - New owner's wallet address
  - `password`: String - Current owner's password

### DNS Server Resolution Flow

1. **Receive DNS Query** on UDP port 53
2. **Rate Limit Check** using Redis
3. **Try Blockchain Resolution**:
   - Check Redis cache first
   - Query smart contract if not cached
   - Cache successful responses
4. **Fallback to Local Database** if blockchain query fails
5. **Fallback to Upstream DNS** (Google DNS) if not found locally
6. **Send Response** back to client

### Frontend Routes

- `/` - Home page with project overview
- `/domains` - Domain registration and search
- `/domains/[domainAddress]` - View domain details
- `/domains/[domainAddress]/manage` - Manage DNS records
- `/user/[walletAddress]` - User's domain portfolio
- `/about` - About the project
- `/contact` - Contact information

## 🔧 Development

### Building the Projects

```bash
# Build smart contracts
cd dnscontracts
npm run build

# Build frontend
cd dns-frontend
npm run build
```

### Linting

```bash
# Lint frontend code
cd dns-frontend
npm run lint
```

## 🐛 Troubleshooting

### DNS Server Issues

**Port 53 Permission Error**
- Solution: Run with sudo/administrator privileges
- Alternative: Use a different port (requires DNS client configuration)

**Blockchain Connection Failed**
- Check THIRDWEB_CLIENT_ID is set correctly
- Verify internet connection
- Ensure contract address is correct

**Redis Connection Error**
- Verify Redis is running: `redis-cli ping`
- Check Redis credentials in .env
- DNS server will work without Redis (caching disabled)

### Frontend Issues

**Wallet Connection Failed**
- Ensure MetaMask or compatible wallet is installed
- Switch to zkSync Sepolia testnet
- Check you have test ETH for gas fees

**Transaction Reverted**
- Verify correct password for domain operations
- Ensure wallet has sufficient funds
- Check if domain already exists (for registration)

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- **Repository**: https://github.com/Vishal-770/DNS-Server-Blockchain
- **zkSync Era**: https://era.zksync.io/
- **thirdweb**: https://thirdweb.com/
- **DNS Protocol**: https://datatracker.ietf.org/doc/html/rfc1035

## 🙏 Acknowledgments

- zkSync Era team for the Layer 2 infrastructure
- thirdweb for Web3 development tools
- The Ethereum and Web3 community
- DNS protocol researchers and implementers

## 📞 Support

For questions and support:
- Open an issue on GitHub
- Check existing documentation
- Review troubleshooting section

---

**Note**: This is an experimental project for educational purposes. Always test thoroughly before using in production environments.
