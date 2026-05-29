# Cryptographic-MPC-Voting-System
This system abandons traditional database storage for votes. Instead, it uses a distributed 5-node architecture (Frontend, Backend, and 3 independent MPC Servers) to capture and consolidate votes.

# Cryptographic MPC Voting System

A privacy-preserving electronic voting system built using **Secure Multi-Party Computation (MPC)** and **Shamir Secret Sharing**. The system eliminates the need for a trusted central authority by distributing encrypted vote shares across multiple independent servers, ensuring that no single server can learn a voter's choice.

## Overview

Traditional e-voting systems often rely on a centralized database or authority to store and tally votes. This creates a single point of failure and introduces risks such as insider attacks, database breaches, and key compromise.

This project demonstrates how Secure Multi-Party Computation can be applied to voting systems by:

* Encoding votes as vectors on the client side
* Splitting votes into cryptographic shares using Shamir Secret Sharing
* Distributing shares across multiple independent servers
* Aggregating vote totals without revealing individual votes
* Reconstructing final election results using Lagrange Interpolation

At no point does any server possess enough information to determine how a user voted.

---

## System Architecture

```text
                  ┌─────────────┐
                  │   React UI  │
                  └──────┬──────┘
                         │
          Vote Vector Encoding + Secret Sharing
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
 ┌──────────┐     ┌──────────┐     ┌──────────┐
 │ MPC Node │     │ MPC Node │     │ MPC Node │
 │  Port    │     │  Port    │     │  Port    │
 │  6001    │     │  6002    │     │  6003    │
 └────┬─────┘     └────┬─────┘     └────┬─────┘
      │                │                │
      └────────────────┼────────────────┘
                       │
                       ▼
            Reconstruction Server
                       │
                       ▼
                 Final Vote Tally
```

---

## Key Features

* Secure Multi-Party Computation (MPC)
* Shamir Secret Sharing implementation
* Client-side vote encryption and sharing
* Distributed vote aggregation
* Vote privacy protection
* Prevention of double voting
* Real-time election result visualization
* No vote preferences stored in any database

---

## Technology Stack

### Frontend

* React.js
* Chart.js

### Backend

* Flask
* REST APIs

### Database

* SQLite

### Cryptography

* Shamir Secret Sharing
* Lagrange Interpolation
* Additive Homomorphic Aggregation

---

## How It Works

### 1. Vote Encoding

Each candidate is represented as a vector.

Example:

```text
Candidate A → [1, 0, 0]
Candidate B → [0, 1, 0]
Candidate C → [0, 0, 1]
```

---

### 2. Secret Sharing

The vote vector is transformed into cryptographic shares using a randomly generated polynomial.

```text
f(x) = s + a₁x mod p
```

Where:

* s = secret vote value
* a₁ = random coefficient
* p = large prime number

Each server receives only one point on the polynomial.

---

### 3. Distributed Aggregation

Each MPC server maintains a running sum of its received shares.

Because Shamir Secret Sharing is additively homomorphic, the servers can compute vote totals without learning any underlying vote information.

---

### 4. Result Reconstruction

The reconstruction service collects aggregated shares from the MPC servers and applies Lagrange Interpolation to recover the final vote counts.

---

## Security Benefits

* No central authority can access votes
* Individual servers learn nothing about voter choices
* Vote secrecy is maintained throughout the process
* Mathematical correctness of final tally
* Reduced insider attack surface

---

## Known Limitations

### Fault Tolerance

The current implementation requires all MPC servers to be available during reconstruction.

### Database Scalability

SQLite may become a bottleneck under high concurrency.

### Network Security

The prototype uses HTTP for local testing. Production deployments should enforce HTTPS/TLS.

---

## Future Improvements

* k-of-n threshold secret sharing
* Docker-based distributed deployment
* PostgreSQL migration
* Byzantine fault tolerance
* Zero-Knowledge Proof integration
* Cloud-native deployment architecture
* Enhanced audit and monitoring systems

---

## Contributors

* Parun Sethupathy
* Aayush Sundaresan

---

## References

1. Adi Shamir, *How to Share a Secret*, Communications of the ACM, 1979.
2. Cramer, Damgård & Nielsen, *Secure Multiparty Computation and Secret Sharing*.
3. Flask Documentation.
