import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Html5QrcodeScanner } from "html5-qrcode";
import "../styles/QRScannerModal.css";

const QRScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
    const scannerRef = useRef(null);
    const [, setScanning] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen && !scannerRef.current) {
            setScanning(true);
            setError("");

            const scanner = new Html5QrcodeScanner(
                "qr-reader",
                { 
                    fps: 10, 
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0,
                    rememberLastUsedCamera: true
                },
                false
            );

            scanner.render(
                (decodedText) => {
                    // QR Code scanned successfully
                    try {
                        const url = new URL(decodedText);
                        const sessionId = url.searchParams.get("sessionId");
                        const token = url.searchParams.get("token");

                        if (sessionId && token) {
                            scanner.clear();
                            scannerRef.current = null;
                            onScanSuccess({ sessionId, token });
                        } else {
                            setError("Invalid QR code format");
                        }
                    } catch (err) {
                        setError("Invalid QR code. Please scan a valid attendance QR code.");
                    }
                },
                (errorMessage) => {
                    // QR Code scan error - ignore most errors as they're just "no QR found"
                    if (errorMessage.includes("NotFoundException")) {
                        return; // Ignore "no QR code found" errors
                    }
                    console.log("QR Scan Error:", errorMessage);
                }
            );

            scannerRef.current = scanner;
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(console.error);
                scannerRef.current = null;
            }
        };
    }, [isOpen, onScanSuccess]);

    const handleClose = () => {
        if (scannerRef.current) {
            scannerRef.current.clear().catch(console.error);
            scannerRef.current = null;
        }
        setScanning(false);
        setError("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="qr-modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleClose}
            >
                <motion.div
                    className="qr-modal"
                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 50 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="qr-modal__header">
                        <h2 className="qr-modal__title">Scan QR Code</h2>
                        <button className="qr-modal__close" onClick={handleClose}>
                            ✕
                        </button>
                    </div>

                    <div className="qr-modal__content">
                        <p className="qr-modal__instruction">
                            Point your camera at the QR code displayed by your faculty
                        </p>

                        <div id="qr-reader" className="qr-reader"></div>

                        {error && (
                            <motion.div
                                className="qr-modal__error"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="qr-modal__tips">
                            <h4>Tips for better scanning:</h4>
                            <ul>
                                <li>Hold your device steady</li>
                                <li>Ensure good lighting</li>
                                <li>Keep QR code within the frame</li>
                            </ul>
                        </div>
                    </div>

                    <div className="qr-modal__footer">
                        <motion.button
                            className="btn btn--secondary"
                            onClick={handleClose}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Cancel
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default QRScannerModal;
