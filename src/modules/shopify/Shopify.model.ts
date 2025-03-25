import { shopifyApp } from "@shopify/shopify-app-express";
import { DrizzleSessionStorageSQLite } from "@shopify/shopify-app-session-storage-drizzle";
import { db } from "@DB/sqlite";
import { StoreSession } from "@DB/sqlite/schema";
import { SHOPIFY_KEY, SHOPIFY_SECRET, SHOPIFY_SHOP, SHOPIFY_SCOPES } from "@Configs/constants";

export const storage = new DrizzleSessionStorageSQLite(db, StoreSession);

export class ShopifyModel {
    private shopApiKey = SHOPIFY_KEY || '';
    private secretKey = SHOPIFY_SECRET || '';
    private shopName = SHOPIFY_SHOP || '';
    private scopes = SHOPIFY_SCOPES?.split(',') || ['read_products'];
    private shopify: any;  //ShopifyRestResources;
    constructor() {
        /*this.shopify = shopifyApi({
            apiKey: this.shopApiKey,
            apiSecretKey: this.secretKey,
            scopes: this.scopes,
            hostName: 'localhost:4321',
            hostScheme: 'http',
            apiVersion: LATEST_API_VERSION,
            isEmbeddedApp: false,
            sessionStorage: storage
        }); */
        this.shopify = shopifyApp({
            api: {
                apiKey: this.shopApiKey,
                apiSecretKey: this.secretKey,
                scopes: this.scopes,
                hostScheme: 'http',
                hostName: 'localhost:4321',
            },
            auth: {
                path: '/api/auth',
                callbackPath: '/api/auth/callback',
            },
            webhooks: {
                path: '/api/webhooks'
            },
            sessionStorage: storage,
        });
    }
}