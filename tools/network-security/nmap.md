#  Nmap: Network Mapping & Security Scanning

## Overview

**Nmap (Network Mapper)** is a powerful open-source tool used for network discovery, security auditing, and vulnerability assessment. It helps administrators and security professionals identify active hosts, open ports, running services, and potential security risks.

## Installation

### Linux
```bash
sudo apt install nmap        # Debian/Ubuntu
sudo yum install nmap        # RHEL/CentOS
```

### macOS
```bash
brew install nmap
```

### Windows
Download from [https://nmap.org/download.html](https://nmap.org/download.html)

---

## 🔧 Common Use Cases

| Use Case                        | Description |
|--------------------------------|-------------|
| Host Discovery                 | Identify live systems on a network |
| Port Scanning                 | Detect open TCP/UDP ports |
| Service Enumeration           | Identify services and versions |
| OS Detection                  | Guess operating system and device type |
| Vulnerability Scanning        | Detect known vulnerabilities (with NSE scripts) |
| Firewall Evasion              | Bypass basic filtering mechanisms |

---

## Example Commands

### 1. **Ping Sweep (Host Discovery)**
```bash
nmap -sn 192.168.1.0/24
```
Scans the subnet to find live hosts without port scanning.

---

### 2. **TCP Port Scan**
```bash
nmap -sT 192.168.1.10
```
Performs a full TCP connect scan on the target.

---

### 3. **Stealth SYN Scan (Recommended)**
```bash
nmap -sS 192.168.1.10
```
SYN scan (half-open) is faster and less detectable.

---

### 4. **Service & Version Detection**
```bash
nmap -sV 192.168.1.10
```
Identifies services and their versions running on open ports.

---

### 5. **Operating System Detection**
```bash
nmap -O 192.168.1.10
```
Attempts to determine the OS of the target host.

---

### 6. **Aggressive Scan (All-in-One)**
```bash
nmap -A 192.168.1.10
```
Performs OS detection, version detection, script scanning, and traceroute.

---

### 7. **Scan Multiple Targets**
```bash
nmap -sS -iL targets.txt
```
Reads a list of IPs from `targets.txt`.

---

### 8. **Scan Specific Ports**
```bash
nmap -p 22,80,443 192.168.1.10
```
Scans only SSH, HTTP, and HTTPS ports.

---

### 9. **UDP Scan**
```bash
nmap -sU -p 53,161 192.168.1.10
```
Scans DNS and SNMP UDP ports.

---

### 10. **Run Vulnerability Scripts (NSE)**
```bash
nmap --script vuln 192.168.1.10
```
Uses Nmap Scripting Engine to detect known vulnerabilities.

---

##  Best Practices

- Always scan with permission—unauthorized scanning may violate laws or policies.
- Use stealth scans (`-sS`) to reduce detection risk.
- Limit scan scope and intensity to avoid network disruption.
- Combine Nmap with logging tools (e.g., Splunk) for audit trails.
- Regularly update Nmap to access the latest scripts and detection capabilities.

---

## Resources

- [Nmap Official Documentation](https://nmap.org/book/man.html)
- [Nmap Cheat Sheet](https://nmap.org/man/en/)
- [NSE Script Library](https://nmap.org/nsedoc/)

---
2025 Bio Glytch Studios
