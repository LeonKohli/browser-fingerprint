interface IncognitoDetectionResult {
    isPrivate: boolean;
    browserName: string;
}

export function useIncognitoDetection() {
    const detectIncognito = async (): Promise<IncognitoDetectionResult> => {
        if (!import.meta.client) {
            return { isPrivate: false, browserName: 'Unknown' };
        }

        return new Promise((resolve, reject) => {
            let browserName = 'Unknown';

            const __callback = (isPrivate: boolean): void => {
                resolve({
                    isPrivate,
                    browserName
                });
            };

            const identifyChromium = (): string => {
                const ua = navigator.userAgent;
                if (ua.match(/Chrome/)) {
                    if ((navigator as any).brave !== undefined) {
                        return 'Brave';
                    } else if (ua.match(/Edg/)) {
                        return 'Edge';
                    } else if (ua.match(/OPR/)) {
                        return 'Opera';
                    }
                    return 'Chrome';
                } else {
                    return 'Chromium';
                }
            };

            const assertEvalToString = (value: number): boolean => {
                return value === eval.toString().length;
            };

            const feid = (): number => {
                let toFixedEngineID = 0;
                try {
                    eval(`(-1).toFixed(-1);`);
                } catch (e) {
                    toFixedEngineID = (e as Error).message.length; // Safari 44, Chrome 51, Firefox 25
                }
                return toFixedEngineID;
            };
            
            const isSafari = (): boolean => feid() === 44;
            const isChrome = (): boolean => feid() === 51;
            const isFirefox = (): boolean => feid() === 25;
            const isMSIE = (): boolean => (navigator as any).msSaveBlob !== undefined && assertEvalToString(39);

            const newSafariTest = (): void => {
                const tmp_name = String(Math.random());

                try {
                    const db = window.indexedDB.open(tmp_name, 1);

                    db.onupgradeneeded = function (i) {
                        const res = i.target as IDBDatabase;

                        try {
                            res.createObjectStore('test', {
                                autoIncrement: true
                            }).put(new Blob());

                            __callback(false);
                        } catch (e) {
                            let message = e;

                            if (e instanceof Error) {
                                message = e.message ?? e;
                            }

                            if (typeof message !== 'string') {
                                __callback(false); return;
                            }

                            const matchesExpectedError = message.includes('BlobURLs are not yet supported');

                            __callback(matchesExpectedError); return;
                        } finally {
                            res.close();
                            window.indexedDB.deleteDatabase(tmp_name);
                        }
                    };
                } catch (e) {
                    __callback(false);
                }
            };

            const oldSafariTest = (): void => {
                const openDB = (window as any).openDatabase;
                const storage = window.localStorage;
                try {
                    openDB(null, null, null, null);
                } catch (e) {
                    __callback(true); return;
                }
                try {
                    storage.setItem('test', '1');
                    storage.removeItem('test');
                } catch (e) {
                    __callback(true); return;
                }
                __callback(false);
            };

            const safariPrivateTest = (): void => {
                if (navigator.maxTouchPoints !== undefined) {
                    newSafariTest();
                } else {
                    oldSafariTest();
                }
            };

            const getQuotaLimit = (): number => {
                const w = window as any;
                if (
                    w.performance !== undefined &&
                    w.performance.memory !== undefined &&
                    w.performance.memory.jsHeapSizeLimit !== undefined
                ) {
                    return (performance as any).memory.jsHeapSizeLimit;
                }
                return 1073741824;
            };

            const storageQuotaChromePrivateTest = (): void => {
                (navigator as any).webkitTemporaryStorage.queryUsageAndQuota(
                    function (_: number, quota: number) {
                        const quotaInMib = Math.round(quota / (1024 * 1024));
                        const quotaLimitInMib = Math.round(getQuotaLimit() / (1024 * 1024)) * 2;

                        __callback(quotaInMib < quotaLimitInMib);
                    },
                    function (e: any) {
                        reject(
                            new Error(
                                'detectIncognito somehow failed to query storage quota: ' +
                                    e.message
                            )
                        );
                    }
                );
            };

            const oldChromePrivateTest = (): void => {
                const fs = (window as any).webkitRequestFileSystem;
                const success = function () {
                    __callback(false);
                };
                const error = function () {
                    __callback(true);
                };
                fs(0, 1, success, error);
            };

            const chromePrivateTest = (): void => {
                if (self.Promise !== undefined && (self.Promise as any).allSettled !== undefined) {
                    storageQuotaChromePrivateTest();
                } else {
                    oldChromePrivateTest();
                }
            };

            const firefoxPrivateTest = (): void => {
                __callback(navigator.serviceWorker === undefined);
            };

            const msiePrivateTest = (): void => {
                __callback(window.indexedDB === undefined);
            };

            const main = (): void => {
                if (isSafari()) {
                    browserName = 'Safari';
                    safariPrivateTest();
                } else if (isChrome()) {
                    browserName = identifyChromium();
                    chromePrivateTest();
                } else if (isFirefox()) {
                    browserName = 'Firefox';
                    firefoxPrivateTest();
                } else if (isMSIE()) {
                    browserName = 'Internet Explorer';
                    msiePrivateTest();
                } else {
                    reject(new Error('detectIncognito cannot determine the browser'));
                }
            };

            main();
        });
    };

    return {
        detectIncognito
    };
}

if (import.meta.client) {
    (window as any).detectIncognito = useIncognitoDetection().detectIncognito;
}