export function withUrls<T extends Record<string, any>>(data: T, baseUrl: string, pathKeys: string[] = ["path"]): T {
    return Object.fromEntries(
        Object.entries(data).map(([key, value]) => {
            if (pathKeys.includes(key) && typeof value === "string") {
                const urlKey = "url";
                return [urlKey, new URL(value, baseUrl).href];
            }
            return [key, value];
        })
    ) as T;
}
