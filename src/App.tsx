import { useAccount, useBalance, useConnect, useDisconnect } from "wagmi";
import logo from "./assets/logot.png";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./PhoneInputCustom.css";

function App() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();
  const [activeTab, setActiveTab] = useState("learn"); // Estado para manejar tabs
  const [phoneNumber, setPhoneNumber] = useState(""); // Estado para manejar el número de teléfono

  // Hook para obtener el balance del address conectado
  const { data: balanceData, refetch } = useBalance({
    address: account?.addresses?.[0],
  });

  const cryptoTopics = [
    "What is BASE?",
    "Blockchain Basics",
    "How to Buy Cryptocurrency",
    "What is Ethereum?",
    "Crypto Wallets Explained",
    "What is DeFi?",
    "Introduction to NFTs",
    "Security in Crypto Transactions",
    "What are Smart Contracts?",
    "Crypto Mining Basics",
  ];

  // Funcionalidad para hacer fetch a un endpoint cuando se presiona el botón
  const handleCallRequest = async (topic) => {
    const walletAddress = account?.addresses?.[0]; // Obteniendo la wallet address del usuario conectado

    if (!phoneNumber) {
      alert("Please enter a valid phone number.");
      return;
    }

    if (!walletAddress) {
      alert("Wallet address not found. Please connect your wallet.");
      return;
    }

    try {
      const response = await fetch(import.meta.env.VITE_API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          walletAddress,
          topic,
        }),
      });
      if (response.ok) {
        alert("Call request successfully sent!");
      } else {
        alert("Failed to send call request.");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header con logo a la izquierda y conexión a la derecha */}
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <img src={logo} alt="Cryptocall Logo" style={styles.logo} />
        </div>
        <div style={styles.walletInfo}>
          {account.status === "connected" ? (
            <>
              <div style={styles.address}>Address: {account.addresses[0]}</div>
              <div style={styles.balanceContainer}>
                <span>
                  Balance: {balanceData?.formatted} {balanceData?.symbol}
                </span>
                <button style={styles.refreshButton} onClick={() => refetch()}>
                  R
                </button>
              </div>
              <button style={styles.button} onClick={() => disconnect()}>
                Disconnect
              </button>
            </>
          ) : (
            connectors
              .filter((connector) => connector.name === "Coinbase Wallet")
              .map((connector) => (
                <button style={styles.button} key={connector.uid} onClick={() => connect({ connector })}>
                  Connect {connector.name}
                </button>
              ))
          )}
        </div>
      </header>

      {/* Input para el número de teléfono */}
      <div style={styles.phoneInputContainer}>
        <PhoneInput
          country={"us"}
          value={phoneNumber}
          onChange={(phone) => setPhoneNumber(phone)}
          inputStyle={{ width: "30ch" }} // Ancho de 42 caracteres
          containerStyle={{ width: "80%", maxWidth: "400px", margin: "0 auto" }}
          buttonStyle={{ backgroundColor: "black", color: "white", alignItems: "center" }}
          dropdownStyle={{ backgroundColor: "black", color: "white", textAlign: "left" }}
        />

        <button style={styles.callButton} onClick={() => handleCallRequest("Talk about BASE, the side chaine of Ethereum backed by Coinbase")}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16px" height="16px" style={{ marginRight: "5px" }}>
            <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1.003 1.003 0 011.11-.21c1.12.45 2.33.69 3.59.69.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.29 21 3 13.71 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.26.24 2.47.69 3.59.14.36.06.78-.21 1.11l-2.2 2.2z" />
          </svg>
          Let's talk about BASE
        </button>
      </div>

      {/* Tabs */}
      <div style={styles.tabContainer}>
        <div style={activeTab === "learn" ? { ...styles.activeTab, flex: 1 } : { ...styles.tab, flex: 1 }} onClick={() => setActiveTab("learn")}>
          Learn Crypto
        </div>
        <div style={activeTab === "trade" ? { ...styles.activeTab, flex: 1 } : { ...styles.tab, flex: 1 }} onClick={() => setActiveTab("trade")}>
          Trade Crypto
        </div>
      </div>

      {/* Contenido de los tabs */}
      <div style={styles.tabContent}>
        {activeTab === "learn" && (
          <div style={styles.listContainer}>
            {cryptoTopics.map((topic, index) => (
              <div key={index} style={styles.card}>
                <div style={styles.cardContentRow}>
                  <div style={styles.topicContainer}>
                    <span style={styles.topicText}>{topic}</span>
                    <span style={styles.learnEarnText}>Learn and earn: 0.001 ETH</span>
                  </div>
                  <button style={styles.callButton} onClick={() => handleCallRequest(topic)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16px" height="16px" style={{ marginRight: "5px" }}>
                      <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1.003 1.003 0 011.11-.21c1.12.45 2.33.69 3.59.69.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.29 21 3 13.71 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.26.24 2.47.69 3.59.14.36.06.78-.21 1.11l-2.2 2.2z" />
                    </svg>
                    Call me and explain
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "trade" && (
          <div style={styles.tradeContainer}>
            <button style={styles.tradeButton}>Call Bot for Trade</button>
            <div style={styles.historyContainer}>
              <h3 style={styles.historyTitle}>Transaction History</h3>
              <div style={styles.historyItem}>Trade 1 - 0.1 ETH</div>
              <div style={styles.historyItem}>Trade 2 - 0.5 ETH</div>
              <div style={styles.historyItem}>Trade 3 - 1.0 ETH</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  letsTalkButton: {
    backgroundColor: "#0066cc",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    marginLeft: "10px",
    fontSize: "14px",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#1a1f36",
    color: "white",
    margin: "auto",
    maxWidth: "100%",
    padding: "10px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#1a1f36",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderBottom: "2px solid #0066cc",
    flexWrap: "wrap",
    maxWidth: "85%",
    margin: "auto",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    width: "100px",
    marginRight: "10px",
  },
  walletInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    textAlign: "right",
    maxWidth: "100%",
    overflow: "hidden",
  },
  address: {
    overflowWrap: "break-word",
  },
  button: {
    backgroundColor: "#0066cc",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "5px",
    fontSize: "14px",
  },
  phoneInputContainer: {
    margin: "20px auto",
    display: "flex",
    justifyContent: "center",
    maxWidth: "85%",
  },
  tabContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
    flexWrap: "wrap",
    maxWidth: "85%",
    margin: "auto",
    borderBottom: "2px solid #0066cc",
  },
  tab: {
    backgroundColor: "#1a1f36",
    border: "none",
    color: "#0066cc",
    padding: "10px 30px",
    cursor: "pointer",
    margin: "5px",
    borderBottom: "2px solid transparent",
    fontSize: "16px",
    textAlign: "center",
  },
  activeTab: {
    backgroundColor: "#1a1f36",
    color: "#0066cc",
    padding: "10px 30px",
    cursor: "pointer",
    margin: "5px",
    borderBottom: "2px solid #0066cc",
    fontSize: "16px",
    textAlign: "center",
  },
  tabContent: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
    maxWidth: "85%",
    margin: "auto",
  },
  listContainer: {
    width: "100%",
    textAlign: "left",
  },
  card: {
    backgroundColor: "#202940",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
  },
  cardContentRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    flexDirection: "row",
    padding: "10px",
  },
  topicContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  topicText: {
    color: "white",
    fontSize: "16px",
    marginRight: "20px",
  },
  learnEarnText: {
    color: "#00cc66",
    fontSize: "14px",
  },
  actionContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  price: {
    marginRight: "20px",
    color: "#0066cc",
  },
  callButton: {
    backgroundColor: "#0066cc",
    color: "white",
    border: "none",
    padding: "5px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    width: "auto",
    justifyContent: "center",
    maxWidth: "300px",
    whiteSpace: "nowrap",
  },
  tradeContainer: {
    textAlign: "center",
  },
  tradeButton: {
    backgroundColor: "#0066cc",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  historyContainer: {
    marginTop: "20px",
    textAlign: "left",
  },
  historyTitle: {
    borderBottom: "2px solid #0066cc",
  },
  historyItem: {
    padding: "10px 0",
    borderBottom: "1px solid #0066cc",
    color: "white",
  },
};

export default App;
