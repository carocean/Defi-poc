import React from "react";
import { Box, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { MetaMaskInpageProvider } from "@metamask/providers";
import Web3 from "web3";


declare global {
    interface Window {
        ethereum?: MetaMaskInpageProvider;
    }
}

type WalletConnectorProps = {
    onWalletSelect: (walletName: string,address:string) => void; // 钱包选择的回调
};
function connectWallet(wallet:string,onWalletSelect: { (walletName: string, address: string): void; (arg0: string, arg1: string): void; }){
    let _address:string='';
    switch (wallet){
        case 'MetaMask':
            // Check if MetaMask is installed
            if (typeof window.ethereum !== "undefined") {
                const web3 = new Web3(window.ethereum);

                // Check if any account is already authorized
                web3.eth
                    .getAccounts()
                    .then((accounts) => {
                        if (accounts.length > 0) {
                            // Wallet is already connected, directly return the address
                            const walletAddress = accounts[0];
                            console.log(`Already connected wallet: ${walletAddress}`);
                            onWalletSelect("MetaMask", walletAddress);
                        } else {
                            // Request to connect the wallet
                            web3.eth.requestAccounts()
                                .then((newAccounts) => {
                                    let wAccounts=newAccounts as string[];
                                    if (wAccounts.length > 0) {
                                        // 成功连接，返回第一个账户地址
                                        const walletAddress = wAccounts[0];
                                        console.log(`Connected wallet: ${walletAddress}`);
                                        onWalletSelect("MetaMask", walletAddress);
                                    } else {
                                        alert("No accounts found. Please check MetaMask.");
                                    }
                                })
                                .catch((error) => {
                                    console.error("Error requesting accounts:", error);
                                    alert("Failed to connect MetaMask. Please try again.");
                                });
                        }
                    })
                    .catch((error) => {
                        console.error("Error checking accounts:", error);
                    });


            } else {
                // MetaMask 未安装
                alert("MetaMask is not installed. Please install MetaMask and try again.");
            }
        break;
        default:
            alert('Sorry, only MetaMask wallet is supported.');
            break;
    }
}
const WalletConnector: React.FC<WalletConnectorProps> = ({ onWalletSelect }) => {
    // List of available wallets
    const wallets = ["MetaMask", "WalletConnect", "Coinbase Wallet", "Trust Wallet"];

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 1,
            }}
        >
            <List>
                {wallets.map((wallet) => (
                    <ListItem key={wallet} disablePadding>
                        <ListItemButton onClick={() => connectWallet(wallet,onWalletSelect)}>
                            <ListItemText primary={wallet} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default WalletConnector;