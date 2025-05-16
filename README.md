<p align="center">
  <img src="public/amoca/amoca-logo.png" alt="AMOCA Logo" width="180"/>
</p>

# AMOCA: Decentralized Climate Parametric Insurance Dapp

AMOCA is a decentralized application (dapp) built on the Solana blockchain, designed to provide parametric insurance solutions for climate-related risks. Leveraging the speed and scalability of Solana, AMOCA enables transparent, automated, and trustless insurance payouts based on real-world climate data.

Key features:

- **Parametric Insurance:** Automated payouts triggered by predefined climate parameters (e.g., rainfall, temperature, wind speed).
- **Decentralized & Transparent:** All policies and claims are managed on-chain, ensuring transparency and reducing the need for intermediaries.
- **Magic Block Scaleup:** Utilizes Magic Block technology to enhance scalability and performance, supporting large-scale adoption.
- **Solana Breakout Hackathon 2025:** AMOCA is developed as part of the Solana Breakout Hackathon 2025, showcasing innovation in decentralized insurance and climate resilience.

Join us in building the future of climate risk management on Solana!

## Workflow Diagram

```mermaid
flowchart TD
    User[Policy Holder] -->|Buys Policy| AMOCA_Dapp[AMOCA Dapp]
    AMOCA_Dapp -->|Requests Data| Switchboard[Switchboard Data Feed]
    Switchboard -->|Sends Climate Data| AMOCA_Dapp
    AMOCA_Dapp -->|Triggers| Solana_Program[Solana Program]
    Solana_Program -->|Payout| User
    note1[/"No need to measure real asset damages"/] --- Solana_Program
```

- AMOCA leverages a custom on-demand data feed from Switchboard to obtain climate parameters.
- When a trigger condition is met, the Solana program automatically executes payouts to policy holders.
- This parametric approach eliminates the need to assess actual damages to real assets.

## Unique Solana Features in AMOCA

AMOCA utilizes several advanced Solana features to deliver a scalable, secure, and user-friendly parametric insurance platform:

### 1. High-Throughput, Low-Latency Transactions

```mermaid
sequenceDiagram
    participant User
    participant AMOCA_UI as AMOCA UI
    participant Solana as Solana Blockchain

    User->>AMOCA_UI: Submit Policy Purchase
    AMOCA_UI->>Solana: Send Transaction
    Solana-->>AMOCA_UI: Confirm in <1s
    AMOCA_UI-->>User: Policy Issued Instantly
```

- Solana's fast block times ensure instant policy issuance and claim settlements.

### 2. Magic Block Scaleup

```mermaid
graph LR
    A[Magic Block] --> B[AMOCA Smart Contracts]
    B --> C[Massive Parallel Processing]
    C --> D[Scalable Insurance Operations]
```

- Magic Block enables AMOCA to scale efficiently, handling large numbers of policies and claims in parallel.

### 3. Composability & Wallet Integration

```mermaid
flowchart LR
    UserWallet[User Wallet] -- Connects --> AMOCA_Dapp
    AMOCA_Dapp -- Uses --> Solana_Kit[Solana Kit]
    Solana_Kit -- Integrates --> Solana_Program
```

- Seamless wallet integration and composability with other Solana dapps and DeFi protocols.

---

Join us in building the future of climate risk management on Solana!
