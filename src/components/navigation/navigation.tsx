import React, { FC, useState } from "react";
import { Modal, Box, Typography, Button, Menu, MenuItem } from "@mui/material";
import { navigations } from "./navigation.data";
import { Link } from "@mui/material";
import { useLocation } from "react-router-dom";
import WalletConnector from "../wallet/WalletConnector";

type NavigationData = {
    path: string;
    label: string;
};

const Navigation: FC = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const [isModalOpen, setModalOpen] = useState(false);
    const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const handleWalletSelect = (walletName: string, address: string) => {
        setConnectedWallet(address);
        closeModal();
    };

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleCopyAddress = () => {
        if (connectedWallet) {
            navigator.clipboard.writeText(connectedWallet);
            alert("Address copied to clipboard!");
        }
        handleMenuClose();
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexFlow: "wrap",
                justifyContent: "end",
                flexDirection: { xs: "column", lg: "row" },
            }}
        >
            {navigations.map(({ path: destination, label }: NavigationData) => (
                <Box
                    key={label}
                    component={Link}
                    href={destination}
                    sx={{
                        display: "inline-flex",
                        position: "relative",
                        color: currentPath === destination ? "" : "white",
                        lineHeight: "30px",
                        letterSpacing: "3px",
                        cursor: "pointer",
                        textDecoration: "none",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        alignItems: "center",
                        justifyContent: "center",
                        px: { xs: 0, lg: 3 },
                        mb: { xs: 3, lg: 0 },
                        fontSize: "20px",
                        ...(destination === "/" && { color: "primary.main" }),
                        "& > div": { display: "none" },
                        "&.current>div": { display: "block" },
                        "&:hover": {
                            color: "text.disabled",
                        },
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            top: 12,
                            transform: "rotate(3deg)",
                            "& img": { width: 44, height: "auto" },
                        }}
                    >
                        {/* eslint-disable-next-line */}
                        <img src="/images/headline-curve.svg" alt="Headline curve" />
                    </Box>
                    {label}
                </Box>
            ))}

            {connectedWallet ? (
                <Box>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleMenuClick}
                        sx={{ textTransform: "none" }}
                    >
                        {connectedWallet.substring(0, 6) + "..." + connectedWallet.substring(connectedWallet.length - 4)}
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={handleCopyAddress}>Copy Address</MenuItem>
                    </Menu>
                </Box>
            ) : (
                <Box
                    sx={{
                        position: "relative",
                        color: "white",
                        cursor: "pointer",
                        textDecoration: "none",
                        textTransform: "uppercase",
                        fontWeight: 600,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        px: { xs: 0, lg: 3 },
                        mb: { xs: 3, lg: 0 },
                        fontSize: "24px",
                        lineHeight: "6px",
                        width: "324px",
                        height: "45px",
                        borderRadius: "6px",
                        backgroundColor: "#00dbe3",
                    }}
                    onClick={openModal}
                >
                    Connect Wallet
                </Box>
            )}

            <Modal
                open={isModalOpen}
                onClose={closeModal}
                aria-labelledby="wallet-connector-title"
                aria-describedby="wallet-connector-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 3,
                    }}
                >
                    <Typography id="wallet-connector-title" variant="h6" component="h2" gutterBottom>
                        Connect Your Wallet
                    </Typography>
                    <Typography id="wallet-connector-description" sx={{ mb: 2 }}>
                        Please select a wallet to connect:
                    </Typography>
                    <WalletConnector onWalletSelect={handleWalletSelect} />
                </Box>
            </Modal>
        </Box>
    );
};

export default Navigation;
