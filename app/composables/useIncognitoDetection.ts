interface IncognitoDetectionResult {
    isPrivate: boolean;
    browserName: string;
}

interface BrowserTestFunctions {
    test: (callback: (isPrivate: boolean) => void) => void;
    identify?: () => string;
}

export function useIncognitoDetection() {
    const detectIncognito = async (): Promise<IncognitoDetectionResult> => {
        if (!process.client) {
            return { isPrivate: false, browserName: 'Unknown' };
        }

        const getBrowserType = (): string => {
            const toFixedLength = (() => {
                try {
                    (-1).toFixed(-1);
                } catch (e) {
                    return (e as Error).message.length;
                }
                return 0;
            })();

            if (toFixedLength === 44) return 'Safari';
            if (toFixedLength === 51) return 'Chrome';
            if (toFixedLength === 25) return 'Firefox';
            if ((navigator as any).msSaveBlob !== undefined && eval.toString().length === 39) return 'IE';
            return 'Unknown';
        };

        const identifyChromium = (): string => {
            const ua = navigator.userAgent;
            if (!ua.match(/Chrome/)) return 'Chromium';
            if ((navigator as any).brave !== undefined) return 'Brave';
            if (ua.match(/Edg/)) return 'Edge';
            if (ua.match(/OPR/)) return 'Opera';
            return 'Chrome';
        };

        const browserTests: Record<string, BrowserTestFunctions> = {
            Safari: {
                test: (callback: (isPrivate: boolean) => void) => {
                    if (navigator.maxTouchPoints !== undefined) {
                        const dbName = `test_${Math.random()}`;
                        try {
                            const db = window.indexedDB.open(dbName, 1);
                            db.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                                const db = (event.target as IDBOpenDBRequest).result;
                                try {
                                    db.createObjectStore('test', { autoIncrement: true }).put(new Blob());
                                    callback(false);
                                } catch (e) {
                                    const error = e instanceof Error ? e.message : String(e);
                                    callback(error.includes('BlobURLs are not yet supported'));
                                } finally {
                                    db.close();
                                    window.indexedDB.deleteDatabase(dbName);
                                }
                            };
                        } catch {
                            callback(false);
                        }
                    } else {
                        try {
                            (window as any).openDatabase(null, null, null, null);
                            localStorage.setItem('test', '1');
                            localStorage.removeItem('test');
                            callback(false);
                        } catch {
                            callback(true);
                        }
                    }
                }
            },
            Chrome: {
                test: (callback: (isPrivate: boolean) => void) => {
                    const getQuotaLimit = (): number => {
                        const memory = (performance as any).memory;
                        return memory?.jsHeapSizeLimit || 1073741824;
                    };

                    if (self.Promise && (self.Promise as any).allSettled) {
                        (navigator as any).webkitTemporaryStorage.queryUsageAndQuota(
                            (_: number, quota: number) => {
                                const quotaInMib = Math.round(quota / (1024 * 1024));
                                const limitInMib = Math.round(getQuotaLimit() / (1024 * 1024)) * 2;
                                callback(quotaInMib < limitInMib);
                            },
                            () => callback(true)
                        );
                    } else {
                        const fs = (window as any).webkitRequestFileSystem;
                        fs(0, 1, () => callback(false), () => callback(true));
                    }
                },
                identify: identifyChromium
            },
            Firefox: {
                test: (callback: (isPrivate: boolean) => void) => {
                    callback(navigator.serviceWorker === undefined);
                }
            },
            IE: {
                test: (callback: (isPrivate: boolean) => void) => {
                    callback(window.indexedDB === undefined);
                }
            }
        };

        return new Promise((resolve) => {
            const browserType = getBrowserType();
            const browserTest = browserTests[browserType];

            if (!browserTest) {
                resolve({ isPrivate: false, browserName: 'Unknown' });
                return;
            }

            const browserName = browserTest.identify?.() || browserType;
            browserTest.test((isPrivate: boolean) => {
                resolve({ isPrivate, browserName });
            });
        });
    };

    return {
        detectIncognito
    };
}