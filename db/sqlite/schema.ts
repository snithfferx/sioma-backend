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
    person: int(),
    level: int(),
    contact: int(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const UserLevel = sqliteTable('user_level', {
    id: int('id').primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    levelValue: text('level_value').notNull(),
    permissions: text().default('[1]'),
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
    gender: text(),
    birthday: int({ mode: 'timestamp' }),
    address: text(),
    phone: text().unique(),
    email: text().unique(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const Address = sqliteTable('address', {
    id: int('id').primaryKey({ autoIncrement: true }),
    name: text(),
    address: text(),
    phone: text(),
    email: text(),
    contact: text(),
    contact_phone: text(),
    contact_email: text(),
    country: text(),
    state: text(),
    city: text(),
    street: text(),
    optional: text(),
    status: int().default(1),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const Contact = sqliteTable('contact', {
    id: int('id').primaryKey({ autoIncrement: true }),
    name: text(),
    email: text(),
    homePhone: text(),
    mobilePhone: text(),
    workPhone: text(),
    addressId: int(),
    skype: text(),
    whatsapp: int().default(0),
    status: int().default(1),
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

export const Session = sqliteTable('user_session', {
    id: text('id').primaryKey(),
    userId: blob('user_id', { mode: 'bigint' }),
    token: text('token').notNull(),
    expires: text('expires').notNull(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
})

export const Products = sqliteTable('products', {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    handle: text('hadle'),
    longDescription: text('long_description'),
    shortDescription: text('short_description'),
    seoDescription: text('seo_description'),
    tags: text({ mode: 'json' }).default('[]'), sku: text(),
    mpn: text(),
    upc: text().notNull(),
    ean: text(),
    isbn: text(),
    weight: real(),
    weightUnit: text('weight_unit'),
    width: real(),
    height: real(),
    length: real(),
    warranty: integer({ mode: 'number' }).default(0),
    innerDiameter: real('inner_diameter'),
    outerDiameter: real('outer_diameter'),
    measureUnit: text('measure_unit'),
    customizable: integer({ mode: 'boolean' }),
    downloadable: integer({ mode: 'boolean' }),
    downloadableFiles: text('downloadable_files', { mode: 'json' }),
    customizableFields: text('customizable_fields', { mode: 'json' }),
    shippingVolume: real('shipping_volume'),
    shippingVolumeUnit: text('shipping_volume_unit'),
    shippingWeight: real('shipping_weight'),
    shippingWeightUnit: text('shipping_weight_unit'),
    syncronized: integer({ mode: 'boolean' }),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const ProductRelations = sqliteTable('product_relations', {
    id: integer({ mode: 'number' }).primaryKey(),
    product: integer({ mode: 'number' }).notNull(),
    status: integer({ mode: 'number' }).notNull(),
    brand: integer({ mode: 'number' }).notNull(),
    categories: text('categories'),
    images: text('images'),
    prices: text('prices'),
    stocks: text('stocks'),
    store: integer({ mode: 'number' }),
    variants: text('variants'),
    dsin: integer({ mode: 'number' }).notNull(),
    productTypes: text('product_types'),
    commonNames: text('common_name').default('[]'),
    origin: int(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const Brands = sqliteTable('brands', {
    id: integer({ mode: 'number' }).primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    logo: text('logo'),
    active: integer({ mode: 'boolean' }),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const CommonNames = sqliteTable('common_names', {
    id: integer().primaryKey(),
    name: text(),
    position: integer().default(1),
    active: integer({ mode: 'boolean' }).default(true),
    descActive: integer("desc_active", { mode: 'boolean' }).default(true),
    parentId: integer("parent_id"),
    categories: text("categories"),
    productTypes: text("product_types"),
    storeId: text("store_id"),
    storeName: text("store_name"),
    handle: text(),
    isLinea: integer({ mode: 'boolean' }),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const Tags = sqliteTable('tags', {
    id: integer().primaryKey(),
    name: text(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const Categories = sqliteTable('categories', {
    id: integer().primaryKey(),
    name: text(),
    slug: text(),
    description: text(),
    parents: text(),
    active: integer({ mode: 'boolean' }).default(true),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const Groups = sqliteTable('groups', {
    id: integer().primaryKey(),
    name: text(),
    position: integer({ mode: 'number' }).default(1),
    active: integer({ mode: 'boolean' }).default(true),
    isAllowDesc: integer("is_allow_desc", { mode: 'boolean' }).default(true),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const Metadatas = sqliteTable('metadatas', {
    id: integer().primaryKey(),
    name: text(),
    position: integer({ mode: 'number' }).default(1),
    active: integer({ mode: 'boolean' }).default(true),
    allowDescription: integer('allow_description', { mode: 'boolean' }).default(true),
    isFeature: integer('is_feature', { mode: 'boolean' }).default(false),
    format: text(),
    tooltip: text(),
    idGroup: integer('id_group', { mode: 'number' }).default(1),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const Prices = sqliteTable('prices', {
    id: integer({ mode: 'number' }).primaryKey(),
    cost: real().notNull().default(0.0),
    added: real().notNull().default(0.0),
    value: real().notNull().default(0.0),
    assignedBy: text('assigned_by').notNull(),
    active: integer({ mode: 'boolean' }).notNull(),
    regularPrice: real("regular_price").notNull().default(0.0),
    salePrice: real("sale_price").notNull().default(0.0),
    offer: integer({ mode: 'boolean' }).notNull(),
    categoryId: integer("category_id", { mode: 'number' }).notNull(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const TagsProducts = sqliteTable('tags_products', {
    id: integer().primaryKey(),
    tag: integer().notNull(),
    product: integer().notNull(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const StoreInformation = sqliteTable('store_information', {
    id: integer().primaryKey(),
    name: text('name').notNull(),
    product: integer().notNull(),
    storeId: text('store_id'),
    price: real().notNull().default(0.0),
    priceType: integer('price_type', { mode: 'number' }).notNull(),
    offer: integer({ mode: 'boolean' }).notNull(),
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
    id: integer({ mode: 'number' }).primaryKey(),
    metadataId: integer('metadata_id', { mode: 'number' }).notNull(),
    productId: integer('product_id', { mode: 'number' }).notNull(),
    content: text('content').notNull(),
    active: integer({ mode: 'boolean' }).notNull(),
    allowDescription: integer('allow_description', { mode: 'boolean' }).notNull(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const Stocks = sqliteTable('tmp_stocks', {
    id: integer({ mode: 'number' }).primaryKey(),
    productId: integer("product_id", { mode: 'number' }).notNull(),
    min: integer({ mode: 'number' }).notNull(),
    max: integer({ mode: 'number' }).notNull(),
    current: integer({ mode: 'number' }).notNull(),
    last: integer({ mode: 'number' }).notNull(),
    sucursal: integer({ mode: 'number' }).notNull(),
    warehouse: integer({ mode: 'number' }).notNull(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const Warehouses = sqliteTable('warehouses', {
    id: integer({ mode: 'number' }).primaryKey(),
    name: text('name').notNull(),
    sucursal: integer({ mode: 'number' }).notNull(),
    code: text('code').notNull(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const Images = sqliteTable('images', {
    id: integer({ mode: 'number' }).primaryKey(),
    name: text('name').notNull(),
    url: text('url').notNull(),
    thumbnail: text('thumbnail').notNull(),
    postion: integer({ mode: 'number' }).notNull(),
    active: integer({ mode: 'boolean' }).notNull(),
    reference: text('references').notNull(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const Variants = sqliteTable('variants', {
    id: integer({ mode: 'number' }).primaryKey(),
    name: text('name').notNull(),
    title: text('title').notNull(),
    slug: text('slug').notNull(),
    sku: text('sku'),
    mpn: text('mpn'),
    upc: text('upc').notNull(),
    ean: text('ean'),
    storeId: text('store_id'),
    weight: integer({ mode: 'number' }).notNull().default(0),
    weightUnit: text('weight_unit').default('kg'),
    height: integer({ mode: 'number' }).notNull().default(0),
    width: integer({ mode: 'number' }).notNull().default(0),
    length: integer({ mode: 'number' }).notNull().default(0),
    active: integer({ mode: 'boolean' }).notNull().default(true),
    measureUnit: text('measure_unit').default('mm'),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const VariantOption = sqliteTable('variant_options', {
    id: integer({ mode: 'number' }).primaryKey(),
    name: text('name').notNull(),
    values: text('values'),
    active: integer({ mode: 'boolean' }).notNull(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const VariantOptionValue = sqliteTable('variant_option_values', {
    id: integer({ mode: 'number' }).primaryKey(),
    name: text('name').notNull(),
    active: integer({ mode: 'boolean' }).notNull(),
    image: text('image'),
    value: text('value'),
    abreviation: text('abreviation'),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const VariantRelation = sqliteTable('variant_relations', {
    id: integer({ mode: 'number' }).primaryKey(),
    variantId: integer({ mode: 'number' }).notNull(),
    productId: integer({ mode: 'number' }).notNull(),
    variantOptionValueId: integer({ mode: 'number' }).notNull(),
    mainVariantId: integer({ mode: 'number' }).notNull(),
    storeId: integer({ mode: 'number' }).notNull(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const Country = sqliteTable('countries', {
    id: integer({ mode: 'number' }).primaryKey(),
    name: text('name').notNull(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const Metafields = sqliteTable('product_metafields', {
    id: integer({ mode: 'number' }).primaryKey(),
    product: integer({ mode: 'number' }).notNull(),
    name: text().notNull(), // Metafield name/key
    nameSpace: text().notNull(), // Folder name container
    value: text().notNull(),
    description: text(),
    contentType: text(),
    position: integer({ mode: 'number' }).notNull(),
    active: integer({ mode: 'boolean' }).notNull(),
    allowDescription: integer({ mode: 'boolean' }).notNull(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('deleted_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const Offers = sqliteTable('offers', {
    id: integer({ mode: 'number' }).primaryKey(),
    offerId: integer().notNull().default(1),
    product: integer({ mode: 'number' }).notNull(),
    startDate: int('start_date', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    endDate: int('end_date', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    closeDate: int('close_date', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    price: real("price").notNull().default(0.0),
    storePrice: real("store_price").notNull().default(0.0),
    active: integer({ mode: 'boolean' }).notNull(),
    collect: blob('collect', { mode: 'bigint' }),
    status: integer().notNull().default(1),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const Sucursals = sqliteTable('sucursals', {
    id: integer({ mode: 'number' }).primaryKey(),
    name: text('name').notNull(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const User = sqliteTable('users', {
    id: integer({ mode: 'number' }).primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    password: text('password').notNull(),
    verifiedToken: text('verified_token'),
    resetToken: text('reset_token'),
    tokenExpiry: text('token_expiry'),
    emailVerified: integer({ mode: 'boolean' }).notNull(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const SidebarMenu = sqliteTable('sidebar_menu', {
    id: integer({ mode: 'number' }).primaryKey(),
    name: text('name').notNull(),
    url: text('url').notNull(),
    icon: text('icon').notNull(),
    parentId: integer({ mode: 'number' }),
    position: integer({ mode: 'number' }).notNull(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const MetadataRelations = sqliteTable('metadata_relations', {
    id: integer({ mode: 'number' }).primaryKey(),
    metadataId: integer('metadata_id', { mode: 'number' }).notNull(),
    commonNames: text('common_names'),
    categories: text('categories'),
    productTypes: text('product_types'),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const MetadataValue = sqliteTable('metadata_values', {
    id: integer({ mode: 'number' }).primaryKey(),
    metadataId: integer('metadata_id', { mode: 'number' }).notNull(),
    value: text('value').notNull(),
    active: integer({ mode: 'boolean' }).notNull(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const MetadataValueRelation = sqliteTable('metadata_value_relation', {
    id: integer({ mode: 'number' }).primaryKey(),
    metadataValue: integer({ mode: 'number' }).notNull(),
    product: integer({ mode: 'number' }).notNull(),
    content: text('content'),
    position: integer({ mode: 'number' }).default(1),
    active: integer({ mode: 'boolean' }).notNull(),
    allowDescription: integer({ mode: 'boolean' }).notNull(),
    allowCallection: integer({ mode: 'boolean' }).notNull(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const ProductStocks = sqliteTable('tmp_stocks', {
    id: integer({ mode: 'number' }).primaryKey(),
    product_id: integer("product_id", { mode: 'number' }).notNull(),
    min: integer({ mode: 'number' }).notNull(),
    max: integer({ mode: 'number' }).notNull(),
    current: integer({ mode: 'number' }).notNull(),
    last: integer({ mode: 'number' }).notNull(),
    sucursal: integer({ mode: 'number' }).notNull(),
    warehouse: integer({ mode: 'number' }).notNull(),
    createdAt: int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});