import React, { useEffect, useRef } from 'react';
import Swal from 'sweetalert2';

function InternetCheck() {
    const alertShownRef = useRef(false);

    useEffect(() => {
        const showOfflineAlert = () => {
            if (!alertShownRef.current) {
                alertShownRef.current = true;

                Swal.fire({
                    icon: 'warning',
                    title: 'No Internet Connection',
                    text: 'You are currently offline. Please check your internet connection.',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false,
                    backdrop: true,
                    customClass: {
                        popup: 'small-alert',
                        backdrop: 'swal2-backdrop-blur'
                    }
                });
            }
        };

        const handleConnectionChange = () => {
            if (navigator.onLine) {
                Swal.close();
                alertShownRef.current = false;
            } else {
                showOfflineAlert();
            }
        };

        // Initial check
        handleConnectionChange();

        // Listen for connection changes
        window.addEventListener('online', handleConnectionChange);
        window.addEventListener('offline', handleConnectionChange);

        return () => {
            window.removeEventListener('online', handleConnectionChange);
            window.removeEventListener('offline', handleConnectionChange);
        };
    }, []);

    return null;
}

export default InternetCheck;
