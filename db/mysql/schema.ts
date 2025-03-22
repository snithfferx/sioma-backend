import {
    char,
    date,
    datetime,
    double,
    float,
    int,
    mysqlTable,
    text,
    timestamp,
    tinyint,
    varchar
} from "drizzle-orm/mysql-core";

export const Products = mysqlTable("productos", {
    id: int("id_producto").primaryKey().autoincrement().notNull(),
    productType: int("id_tipo_producto"),
    image: text("imagen"),
    name: varchar("nombre", { length: 100 }),
    upc: varchar({ length: 100 }),
    sku: varchar("modelo", { length: 100 }).notNull(),
    specsLink: varchar("enlace", { length: 500 }).notNull(),
    longDescription: text("descripcion"),
    warehouse: int("id_ubicacion"),
    defaultMinStock: int("stock_minimo"),
    defaultMaxStock: int("stock_maximo"),
    createdAt: date("fecha_intro", { mode: 'string' }),
    defaultWarranty: varchar("garantia_por_defecto", { length: 100 }),
    disabled: int("desabilitar").notNull().default(0),
    weight: varchar("peso", { length: 200 }),
    postSale: varchar("postventa", { length: 15 }),
    cesc: varchar({ length: 15 }).notNull(),
    shortDescription: text("descripcion_corta"),
    refurbished: varchar("seminuevo", { length: 15 }).default('\'false\''),
    offerEnd: date("vencimiento", { mode: 'string' }),
    offer: varchar("promocion", { length: 15 }).default('\'false\''),
    showDescription: varchar("mostrar_des", { length: 10 }),
    warrantyTerms: varchar("terminos_garantia", { length: 500 }),
    discount: varchar("descuento_porcentaje", { length: 25 }),
    mpn: varchar("numero_parte", { length: 250 }),
    origin: int("id_pais_origen")
});

export const ProductTypes = mysqlTable("tipo_producto", {
    id: int("id_tipo_producto").primaryKey().autoincrement().notNull(),
    name: varchar("tipo_producto", { length: 100 }),
    category: int("id_tipo_categoria").notNull(),
    isLine: int("is_linea").notNull(),
    priceCategory: int("id_categoria_clientes").default(4),
});

export const Categories = mysqlTable("tipo_categoria", {
    id: int("id_tipo_categoria").primaryKey().autoincrement().notNull(),
    name: varchar("tipo_categoria", { length: 100 }).notNull(),
    clientCategory: int("id_categoria_clientes").default(4),
});

export const Warehouses = mysqlTable("ubicacion", {
    id: int("id_ubicacion").primaryKey().autoincrement().notNull(),
    name: varchar("ubicacion", { length: 100 }).notNull(),
});

export const WarehouseStocks = mysqlTable("ubicacion_asignacion", {
    id: int("id_ubicacion_asignacion").primaryKey().autoincrement().notNull(),
    warehouse: int("id_ubicacion").notNull(),
    productId: int("id_producto").notNull(),
    quantity: int("cantidad").notNull(),
    movementDate: date("fecha_movimiento", { mode: 'string' }),
    idUser: int("id_usuario"),
    stock: int(),
    idWareHouseOrigin: int("id_ubicacion_origen"),
});

export const SucursalRelations = mysqlTable("ubicacion_sucursal", {
    id: int("id_ubicacion_sucursal").primaryKey().autoincrement().notNull(),
    warehouse: int("id_ubicacion").notNull(),
    sucursal: int("id_sucursal").notNull(),
});

export const Users = mysqlTable("usuarios", {
    id: int("id_usuario").autoincrement().notNull(),
    name: varchar("nombre", { length: 100 }),
    idPuesto: int("id_puesto"),
    userName: varchar("usuario", { length: 100 }),
    password: varchar("clave", { length: 9 }),
    level: int("id_nivel"),
    mobil: varchar("movil", { length: 100 }).notNull(),
    telephone: varchar("telefono_fijo", { length: 100 }).notNull(),
    dui: varchar("dui", { length: 100 }).notNull(),
    nit: varchar("nit", { length: 100 }).notNull(),
    isss: varchar("iss", { length: 100 }).notNull(),
    afp: varchar("afp", { length: 100 }).notNull(),
    email: varchar("email", { length: 100 }).notNull(),
    code: varchar("codigo", { length: 50 }).notNull(),
    active: varchar("activo", { length: 15 }).default('\'true\'').notNull(),
    area: varchar("area", { length: 200 }),
    cheaf: varchar("jefatura", { length: 15 }).default('\'false\'').notNull(),
    sucursal: int("id_sucursal"),
    company: int("id_empresa"),
});

export const Countries = mysqlTable("pais_origen", {
    id: int("id_pais_origen").autoincrement().notNull(),
    name: varchar("pais_origen", { length: 250 }).notNull(),
});

export const BrandRelations = mysqlTable("producto_asociado_marca", {
    productId: int("id_producto").notNull(),
    brandId: int("id_marca").notNull(),
    storeState: int("estado_tienda"),
});

export const AverageCost = mysqlTable("costo_promedio", {
    id: int("id_costo_promedio").autoincrement().notNull(),
    product: int("id_producto"),
    cost: double("costo_promedio"),
    total: double("costo_total_promediado"),
    rised: varchar("elevado", { length: 15 }),
    user: varchar("usuario", { length: 25 }),
    dateTime: varchar("fecha_hora", { length: 50 }),
    restoredEntry: int("entrada_restaurada"),
    // createdAt: datetime("created_at", { mode: 'string' }).default('current_timestamp()').notNull(),
    // updatedAt: datetime("updated_at", { mode: 'string' }).default('current_timestamp()').notNull(),
});

export const AddedValues = mysqlTable("valor_agregado", {
    id: int("id_valor_agregado").autoincrement().notNull(),
    clientCategory: int("id_categoria_clientes").notNull().default(0),
    product: int("id_producto").notNull(),
    added: double("valor_agregado").notNull(),
    user: varchar("usuario", { length: 200 }),
    changeDate: date("fecha_cambio", { mode: 'string' }),
    time: varchar("hora", { length: 25 }),
    changeState: varchar("estado_cambio", { length: 5 }),
});

export const Sucursals = mysqlTable("sucursal", {
    id: int("id_sucursal").autoincrement().notNull(),
    name: varchar("Nombre", { length: 250 }).notNull(),
    telephone: varchar("Telefono", { length: 9 }),
    color: varchar({ length: 25 }),
    active: varchar("activo", { length: 15 }).default('\'true\''),
});

export const Brands = mysqlTable("marca", {
    id: int("id_marca").autoincrement().notNull(),
    name: varchar("marca", { length: 255 }).notNull(),
    storeStatus: int("estado_tienda").notNull(),
    storeCollection: varchar("id_coleccion_tienda", { length: 100 }).notNull(),
});

export const Stocks = mysqlTable("existencias", {
    id: int("id_existencia").autoincrement().notNull(),
    product: int("id_producto"),
    stock: int("existencias"),
    stockDate: date("fecha", { mode: 'string' }).notNull(),
    outStockDate: date("fecha_agotado", { mode: 'string' }),
});

export const Metadatas = mysqlTable("metadatos", {
    id: int("id_metadato").autoincrement().notNull(),
    productType: int("id_tipo_producto").notNull(),
    name: varchar({ length: 255 }).notNull(),
    position: int("posicion").notNull(),
    createdAt: datetime("fecha_creacion", { mode: 'string' }).notNull(),
    active: int("activo").notNull(),
    commonName: int("id_nombre_comun").notNull(),
    isFeature: int("feature").notNull(),
    format: varchar("formato_metadato", { length: 250 }),
    tooltip: varchar({ length: 500 }),
    group: varchar("id_grupo", { length: 250 }),
    allowDescription: int("description_activo").notNull(),
});

export const MetadataRelations = mysqlTable("producto_asociado_metadato", {
    id: int("id_producto_asociado_metadato").autoincrement().notNull(),
    product: int("id_producto").notNull(),
    metadata: int("id_metadato").notNull(),
    content: varchar({ length: 255 }).notNull(),
    active: int().notNull(),
});

export const ProductSEO = mysqlTable("producto_asociado_seo", {
    product: int("id_producto").notNull(),
    seo: varchar("SEO", { length: 500 }).notNull(),
    nombreComunChk: int("nombre_comun_chk").notNull(),
    marcaChk: int("marca_chk").notNull(),
    metadatosCount: int("metadatos_count").notNull(),
    metadescripcion: varchar({ length: 500 }).notNull(),
});

export const ShopifyClientBillingAddress = mysqlTable("shopify_client_billing_address", {
    id: int().autoincrement().notNull(),
    client: int(),
    name: varchar({ length: 150 }),
    address1: varchar({ length: 255 }),
    address2: varchar({ length: 255 }),
    phone: varchar({ length: 25 }),
    city: varchar({ length: 50 }),
    zip: varchar({ length: 20 }),
    province: varchar({ length: 50 }),
    country: varchar({ length: 50 }),
    company: varchar({ length: 150 }),
    latitude: varchar({ length: 50 }),
    longitude: varchar({ length: 50 }),
    countryCode: varchar("country_code", { length: 10 }),
    provinceCode: varchar("province_code", { length: 10 }),
    createdAt: timestamp("created_at", { mode: 'string' }).default('current_timestamp()').notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }).default('current_timestamp()').notNull(),
});

export const ShopifyClientShipingAddress = mysqlTable("shopify_client_shiping_address", {
    id: int().autoincrement().notNull(),
    client: int(),
    name: varchar({ length: 150 }),
    address1: varchar({ length: 255 }),
    address2: varchar({ length: 255 }),
    phone: varchar({ length: 25 }),
    city: varchar({ length: 50 }),
    zip: varchar({ length: 20 }),
    province: varchar({ length: 50 }),
    country: varchar({ length: 50 }),
    company: varchar({ length: 50 }),
    latitude: varchar({ length: 50 }),
    longitude: varchar({ length: 50 }),
    countryCode: varchar("country_code", { length: 10 }),
    provinceCode: varchar("province_code", { length: 10 }),
    createdAt: timestamp("created_at", { mode: 'string' }).default('current_timestamp()').notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }).default('current_timestamp()').notNull(),
});

export const ShopifyFulfillmentDetails = mysqlTable("shopify_fulfillment_details", {
    id: int().autoincrement().notNull(),
    fulfillmentId: varchar("fulfillment_id", { length: 100 }),
    fulfillableQuantity: int("fulfillable_quantity"),
    fulfillmentService: varchar("fulfillment_service", { length: 100 }),
    fulfillmentStatus: varchar("fulfillment_status", { length: 150 }),
    price: float({ precision: 10, scale: 6 }),
    productId: varchar("product_id", { length: 100 }),
    properties: varchar({ length: 255 }),
    quantity: int(),
    requiresShipping: tinyint("requires_shipping"),
    taxable: tinyint(),
    totalDiscount: tinyint("total_discount"),
    variantId: varchar("variant_id", { length: 100 }),
    variantTitle: varchar("variant_title", { length: 150 }),
    createdAt: timestamp("created_at", { mode: 'string' }).default('current_timestamp()').notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }).default('current_timestamp()').notNull(),
});

export const ShopifyOrderFulfillments = mysqlTable("shopify_order_fulfillments", {
    id: varchar({ length: 100 }).notNull(),
    locationId: varchar("location_id", { length: 100 }),
    name: varchar({ length: 100 }),
    orderId: varchar("order_id", { length: 100 }),
    receipt: varchar({ length: 100 }),
    service: varchar({ length: 150 }),
    shipmentStatus: varchar("shipment_status", { length: 100 }),
    status: varchar({ length: 100 }),
    trackingCompany: varchar("tracking_company", { length: 50 }),
    trackingNumber: varchar("tracking_number", { length: 150 }),
    trackingNumbers: int("tracking_numbers"),
    trackingUrl: text("tracking_url"),
    trackingUrls: int("tracking_urls"),
    createdAt: timestamp("created_at", { mode: 'string' }).default('current_timestamp()').notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }).default('current_timestamp()').notNull(),
});

export const ShopifyOrderTrackingNumbers = mysqlTable("shopify_order_tracking_numbers", {
    id: int().autoincrement().notNull(),
    order: varchar({ length: 100 }),
    fulfillment: varchar({ length: 100 }),
    number: varchar({ length: 150 }),
    status: varchar({ length: 100 }),
    company: varchar({ length: 50 }),
    trackingUrl: int("tracking_url"),
    createdAt: timestamp("created_at", { mode: 'string' }).default('current_timestamp()').notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }).default('current_timestamp()').notNull(),
});

export const ShopifyOrderTrackingUrls = mysqlTable("shopify_order_tracking_urls", {
    id: int().autoincrement().notNull(),
    tracking: int(),
    status: varchar({ length: 100 }),
    company: varchar({ length: 50 }),
    url: text(),
    createdAt: timestamp("created_at", { mode: 'string' }).default('current_timestamp()').notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }).default('current_timestamp()').notNull(),
});

export const Group = mysqlTable("store_group", {
    id: int("id_grupo").autoincrement().notNull(),
    commonName: int("id_nombre_comun").notNull(),
    name: varchar("nombre_grupo", { length: 100 }).notNull(),
    order: int("group_order").notNull(),
});

export const OrderShopifyFinancial = mysqlTable("order_shopify_financial", {
    id: int().autoincrement().notNull(),
    orderId: varchar("order_id", { length: 100 }).notNull(),
    status: varchar({ length: 100 }).notNull(),
    orderStatusUrl: varchar("order_status_url", { length: 100 }).notNull(),
    gateway: varchar({ length: 150 }).notNull(),
    reference: varchar({ length: 150 }).notNull(),
    currency: varchar({ length: 50 }).notNull(),
    processedAt: datetime("processed_at", { mode: 'string' }).notNull(),
    processingMethod: varchar("processing_method", { length: 150 }).notNull(),
    referringSite: varchar("referring_site", { length: 250 }).notNull(),
    sourceIdentifier: varchar("source_identifier", { length: 150 }).notNull(),
    sourceName: varchar("source_name", { length: 150 }).notNull(),
    sourceUrl: text("source_url"),
    subtotalPrice: float("subtotal_price", { precision: 10, scale: 6 }),
    totalDiscounts: float("total_discounts", { precision: 10, scale: 6 }),
    totalTax: float("total_tax", { precision: 10, scale: 6 }),
    totalPrice: float("total_price", { precision: 10, scale: 6 }),
    paymentDetails: int("payment_details").notNull(),
    createdAt: timestamp("created_at", { mode: 'string' }).default('current_timestamp()').notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }).default('current_timestamp()').notNull(),
});

export const ProductStore = mysqlTable("producto_actualizacion", {
    productId: int("id_producto").notNull(),
    productStoreId: varchar("id_producto_tienda", { length: 100 }).notNull(),
    commonName: varchar("nombre_comun", { length: 255 }).notNull(),
    storePrice: int("precio_tienda").notNull(),
    updatedAt: datetime("fecha_actualizacion", { mode: 'string' }).notNull(),
    storeStatus: varchar("estado_tienda", { length: 11 }).default('\'').notNull(),
    hasDescription: int("has_description").notNull(),
    productPrice: double("precio_producto"),
    priceStatus: int("estado_precio").notNull(),
    offerPrice: double("precio_promocion"),
    activeOffer: int("promocion_actual").notNull(),
    offerCollect: varchar("collect_promocion", { length: 50 }),
    combo: char("Combo", { length: 1 }).notNull(),
    comboId: varchar("id_Combo", { length: 100 }).notNull(),
    bundle: char("Bundle", { length: 1 }).notNull(),
    productBundleId: varchar("id_product_Bundle", { length: 100 }).notNull(),
    inDsComputer: varchar("IN_DS_Computer", { length: 11 }).notNull(),
    idDsComputer: varchar("id_ds_computer", { length: 100 }).notNull(),
    isVariant: int().notNull(),
    mainVariant: varchar("id_producto_principal", { length: 250 }).notNull(),
    variantTitle: varchar("Titulo_variante", { length: 250 }).notNull(),
    variantId: varchar("id_variante", { length: 250 }).notNull(),
});

export const ProductoAsociadoSeo = mysqlTable("producto_asociado_seo", {
    idProducto: int("id_producto").notNull(),
    seo: varchar("SEO", { length: 500 }).notNull(),
    nombreComunChk: int("nombre_comun_chk").notNull(),
    marcaChk: int("marca_chk").notNull(),
    metadatosCount: int("metadatos_count").notNull(),
    metadescripcion: varchar({ length: 500 }).notNull(),
});

export const Metadatos = mysqlTable("metadatos", {
    idMetadato: int("id_metadato").autoincrement().notNull(),
    idTipoProducto: int("id_tipo_producto").notNull(),
    metadato: varchar({ length: 255 }).notNull(),
    posicion: int().notNull(),
    fechaCreacion: datetime("fecha_creacion", { mode: 'string' }).notNull(),
    activo: int().notNull(),
    idNombreComun: int("id_nombre_comun").notNull(),
    feature: int().notNull(),
    formatoMetadato: varchar("formato_metadato", { length: 250 }),
    tooltip: varchar({ length: 500 }),
    idGrupo: varchar("id_grupo", { length: 250 }),
    descriptionActivo: int("description_activo").notNull(),
});

export const CommonName = mysqlTable("nombre_comun", {
    id: int("id_nombre_comun").autoincrement().notNull(),
    productType: int("id_tipo_producto").notNull(),
    name: varchar("nombre_comun", { length: 255 }).notNull(),
    position: int("posicion").notNull(),
    createdAt: datetime("fecha_creacion", { mode: 'string' }).notNull(),
    active: int("activo").notNull(),
    storeId: varchar("id_tienda", { length: 100 }).notNull(),
    handle: varchar({ length: 500 }).notNull(),
    keywords: varchar("terminos_de_busqueda", { length: 500 }),
});

export const CommonNameCategoryStore = mysqlTable("nombre_comun_categoria_tienda", {
    commonName: int("id_nombre_comun").notNull(),
    categoryStore: int("id_categoria_tienda").notNull(),
    position: int("posicion").notNull(),
    createdAt: datetime("fecha_creacion", { mode: 'string' }).notNull(),
    active: int("activo").notNull(),
});

export const CategoryStore = mysqlTable("categoria_tienda", {
    id: int("id_categoria_tienda").autoincrement().notNull(),
    name: varchar("categoria_tienda", { length: 255 }).notNull(),
    storeId: varchar("id_tienda", { length: 100 }).notNull(),
    handle: varchar({ length: 500 }).notNull(),
    isLinea: int("is_linea").notNull(),
    storeOfferId: varchar("id_promocion_tienda", { length: 100 }).notNull(),
    promoHandle: varchar("promo_handle", { length: 500 }).notNull(),
});

export const OfferPrice = mysqlTable("precio_promocion", {
    id: int("id_precio_promocion").autoincrement().notNull(),
    product: int("id_producto").notNull(),
    price: double("precio", { precision: 10, scale: 2 }).notNull(),
    user: int("id_usuario"),
});

export const ClientCategories = mysqlTable("categorias_clientes", {
    id: int("id_categoria_clientes").autoincrement().notNull(),
    name: varchar("categoria_clientes", { length: 100 }).notNull(),
});