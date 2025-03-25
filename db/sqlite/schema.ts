import { sqliteTable, int, text, integer, blob, real } from "drizzle-orm/sqlite-core"

export const Users = sqliteTable('users', {
    id: int('id').primaryKey({ autoIncrement: true }),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    userName: text('user_name').notNull().unique(),
    phone: text('telephone'),
    verifiedToken: text('verified_token'),
    emailVerified: int('email_verified', { mode: 'boolean' }),
    resetToken: text('reset_token'),
    tokenExpiry: int('reset_expiry', { mode: 'timestamp' }),
    apiToken: text('api_token'),
    person: int("person"),
    level: int("level"),
    contact: int("contact"),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const UserLevel = sqliteTable('user_level', {
    id: int('id').primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    levelValue: text('level_value').notNull(),
    permissions: text("permissions").default('[1]'),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const Person = sqliteTable('person', {
    id: int('id').primaryKey({ autoIncrement: true }),
    firstName: text('first_name').notNull(),
    secondName: text('second_name'),
    firstLastName: text('first_last_name').notNull(),
    secondLastName: text('second_last_name'),
    thirdName: text('third_name'),
    thirdLastName: text('third_last_name'),
    gender: text("gender"),
    birthday: int("birthday", { mode: 'timestamp' }),
    address: text("address"),
    phone: text("phone").unique(),
    email: text("email").unique(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const Address = sqliteTable('address', {
    id: int('id').primaryKey({ autoIncrement: true }),
    name: text("name"),
    address: text("address"),
    phone: text("phone"),
    email: text("email"),
    contact: text("contact"),
    contact_phone: text("contact_phone"),
    contact_email: text("contact_email"),
    country: text("country"),
    state: text("state"),
    city: text("city"),
    street: text("street"),
    optional: text("optional"),
    status: int("status").default(1),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const Contact = sqliteTable('contact', {
    id: int('id').primaryKey({ autoIncrement: true }),
    name: text("name"),
    email: text("email"),
    homePhone: text("homePhone"),
    mobilePhone: text("mobilePhone"),
    workPhone: text("workPhone"),
    addressId: int("addressId"),
    skype: text("skype"),
    whatsapp: int("whatsapp").default(0),
    status: int("status").default(1),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const Status = sqliteTable('status', {
    id: int('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    description: text('description'),
    active: int('active').default(1),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const ShopifySession = sqliteTable('shopify_session', {
    id: text('id').primaryKey(),
    shop: text('shop').notNull(),
    state: text('state').notNull(),
    isOnline: integer('is_online', { mode: 'boolean' }).notNull().default(false),
    scope: text('scope'),
    expires: text('expires'),
    accessToken: text('access_token'),
    userId: blob('user_id', { mode: 'bigint' }),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const UserSession = sqliteTable('user_session', {
    id: text('id').primaryKey(),
    userId: blob('user_id', { mode: 'bigint' }),
    token: text('token').notNull(),
    expires: text('expires').notNull(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
})

export const Products = sqliteTable('products', {
    id: int("id").primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    handle: text('hadle'),
    longDescription: text('long_description'),
    shortDescription: text('short_description'),
    seoDescription: text('seo_description'),
    tags: text("tags", { mode: 'json' }).default('[]'),
    sku: text("sku"),
    mpn: text("mpn"),
    upc: text("upc").notNull(),
    ean: text("ean"),
    isbn: text("isbn"),
    weight: real("weight"),
    weightUnit: text('weight_unit'),
    width: real("width"),
    height: real("height"),
    length: real("length"),
    warranty: integer("warranty", { mode: 'number' }).default(0),
    innerDiameter: real('inner_diameter'),
    outerDiameter: real('outer_diameter'),
    measureUnit: text('measure_unit'),
    customizable: integer("customizable", { mode: 'boolean' }),
    downloadable: integer("downloadable", { mode: 'boolean' }),
    downloadableFiles: text('downloadable_files', { mode: 'json' }),
    customizableFields: text('customizable_fields', { mode: 'json' }),
    shippingVolume: real('shipping_volume'),
    shippingVolumeUnit: text('shipping_volume_unit'),
    shippingWeight: real('shipping_weight'),
    shippingWeightUnit: text('shipping_weight_unit'),
    syncronized: integer("syncronized", { mode: 'boolean' }),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const ProductRelations = sqliteTable('product_relations', {
    id: integer("id", { mode: 'number' }).primaryKey(),
    product: integer("product", { mode: 'number' }).notNull(),
    status: integer("status", { mode: 'number' }).notNull(),
    brand: integer("brand", { mode: 'number' }).notNull(),
    categories: text('categories'),
    images: text('images'),
    prices: text('prices'),
    stocks: text('stocks'),
    store: blob("store", { mode: 'bigint' }),
    variants: text('variants'),
    dsin: int("dsin").notNull(),
    productTypes: text('product_types'),
    commonNames: text('common_name').default('[]'),
    origin: int("origin"),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const Brands = sqliteTable('brands', {
    id: integer("id", { mode: 'number' }).primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    logo: text('logo'),
    active: integer("active", { mode: 'boolean' }),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const CommonNames = sqliteTable('common_names', {
    id: integer("id", { mode: 'number' }).primaryKey(),
    name: text("name"),
    position: integer("position").default(1),
    active: integer("active", { mode: 'boolean' }).default(true),
    descActive: integer("desc_active", { mode: 'boolean' }).default(true),
    parentId: integer("parent_id"),
    categories: text("categories"),
    productTypes: text("product_types"),
    storeId: text("store_id"),
    storeName: text("store_name"),
    handle: text("handle"),
    isLinea: integer("is_line", { mode: 'boolean' }),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const Tags = sqliteTable('tags', {
    id: integer("id", { mode: 'number' }).primaryKey(),
    name: text("name"),
    active: integer("active", { mode: 'boolean' }).default(true),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const Categories = sqliteTable('categories', {
    id: integer("id", { mode: 'number' }).primaryKey(),
    name: text("name"),
    slug: text("slug"),
    description: text("description"),
    parents: text("parents"),
    active: integer("active", { mode: 'boolean' }).default(true),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const Groups = sqliteTable('groups', {
    id: integer("id", { mode: 'number' }).primaryKey(),
    name: text("name"),
    position: integer("position", { mode: 'number' }).default(1),
    active: integer("active", { mode: 'boolean' }).default(true),
    isAllowDesc: integer("is_allow_desc", { mode: 'boolean' }).default(true),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const Metadatas = sqliteTable('metadatas', {
    id: integer("id").primaryKey(),
    name: text("name").notNull(),
    position: integer("position", { mode: 'number' }).default(1),
    active: integer("active", { mode: 'boolean' }).default(true),
    allowDescription: integer('allow_description', { mode: 'boolean' }).default(true),
    isFeature: integer('is_feature', { mode: 'boolean' }).default(false),
    format: text("format"),
    tooltip: text("tooltip"),
    idGroup: integer('id_group', { mode: 'number' }).default(1),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const Prices = sqliteTable('prices', {
    id: integer("id", { mode: 'number' }).primaryKey(),
    cost: real("cost").notNull().default(0.0),
    added: real("added").notNull().default(0.0),
    value: real("value").notNull().default(0.0),
    assignedBy: text('assigned_by').notNull(),
    active: integer("active", { mode: 'boolean' }).notNull(),
    regularPrice: real("regular_price").notNull().default(0.0),
    salePrice: real("sale_price").notNull().default(0.0),
    offer: integer("offer", { mode: 'boolean' }).notNull().default(false),
    categoryId: integer("category_id", { mode: 'number' }).notNull(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const TagsProducts = sqliteTable('tags_products', {
    id: integer("id", { mode: 'number' }).primaryKey(),
    tag: integer("tag").notNull(),
    product: integer("product").notNull(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const StoreInformation = sqliteTable('store_information', {
    id: integer("id", { mode: 'number' }).primaryKey(),
    name: text('name').notNull(),
    product: integer("product").notNull(),
    storeId: text('store_id'),
    price: real("price").notNull().default(0.0),
    priceType: integer('price_type', { mode: 'number' }).notNull(),
    offer: integer("offer", { mode: 'boolean' }).notNull(),
    status: text('status').notNull().default('1'),
    combo: text('combo'),
    bundle: text('bundle'),
    dsComputer: text('dsComputer'),
    variant: text('variant'),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const MetadataProductAsociations = sqliteTable('metadata_product_asociations', {
    id: integer("id", { mode: 'number' }).primaryKey(),
    metadataId: integer('metadata_id', { mode: 'number' }).notNull(),
    productId: integer('product_id', { mode: 'number' }).notNull(),
    content: text('content').notNull(),
    active: integer("active", { mode: 'boolean' }).notNull(),
    allowDescription: integer('allow_description', { mode: 'boolean' }).notNull(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const Stocks = sqliteTable('tmp_stocks', {
    id: integer("id", { mode: 'number' }).primaryKey(),
    productId: integer("product_id", { mode: 'number' }).notNull(),
    min: integer("min", { mode: 'number' }).notNull(),
    max: integer("max", { mode: 'number' }).notNull(),
    current: integer("current", { mode: 'number' }).notNull(),
    last: integer("last", { mode: 'number' }).notNull(),
    sucursal: integer("sucursal", { mode: 'number' }).notNull(),
    warehouse: integer("warehouse", { mode: 'number' }).notNull(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const Warehouses = sqliteTable('warehouses', {
    id: integer("id", { mode: 'number' }).primaryKey(),
    name: text('name').notNull(),
    sucursal: integer("sucursal", { mode: 'number' }).notNull(),
    code: text('code').notNull(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const Images = sqliteTable('images', {
    id: integer("id", { mode: 'number' }).primaryKey(),
    name: text('name').notNull(),
    url: text('url').notNull(),
    thumbnail: text('thumbnail').notNull(),
    postion: integer("position", { mode: 'number' }).notNull(),
    active: integer("active", { mode: 'boolean' }).notNull(),
    reference: text('references').notNull(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const Variants = sqliteTable('variants', {
    id: integer("id", { mode: 'number' }).primaryKey(),
    name: text('name').notNull(),
    title: text('title').notNull(),
    slug: text('slug').notNull(),
    sku: text('sku'),
    mpn: text('mpn'),
    upc: text('upc').notNull(),
    ean: text('ean'),
    storeId: text('store_id'),
    weight: integer("weight", { mode: 'number' }).notNull().default(0),
    weightUnit: text('weight_unit').default('kg'),
    height: integer("height", { mode: 'number' }).notNull().default(0),
    width: integer("width", { mode: 'number' }).notNull().default(0),
    length: integer("length", { mode: 'number' }).notNull().default(0),
    active: integer("active", { mode: 'boolean' }).notNull().default(true),
    measureUnit: text('measure_unit').default('mm'),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const VariantOption = sqliteTable('variant_options', {
    id: integer("id", { mode: 'number' }).primaryKey(),
    name: text('name').notNull(),
    values: text('values'),
    active: integer("active", { mode: 'boolean' }).notNull(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const VariantOptionValue = sqliteTable('variant_option_values', {
    id: integer("id", { mode: 'number' }).primaryKey(),
    name: text('name').notNull(),
    active: integer("active", { mode: 'boolean' }).notNull(),
    image: text('image'),
    value: text('value'),
    abreviation: text('abreviation'),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const VariantRelation = sqliteTable('variant_relations', {
    id: integer("id", { mode: 'number' }).primaryKey(),
    variantId: integer("variant_id", { mode: 'number' }).notNull(),
    productId: integer("product_id", { mode: 'number' }).notNull(),
    variantOptionValueId: integer("variant_option_value_id", { mode: 'number' }).notNull(),
    mainVariantId: integer("main_variant_id", { mode: 'number' }).notNull(),
    storeId: integer("store_id", { mode: 'number' }).notNull(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const Country = sqliteTable('countries', {
    id: integer("id", { mode: 'number' }).primaryKey(),
    name: text('name').notNull(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const Metafields = sqliteTable('product_metafields', {
    id: integer("id", { mode: 'number' }).primaryKey(),
    product: integer("product", { mode: 'number' }).notNull(),
    name: text("name").notNull(), // Metafield name/key
    nameSpace: text("name_space").notNull(), // Folder name container
    value: text("value").notNull(),
    description: text("description"),
    contentType: text("content_type"),
    position: integer("position", { mode: 'number' }).notNull(),
    active: integer("active", { mode: 'boolean' }).notNull(),
    allowDescription: integer("allow_description", { mode: 'boolean' }).notNull(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const Offers = sqliteTable('offers', {
    id: integer("id", { mode: 'number' }).primaryKey(),
    offerId: integer("offer_id").notNull().default(1),
    product: integer("product", { mode: 'number' }).notNull(),
    startDate: int('start_date', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    endDate: int('end_date', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    closeDate: int('close_date', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    price: real("price").notNull().default(0.0),
    storePrice: real("store_price").notNull().default(0.0),
    active: integer("active", { mode: 'boolean' }).notNull(),
    collect: blob('collect', { mode: 'bigint' }),
    status: integer("status").notNull().default(1),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const Sucursals = sqliteTable('sucursals', {
    id: integer("id", { mode: 'number' }).primaryKey(),
    name: text('name').notNull(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const User = sqliteTable('users', {
    id: integer("id", { mode: 'number' }).primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    password: text('password').notNull(),
    verifiedToken: text('verified_token'),
    resetToken: text('reset_token'),
    tokenExpiry: text('token_expiry'),
    emailVerified: integer("email_verified", { mode: 'boolean' }).notNull(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const SidebarMenu = sqliteTable('sidebar_menu', {
    id: integer("id", { mode: 'number' }).primaryKey(),
    name: text('name').notNull(),
    url: text('url').notNull(),
    icon: text('icon').notNull(),
    parentId: integer("parent_id", { mode: 'number' }),
    position: integer("position", { mode: 'number' }).notNull(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const MetadataRelations = sqliteTable('metadata_relations', {
    id: integer("id", { mode: 'number' }).primaryKey(),
    metadataId: integer('metadata_id', { mode: 'number' }).notNull(),
    commonNames: text('common_names'),
    categories: text('categories'),
    productTypes: text('product_types'),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const MetadataValue = sqliteTable('metadata_values', {
    id: integer("id", { mode: 'number' }).primaryKey(),
    metadataId: integer('metadata_id', { mode: 'number' }).notNull(),
    value: text('value').notNull(),
    active: integer("active", { mode: 'boolean' }).notNull(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const MetadataValueRelation = sqliteTable('metadata_value_relation', {
    id: integer("id", { mode: 'number' }).primaryKey(),
    metadataValue: integer("metadata_value", { mode: 'number' }).notNull(),
    product: integer("product", { mode: 'number' }).notNull(),
    content: text('content'),
    position: integer("position", { mode: 'number' }).default(1),
    active: integer("active", { mode: 'boolean' }).notNull(),
    allowDescription: integer("allow_description", { mode: 'boolean' }).notNull(),
    allowCallection: integer("allow_callection", { mode: 'boolean' }).notNull(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const ProductStocks = sqliteTable('tmp_stocks', {
    id: integer("id", { mode: 'number' }).primaryKey(),
    product_id: integer("product_id", { mode: 'number' }).notNull(),
    min: integer("min", { mode: 'number' }).notNull(),
    max: integer("max", { mode: 'number' }).notNull(),
    current: integer("current", { mode: 'number' }).notNull(),
    last: integer("last", { mode: 'number' }).notNull(),
    sucursal: integer("sucursal", { mode: 'number' }).notNull(),
    warehouse: integer("warehouse", { mode: 'number' }).notNull(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const ProductTypes = sqliteTable('product_type', {
    id: integer("id", { mode: 'number' }).primaryKey(),
    name: text('name').notNull(),
    categories: text("categories"),
    isLine: integer("is_line", { mode: 'boolean' }).notNull(),
    parents: text("parents"),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const StoreSession = sqliteTable('session', {
    id: text('id').primaryKey(),
    shop: text('shop').notNull(),
    state: text('state').notNull(),
    isOnline: integer('is_online', { mode: 'boolean' }).notNull().default(false),
    scope: text('scope'),
    expires: text('expires'),
    accessToken: text('access_token'),
    userId: blob('user_id', { mode: 'bigint' })
});