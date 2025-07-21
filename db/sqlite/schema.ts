import { sqliteTable, int, text, integer, blob, real } from 'drizzle-orm/sqlite-core';

export const Product = sqliteTable('products', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	longDescription: text('long_description'),
	shortDescription: text('short_description'),
	seoDescription: text('seo_description'),
	seoKeywords: text('seo_keywords'),
	seoTitle: text('seo_title'),
	warranty: integer('warranty'),
	brandId: int('brand_id'), //.references(() => Brand.id),
	statusId: int('status_id'), //.references(() => Status.id),
	originId: int('origin_id'), //.references(() => Country.id),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date(new Date().toLocaleString('es-ES', { timeZone: 'America/El_Salvador' }))),
	deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const UserLevel = sqliteTable('user_levels', {
	id: int('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	levelValue: text('level_value').notNull(),
	permissions: text('permissions', { mode: 'json' }).default([]),
	active: integer('active', { mode: 'boolean' }).default(true),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
	deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const Address = sqliteTable('addresses', {
	id: int('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	phone: text('phone'),
	email: text('email'),
	contactName: text('contact_name'),
	contactPhone: text('contact_phone'),
	contactEmail: text('contact_email'),
	country: text('country'),
	state: text('state'),
	city: text('city'),
	street: text('street'),
	block: text('block'),
	house: text('house'),
	optional: text('optional'),
	status: int('status').notNull().default(1),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date())
});

export const Person = sqliteTable('persons', {
	id: int('id').primaryKey({ autoIncrement: true }),
	firstName: text('first_name').notNull(),
	secondName: text('second_name'),
	firstLastName: text('first_last_name').notNull(),
	secondLastName: text('second_last_name'),
	thirdName: text('third_name'),
	thirdLastName: text('third_last_name'),
	gender: text('gender'),
	birthday: integer('birthday', { mode: 'timestamp' }),
	phone: text('phone'),
	email: text('email'),
	vatNumber: text('vat_number'),
	duiNumber: text('dui_number'),
	nitNumber: text('nit_number'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
	deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const Status = sqliteTable('statuses', {
	id: int('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	description: text('description'),
	active: integer('active', { mode: 'boolean' }).default(true),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
	deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const User = sqliteTable('users', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull(),
	password: text('password').notNull(),
	phone: text('phone').unique(),
	verifiedToken: text('verified_token'),
	emailVerified: integer('email_verified', { mode: 'boolean' }).default(false),
	resetToken: text('reset_token'),
	tokenExpiry: integer('token_expiry', { mode: 'timestamp' }),
	apiToken: text('api_token'),
	person: int('person'), //.references(() => Person.id),
	level: int('level'), //.references(() => UserLevel.id),
	status: int('status'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
	deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const Contact = sqliteTable('contacts', {
	id: int('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	email: text('email'),
	homePhone: text('home_phone'),
	mobilePhone: text('mobile_phone'),
	workPhone: text('work_phone'),
	addressId: int('address_id'),
	skype: text('skype'),
	whatsapp: text('whatsapp'),
	status: int('status').notNull().default(1),
	userId: text('user_id'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
	deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const Variant = sqliteTable('variants', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	main: integer('is_main', { mode: 'boolean' }).default(false),
	mainId: blob('main_id', { mode: 'bigint' }),
	storeId: blob('store_id', { mode: 'bigint' }),
	storeName: text('store_name'),
	title: text('title'),
	handle: text('handle'),
	position: integer('position'),
	sku: text('sku'),
	mpn: text('mpn'),
	upc: text('upc'),
	ean: text('ean'),
	isbn: text('isbn'),
	weight: real('weight').default(0),
	weightUnit: text('weight_unit').default('g'),
	width: real('width').default(0),
	height: real('height').default(0),
	length: real('length').default(0),
	innerDiameter: real('inner_diameter').default(0),
	outerDiameter: real('outer_diameter').default(0),
	measureUnit: text('measure_unit').default('mm'),
	shippingVolume: real('shipping_volume').default(0),
	shippingVolumeUnit: text('shipping_volume_unit').default('cm3'),
	shippingWeight: real('shipping_weight').default(0),
	shippingWeightUnit: text('shipping_weight_unit').default('g'),
	customizable: integer('customizable', { mode: 'boolean' }).default(false),
	customizableFields: text('customizable_fields', { mode: 'json' }).default('[]'),
	downloadable: integer('downloadable', { mode: 'boolean' }).default(false),
	downloadableFiles: text('downloadable_files', { mode: 'json' }).default('[]'),
	// Relations
	productId: integer('product_id'), //.references(() => Product.id),
	dsin: integer('dsin'),
	status: integer('status').notNull(), //.references(() => Status.id),
	// logging
	active: integer('active', { mode: 'boolean' }).default(true),
	syncronized: integer('syncronized', { mode: 'boolean' }).default(false),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
	deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const VariantOption = sqliteTable('variant_options', {
	id: int('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	values: text('values', { mode: 'json' }).default('[]'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date())
});

export const VariantOptionValue = sqliteTable('variant_option_values', {
	id: int('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	optionId: int('option_id').notNull(), //.references(() => VariantOption.id),
	active: integer('active', { mode: 'boolean' }).default(true),
	image: text('image').notNull(),
	code: text('code').notNull(),
	value: text('value').notNull(),
	abbreviation: text('abbreviation').notNull(),
	customized: integer('customized', { mode: 'boolean' }).default(false),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date())
});

export const VOV = sqliteTable('variant_option_values', {
	id: int('id').primaryKey({ autoIncrement: true }),
	variantId: int('variant_id'), //.references(() => Variant.id),
	optionId: int('option_id'), //.references(() => VariantOption.id),
	optionValueId: int('option_value_id'), //.references(() => VariantOptionValue.id),
	value: text('value').notNull(),
	content: text('content').default(''),
	active: integer('active', { mode: 'boolean' }).default(true),
	titleAllowed: integer('title_allowed', { mode: 'boolean' }).default(true),
	shortDescriptionAllowed: integer('description_allowed', { mode: 'boolean' }).default(true),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date())
});

export const SidebarMenuItem = sqliteTable('sidebar_menu_items', {
	id: int('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	path: text('path').notNull(),
	icon: text('icon').notNull().default('chevron_right'),
	parentId: int('parent_id'),
	position: integer('position').notNull().default(1),
	permissions: text('permissions')
		.notNull()
		.$defaultFn(() => '[]'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date())
});

export const CommonName = sqliteTable('common_names', {
	id: int('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	position: integer('position').notNull().default(1),
	active: integer('active', { mode: 'boolean' }).default(true),
	descriptionAllowed: integer('description_allowed', { mode: 'boolean' }).default(true),
	collectionAllowed: integer('collection_allowed', { mode: 'boolean' }).default(false),
	parentId: int('parent_id'),
	storeId: blob('store_id', { mode: 'bigint' }),
	storeName: text('store_name'),
	handle: text('handle'),
	storeCategories: text('store_categories'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
	deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const Category = sqliteTable('categories', {
	id: int('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	slug: text('slug').notNull(),
	description: text('description'),
	active: integer('active', { mode: 'boolean' }).default(true),
	storeId: blob('store_id', { mode: 'bigint' }),
	storeName: text('store_name'),
	handle: text('handle'),
	descriptionAllowed: integer('description_allowed', { mode: 'boolean' }).default(true),
	collectionAllowed: integer('collection_allowed', { mode: 'boolean' }).default(false),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
	deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const CategoryToCategory = sqliteTable('category_to_category', {
	id: int('id').primaryKey({ autoIncrement: true }),
	childId: integer('chlid_id').notNull(),
	parentId: integer('parent_id').notNull()
})

export const Tag = sqliteTable('tags', {
	id: int('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date())
});

export const Image = sqliteTable('images', {
	id: int('id').primaryKey({ autoIncrement: true }),
	variantId: int('variant_id'), //.notNull().references(() => Variant.id),
	title: text('title').notNull(),
	alt: text('alt').notNull(),
	url: text('url').notNull(),
	thumbnail: text('thumbnail').notNull(),
	position: integer('position').notNull(),
	active: integer('active', { mode: 'boolean' }).default(true),
	reference: text('reference'),
	storeId: blob('store_id', { mode: 'bigint' }),
	storeName: text('store_name'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date())
});

export const Group = sqliteTable('groups', {
	id: int('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	position: integer('position').notNull(),
	active: integer('active', { mode: 'boolean' }).default(true),
	descriptionAllowed: integer('description_allowed', { mode: 'boolean' }).default(true),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date(new Date().toLocaleString('es-ES', { timeZone: 'America/El_Salvador' })))
});

export const Metafield = sqliteTable('metafields', {
	id: int('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	position: integer('position').notNull(),
	namespace: text('namespace').notNull(),
	value: text('value'),
	contentType: text('content_type').notNull(),
	active: integer('active', { mode: 'boolean' }).default(true),
	descriptionAllowed: integer('description_allowed', { mode: 'boolean' }).default(true),
	isFeature: integer('is_feature', { mode: 'boolean' }).default(false),
	format: text('format'),
	tooltip: text('tooltip'),
	groupId: int('group_id'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
	deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const Metadata = sqliteTable('metadatas', {
	id: int('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	position: integer('position').notNull(),
	active: integer('active', { mode: 'boolean' }).default(true),
	descriptionAllowed: integer('description_allowed', { mode: 'boolean' }).default(true),
	collectionAllowed: integer('collection_allowed', { mode: 'boolean' }).default(false),
	seoAllowed: integer('seo_allowed', { mode: 'boolean' }).default(true),
	isFeature: integer('is_feature', { mode: 'boolean' }).default(false),
	format: text('format'),
	tooltip: text('tooltip'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date(new Date().toLocaleString('es-ES', { timeZone: 'America/El_Salvador' }))),
	deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const Brand = sqliteTable('brands', {
	id: int('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	description: text('description'),
	logo: text('logo'),
	active: integer('active', { mode: 'boolean' }).default(true),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
	deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const StoreOrder = sqliteTable('store_orders', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	orderNumber: text('order_number').notNull(),
	invoiceNumber: text('invoice_number'),
	total: real('total').notNull().default(0),
	taxes: real('taxes').notNull().default(0),
	discount: real('discount').notNull().default(0),
	shipping: real('shipping').notNull().default(0),
	totalItems: integer('total_items').notNull(),
	grandTotal: real('grand_total').notNull().default(0),
	status: integer('status').notNull(), //.references(() => Status.id),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
	deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const ProductType = sqliteTable('product_types', {
	id: int('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	slug: text('slug').notNull(),
	parentId: int('parent_id'), //.references((): AnySQLiteColumn => ProductType.id),
	active: integer('active', { mode: 'boolean' }).default(false),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
	deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const MetadataValue = sqliteTable('metadata_values', {
	id: int('id').primaryKey({ autoIncrement: true }),
	metadataId: int('metadata_id'), //.references(() => Metadata.id),
	value: text('value').notNull(),
	content: text('content'),
	active: integer('active', { mode: 'boolean' }).default(true),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date())
});

export const MetadataValueProductRelation = sqliteTable('metadata_value_product_relations', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	metadataId: int('metadata_id'), //.references(() => Metadata.id),
	metadataValueId: int('metadata_value_id'), //.references(() => MetadataValue.id),
	productId: int('product_id'), //.references(() => Product.id),
	value: text('value'),
	descriptionAllowed: integer('description_allowed', { mode: 'boolean' }).default(true),
	seoAllowed: integer('seo_allowed', { mode: 'boolean' }).default(true),
	collectionAllowed: integer('collection_allowed', { mode: 'boolean' }).default(false),
	active: integer('active', { mode: 'boolean' }).default(true),
	content: text('content'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
	deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const MetadataToMetadataValue = sqliteTable('metadata_to_values', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	metadataId: integer('metadata_id').notNull(), //.references(() => Metadata.id),
	metadataValueId: integer('metadata_value_id').notNull() //.references(() => MetadataValue.id)
});

export const MetadataToCategory = sqliteTable('metadata_to_category', {
	id: int('id').primaryKey({ autoIncrement: true }),
	metadataId: integer('metadata_id').notNull(), //.references(() => Metadata.id),
	categoryId: integer('category_id').notNull() //.references(() => Category.id)
});

export const MetadataToProductType = sqliteTable('metadata_to_product_type', {
	id: int('id').primaryKey({ autoIncrement: true }),
	metadataId: int('metadata_id'), //.references(() => Metadata.id),
	productTypeId: int('product_type_id') //.references(() => ProductType.id)
});

export const MetadataToGroup = sqliteTable('metadata_to_group', {
	id: integer('id').primaryKey({autoIncrement:true}),
	metadataId: int('metadata_id'), //.references(() => Metadata.id),
	groupId: int('group_id').notNull()
});

export const MetadataToCommonName = sqliteTable('metadata_to_common_name', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	metadataId: int('metadata_id'), //.references(() => Metadata.id),
	commonNameId: int('common_name_id').notNull()
});

// export const ProductsToMetadata = sqliteTable('products_to_metadata', {
//     id: int('id').primaryKey({ autoIncrement: true }),
//     productId: int('product_id').notNull().references(() => Product.id),
//     metadataId: int('metadata_id').notNull().references(() => Metadata.id)
// });

export const Country = sqliteTable('countries', {
	id: int('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	code: text('code'),
	zip: text('zip'),
	area: text('area'),
	flag: text('flag'),
	active: integer('active', { mode: 'boolean' }).default(true),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
	deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const Client = sqliteTable('clients', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	avatar: text('avatar'),
	increase: real('increase').default(0),
	discount: real('discount').default(0),
	status: integer('status').notNull(), //.references(() => Status.id),
	active: integer('active',{ mode: 'boolean'}).default(true),
	type: text('type').default('person'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
	deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const CategoryPrice = sqliteTable('category_prices', {
	id: int('id').primaryKey({ autoIncrement: true }),
	category: text('category').notNull(),
	margin: real('margin').notNull().default(0),
	profit: real('profit').notNull().default(0),
	increase: real('increase').default(0),
	decrement: real('decrement').default(0),
	disccountLot: integer('disccount_lot', { mode: 'boolean' }).default(false),
	disccountPerLot: real('disccount_per_lot').notNull().default(0),
	asignedBy: text('asigned_by'), //.references(() => User.id),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date())
});

export const Price = sqliteTable('prices', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	variantId: integer('product_id').notNull(), //.references(() => Variant.id),
	cost: real('cost').notNull().default(0),
	added: real('added').notNull().default(0),
	regularPrice: real('value').notNull().default(0),
	onlinePrice: real('online_price').notNull().default(0),
	offerPrice: real('offer_price').notNull().default(0),
	disccount: real('disccount').notNull().default(0),
	increase: real('increase').default(0),
	asignedBy: text('asigned_by'), //.references(() => User.id),
	category: integer('category').notNull(), //.references(() => CategoryPrice.id),
	margin: integer('margin').default(5),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date())
});

export const Sucursal = sqliteTable('sucursals', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	active: integer('active', { mode: 'boolean' }).default(true),
	address: text('address'),
	phone: text('phone'),
	email: text('email'),
	webSite: text('web_site'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date())
});

export const Warehouse = sqliteTable('warehouses', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	active: integer('active', { mode: 'boolean' }).default(true),
	code: text('code'),
	address: text('address'),
	phone: text('phone'),
	email: text('email'),
	defaultMin: integer('default_min').default(0),
	defaultMax: integer('default_max').default(0),
	sucursal: integer('sucursal'), //.references(() => Sucursal.id),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
	deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const Stock = sqliteTable('stocks', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	product: integer('product').notNull(), //.references(() => Product.id),
	variant: integer('variant').notNull(), //.references(() => Variant.id),
	min: integer('min').notNull(),
	max: integer('max').notNull(),
	current: integer('current').notNull(), // Cuanto hay en stock
	last: integer('last').notNull(), // Cuanto había antes del cambio
	sucursal: integer('sucursal').notNull(), //.references(() => Sucursal.id),
	warehouse: integer('warehouse').notNull(), //.references(() => Warehouse.id),
	policy: text('policy'), // Como se manejan los cambios
	// tracking: integer('tracking', { mode: 'boolean' }).default(false), //
	lowStockAlert: integer('low_stock_alert', { mode: 'boolean' }).default(false),
	inventoryId: text('inventory_id'), // Inventory ID from Shopify
	inventoryQuantity: integer('inventory_quantity').default(0), // Quantity in inventory
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
	deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const ShopifyProductInformation = sqliteTable('shopify_product_information', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name'),
	productId: integer('product_id'), //.references(() => Product.id),
	variantId: integer('variant_id'), //.references(() => Variant.id),
	storeId: blob('store_id', { mode: 'bigint' }),
	priceId: integer('price_id'), //.references(() => Price.id),
	isOffer: integer('is_offer', { mode: 'boolean' }).default(false),
	isCombination: integer('is_combination', { mode: 'boolean' }).default(false),
	isBundle: integer('is_bundle', { mode: 'boolean' }).default(false),
	isDownloadable: integer('is_downloadable', { mode: 'boolean' }).default(false),
	isRig: integer('is_rig', { mode: 'boolean' }).default(false),
	isVirtual: integer('is_virtual', { mode: 'boolean' }).default(false),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
	deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const OfferType = sqliteTable('offer_types', {
	id: int('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	description: text('description'),
	images: text('images'),
	tags: text('tags'),
	message: text('message'),
	collection: text('collection'),
	gpid: text('gpid'),
	timeLimit: integer('time_limit', { mode: 'boolean' }).default(false),
	liquidation: integer('liquidation', { mode: 'boolean' }).default(false),
	status: integer('status').notNull(), //.references(() => Status.id),
	handle: text('handle'),
	metafields: text('metafields'),
	storeId: blob('store_id', { mode: 'bigint' }),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
	deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const Offer = sqliteTable('offers', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	type: integer('type').notNull(), //.references(() => OfferType.id),
	title: text('title').notNull(),
	brand: text('brand').notNull(),
	category: text('category').notNull(),
	collection: text('collection').notNull(),
	parent: integer('parent').notNull(),
	startDate: integer('start_date').notNull(),
	endDate: integer('end_date').notNull(),
	closeDate: integer('close_date').notNull(),
	status: integer('status').notNull(), //.references(() => Status.id),
	images: text('images').notNull(),
	deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const OfferProductHistorical = sqliteTable('offer_product_historical', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	offer: integer('offer').notNull(), //.references(() => Offer.id),
	product: integer('product').notNull(), //.references(() => Product.id),
	startStock: integer('start_stock').notNull(),
	normalPrice: integer('normal_price').notNull(),
	offerPrice: integer('offer_price').notNull(),
	percentage: integer('percentage').notNull(),
	publishedDate: integer('published_date').notNull(),
	closeDate: integer('close_date').notNull(),
	endStock: integer('end_stock').notNull(),
	campaignImage: text('campaign_image').notNull(),
	onLine: integer('on_line').notNull(),
	storeId: blob('store_id', { mode: 'bigint' }).notNull(),
	social: text('social').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
	deletedAt: integer('deleted_at', { mode: 'timestamp' })
});
/* .$defaultFn(() => new Date())
	.$onUpdateFn(() => new Date()) */
export const TrackingOffer = sqliteTable('tracking_offer', {
	id: integer('id').primaryKey(),
	product: integer('product').notNull(), //.references(() => Product.id),
	offer: integer('offer').notNull(), //.references(() => Offer.id),
	origin: text('origin').notNull().default('system'),
	startDate: integer('start_date').notNull(),
	endDate: integer('end_date').notNull(),
	closeDate: integer('close_date').notNull(),
	publishedDate: integer('published_date').notNull(),
	regularPrice: integer('regular_price').notNull(),
	salePrice: integer('sale_price').notNull(),
	offerPrice: integer('offer_price').notNull(),
	percentage: integer('percentage').notNull(),
	status: integer('status').notNull(), //.references(() => Status.id),
	idOnStore: integer('is_on_store', { mode: 'boolean' }).notNull().default(false),
	isOnLine: integer('is_on_line', { mode: 'boolean' }).notNull().default(false),
	includeItem: integer('include_item').notNull(),
	includedItems: text('included_items', { mode: 'json' }),
	isBundle: integer('bundle', { mode: 'boolean' }).notNull().default(false),
	bundleItems: text('bundle_items', { mode: 'json' }),
	attachment: text('attachment', { mode: 'json' }),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
	deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const Session = sqliteTable('sessions', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: text('user_id').notNull(), //.references(() => User.id),
	token: text('token').notNull(),
	expires: integer('expires').notNull(),
	apiToken: text('api_token').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
	deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const ShopSession = sqliteTable('shop_sessions', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	shop: text('shop').notNull(),
	state: text('state').notNull(),
	isOnline: integer('is_online', { mode: 'boolean' }).notNull(),
	scopes: text('scopes').notNull(),
	expires: integer('expires').notNull(),
	accessToken: text('access_token').notNull(),
	userId: integer('user_id').notNull(), //.references(() => User.id),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
	deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const CategoryStore = sqliteTable('category_store', {
	id: int('id').primaryKey({ autoIncrement: true }),
	categoryId: int('category_id').notNull(), //.references(() => Category.id),
	storeId: blob('store_id', { mode: 'bigint' }).notNull(),
	name: text('name').notNull(),
	handle: text('handle').notNull(),
	isLine: integer('is_line', { mode: 'boolean' }).notNull(),
	offerId: blob('offer_id', { mode: 'bigint' }),
	promoHandle: text('promo_handle').notNull(),
	position: integer('position').notNull(),
	active: integer('active', { mode: 'boolean' }).default(true)
});

export const ProductToCategory = sqliteTable('product_to_category', {
	id: int('id').primaryKey({ autoIncrement: true }),
	productId: integer('product_id').notNull(), //.references(() => Product.id),
	categoryId: int('category_id').notNull() //.references(() => Category.id),
});

export const ProductToCommonName = sqliteTable('product_to_common_name', {
	id: int('id').primaryKey({ autoIncrement: true }),
	productId: integer('product_id').notNull(), //.references(() => Product.id),
	commonNameId: int('common_name_id').notNull() //.references(() => CommonName.id),
});

export const ProductToProductType = sqliteTable('product_to_product_type', {
	id: int('id').primaryKey({ autoIncrement: true }),
	productId: integer('product_id').notNull(), //.references(() => Product.id),
	productTypeId: int('product_type_id').notNull() //.references(() => ProductType.id),
});

export const VariantToOption = sqliteTable('variant_to_option', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	variantId: integer('variant_id').notNull(), //.references(() => Variant.id),
	variantOptionId: integer('variant_option_id').notNull() //.references(() => VariantOption.id),
});

export const MetafieldToVariant = sqliteTable('metafield_to_variant', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	variantId: integer('variant_id').notNull(), //.references(() => Variant.id),
	metafieldId: integer('metafield_id').notNull() //.references(() => Metafield.id),
});

export const ProductToTag = sqliteTable('product_to_tag', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	productId: integer('product_id').notNull(), //.references(() => Product.id),
	variantId: integer('variant_id').notNull(), //.references(() => Variant.id),
	tagId: integer('tag_id').notNull() //.references(() => Tag.id),
});

export const CategoryAndProductType = sqliteTable('category_and_product_type', {
	id: int('id').primaryKey({ autoIncrement: true }),
	categoryId: int('category_id').notNull(), //.references(() => Category.id),
	productTypeId: int('product_type_id').notNull() //.references(() => ProductType.id)
});

export const CategoryCommonName = sqliteTable('category_common_name', {
	id: int('id').primaryKey({ autoIncrement: true }),
	categoryId: int('category_id').notNull(), //.references(() => Category.id),
	commonNameId: int('common_name_id').notNull() //.references(() => CommonName.id)
});

export const ProductTypeCommonName = sqliteTable('product_type_common_name', {
	id: int('id').primaryKey({ autoIncrement: true }),
	productTypeId: int('product_type_id').notNull(), //.references(() => ProductType.id),
	commonNameId: int('common_name_id').notNull() //.references(() => CommonName.id)
});

export const CommonNameToCommonName = sqliteTable('common_name_to_common_name', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	childId: integer('child_id').notNull(),
	parentId: integer('parent_id').notNull()
});

export const TempSession = sqliteTable('temp_session', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: text('user_id').notNull(),
	tempToken: text('temp_token').notNull(),
	tries: integer('tries').notNull(),
	expires: integer('expires').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date())
})

export const Company = sqliteTable('companies', {
	id: int('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	registerNumber: text('register_number'),
	abbreviation: text('abbreaviation').notNull(),
	vatNumber: text('vat_number'),
	logo: text('logo'),
	contact: int('contact_name'),
	phone: text('phone'),
	email: text('email'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
	deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const Supplier = sqliteTable('suppliers', {
	id: integer('id').primaryKey({autoIncrement:true}),
	name: text('name').notNull(),
	active: integer('active',{ mode: 'boolean'}).notNull().default(false),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
	deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const Permissions = sqliteTable('permisions',{
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	active: integer('active', { mode: 'boolean' }).notNull().default(false),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).$onUpdate(() => new Date()),
	deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const ContactAddress = sqliteTable('contact_address',{
	id: integer('id').primaryKey({ autoIncrement:true}),
	addressId: integer('address_id').notNull(),
	contactId: integer('contact_id').notNull()
});

export const PersonAddress = sqliteTable('person_address', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	addressId: integer('address_id').notNull(),
	personId: integer('person_id').notNull()
});

export const CompanyContact = sqliteTable('company_address', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	contactId: integer('contact_id').notNull(),
	companyId: integer('company_id').notNull()
});

export const ClientContact = sqliteTable('client_contact', {
	id: integer('id').primaryKey({autoIncrement:true}),
	clientId: text('client_id').notNull(),
	contactId: integer('contact_id').notNull()
});

export const Taxes = sqliteTable('impuestos',{
	id: integer('id').primaryKey({autoIncrement:true}),
	name: text('name').notNull(),
	value: real('value').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).$onUpdate(() => new Date()),
})
// Relations
/* User and Contact */
// export const UserContactRelations = relations(User, ({ many }) => ({
//     contacts: many(Contact),
// }));

// export const ContactRelatons = relations(Contact, ({ one }) => ({
//     user: one(User, {
//         fields: [Contact.userId],
//         references: [User.id],
//     })
// }));

/* Product and Tag */
// export const ProductTagRelations = relations(Product, ({ many }) => ({
//     tags: many(ProductToTag)
// }))

// export const TagProductRelations = relations(Tag, ({ many }) => ({
//     products: many(ProductToTag)
// }))

// export const VariantTagRelations = relations(Variant, ({ many }) => ({
//     tags: many(ProductToTag)
// }))

// export const ProductAndTagRelations = relations(ProductToTag, ({ one }) => ({
//     product: one(Product, {
//         fields: [ProductToTag.productId],
//         references: [Product.id],
//     }),
//     variant: one(Variant, {
//         fields: [ProductToTag.variantId],
//         references: [Variant.id],
//     }),
//     tag: one(Tag, {
//         fields: [ProductToTag.tagId],
//         references: [Tag.id],
//     })
// }));

/* Variant and Image */
// export const VariantImageRelations = relations(Variant, ({ many }) => ({
//     images: many(Image)
// }))

// export const ImageVariantRelations = relations(Image, ({ one }) => ({
//     variant: one(Variant, {
//         fields: [Image.variantId],
//         references: [Variant.id],
//     })
// }));

/* Variant and Product */
// export const ProductVariantRelations = relations(Variant, ({ many }) => ({
//     product: many(Variant)
// }));

// export const VariantProductRelation = relations(Variant, ({ one }) => ({
//     product: one(Product, {
//         fields: [Variant.productId],
//         references: [Product.id],
//     })
// }));

/* CommonName and Metadata */
// export const CommonNameMetadataRelation = relations(CommonName, ({ many }) => ({
//     metadatas: many(MetadataToCommonName)
// }));

// export const MetadataCommonNameRelation = relations(Metadata, ({ many }) => ({
//     commonNames: many(MetadataToCommonName)
// }));

// export const MetadataToCommonNameRelations = relations(MetadataToCommonName, ({ one }) => ({
//     commonName: one(CommonName, {
//         fields: [MetadataToCommonName.commonNameId],
//         references: [CommonName.id],
//     }),
//     metadata: one(Metadata, {
//         fields: [MetadataToCommonName.metadataId],
//         references: [Metadata.id],
//     })
// }));

/* Category and Metadata */
// export const CategoryMetadataRelation = relations(Category, ({ many }) => ({
//     metadatas: many(MetadataToCategory)
// }));

// export const MetadataCategoryRelation = relations(Metadata, ({ many }) => ({
//     categories: many(MetadataToCategory)
// }));

// export const MetadataToCategoryRelations = relations(MetadataToCategory, ({ one }) => ({
//     category: one(Category, {
//         fields: [MetadataToCategory.categoryId],
//         references: [Category.id],
//     }),
//     metadata: one(Metadata, {
//         fields: [MetadataToCategory.metadataId],
//         references: [Metadata.id],
//     })
// }));

/* ProductType and Metadata */
// export const ProductTypeMetadataRelation = relations(ProductType, ({ many }) => ({
//     metadatas: many(MetadataToProductType)
// }));

// export const MetadataProductTypeRelation = relations(Metadata, ({ many }) => ({
//     productTypes: many(MetadataToProductType)
// }));

// export const MetadataToProductTypeRelations = relations(MetadataToProductType, ({ one }) => ({
//     productType: one(ProductType, {
//         fields: [MetadataToProductType.productTypeId],
//         references: [ProductType.id],
//     }),
//     metadata: one(Metadata, {
//         fields: [MetadataToProductType.metadataId],
//         references: [Metadata.id],
//     })
// }));

/* Metadata and MetadataValue */
// export const MetadataMetadataValueRelations = relations(Metadata, ({ many }) => ({
//     metadataValues: many(MetadataToMetadataValue)
// }));

// export const MetadataValueMetadataRelations = relations(MetadataValue, ({ many }) => ({
//     metadatas: many(MetadataToMetadataValue)
// }));

// export const MetadataToMetadataValueRelations = relations(MetadataToMetadataValue, ({ one }) => ({
//     metadata: one(Metadata, {
//         fields: [MetadataToMetadataValue.metadataId],
//         references: [Metadata.id],
//     }),
//     value: one(MetadataValue, {
//         fields: [MetadataToMetadataValue.metadataValueId],
//         references: [MetadataValue.id],
//     }),
// }));

/* Metadata and Group */
// export const MetadataGroupRelations = relations(Metadata, ({ one }) => ({
//     group: one(Group, {
//         fields: [Metadata.groupId],
//         references: [Group.id],
//     })
// }));

// export const GroupMetadataRelations = relations(Group, ({ many }) => ({
//     metadatas: many(Metadata)
// }));

/* Product and Brand */
// export const ProductBrandRelations = relations(Product, ({ one }) => ({
//     brand: one(Brand, {
//         fields: [Product.brandId],
//         references: [Brand.id],
//     })
// }));

// export const BrandProductRelations = relations(Brand, ({ many }) => ({
//     products: many(Product)
// }));

/* Product and Status */
// export const ProductStatusRelations = relations(Product, ({ one }) => ({
//     status: one(Status, {
//         fields: [Product.statusId],
//         references: [Status.id],
//     })
// }));

// export const StatusProductRelations = relations(Status, ({ many }) => ({
//     products: many(Product)
// }));

/* Product and Origin */
// export const ProductOriginRelations = relations(Product, ({ one }) => ({
//     origin: one(Country, {
//         fields: [Product.originId],
//         references: [Country.id],
//     })
// }));

// export const OriginProductRelations = relations(Country, ({ many }) => ({
//     products: many(Product)
// }));

/* Product and CommonName */
// export const CommonNameProductRelations = relations(CommonName, ({ many }) => ({
//     products: many(ProductToCommonName)
// }));

// export const ProductToCommonNameRelations = relations(ProductToCommonName, ({ one }) => ({
//     commonName: one(CommonName, {
//         fields: [ProductToCommonName.commonNameId],
//         references: [CommonName.id],
//     }),
//     product: one(Product, {
//         fields: [ProductToCommonName.productId],
//         references: [Product.id],
//     })
// }));

// export const ProductCommonNameRelations = relations(Product, ({ many }) => ({
//     commonName: many(ProductToCommonName)
// }));

/* Product and Category */
// export const CategoryProductRelations = relations(Category, ({ many }) => ({
//     products: many(ProductToCategory)
// }));

// export const ProductCategoryRelations = relations(Product, ({ many }) => ({
//     category: many(ProductToCategory)
// }));

// export const ProductToCategoryRelations = relations(ProductToCategory, ({ one }) => ({
//     category: one(Category, {
//         fields: [ProductToCategory.categoryId],
//         references: [Category.id],
//     }),
//     product: one(Product, {
//         fields: [ProductToCategory.productId],
//         references: [Product.id],
//     })
// }));

/* Product and ProductType */
// export const ProductTypeProductRelations = relations(ProductType, ({ many }) => ({
//     products: many(ProductToProductType)
// }));

// export const ProductProductTypeRelations = relations(Product, ({ many }) => ({
//     productType: many(ProductToProductType)
// }));

// export const ProductToProductTypeRelations = relations(ProductToProductType, ({ one }) => ({
//     productType: one(ProductType, {
//         fields: [ProductToProductType.productTypeId],
//         references: [ProductType.id],
//     }),
//     product: one(Product, {
//         fields: [ProductToProductType.productId],
//         references: [Product.id],
//     })
// }));

/* Product and Variant */
// export const VariantProductRelations = relations(Variant, ({ one }) => ({
//     product: one(Product, {
//         fields: [Variant.productId],
//         references: [Product.id],
//     })
// }));

/* Product and MetadataValue */
// export const MetadataProductValueRelations = relations(Metadata, ({ many }) => ({
//     products: many(MetadataValueProductRelation),
//     metadataValues: many(MetadataValueProductRelation)
// }));

// export const MetadataValueMetadataProductRelations = relations(MetadataValue, ({ many }) => ({
//     metadatas: many(MetadataValueProductRelation),
//     products: many(MetadataValueProductRelation)
// }));

// export const ProductValueMetadataRelations = relations(Product, ({ many }) => ({
//     metadatas: many(MetadataValueProductRelation),
//     metadataValues: many(MetadataValueProductRelation)
// }));

// export const MetadataValueProductRelations = relations(MetadataValueProductRelation, ({ one }) => ({
//     product: one(Product, {
//         fields: [MetadataValueProductRelation.productId],
//         references: [Product.id],
//     }),
//     metadata: one(Metadata, {
//         fields: [MetadataValueProductRelation.metadataId],
//         references: [Metadata.id],
//     }),
//     value: one(MetadataValue, {
//         fields: [MetadataValueProductRelation.metadataValueId],
//         references: [MetadataValue.id],
//     })
// }));

/* Category and ProductType */
// export const CategoryProductTypeRelations = relations(Category, ({ many }) => ({
//     productTypes: many(CategoryAndProductType)
// }));

// export const ProductTypeCategoryRelations = relations(ProductType, ({ many }) => ({
//     categories: many(CategoryAndProductType)
// }));

// export const CategoryAndProductTypeRelations = relations(CategoryAndProductType, ({ one }) => ({
//     category: one(Category, {
//         fields: [CategoryAndProductType.categoryId],
//         references: [Category.id],
//     }),
//     productType: one(ProductType, {
//         fields: [CategoryAndProductType.productTypeId],
//         references: [ProductType.id],
//     })
// }));

/* CommonName and Category */
// export const CategorCommonNameRelations = relations(Category, ({ many }) => ({
//     commonNames: many(CategoryCommonName)
// }));

// export const CommonNameCategoryRelations = relations(CommonName, ({ many }) => ({
//     categories: many(CategoryCommonName)
// }));

// export const CategoryWithCommonNameRelations = relations(CategoryCommonName, ({ one }) => ({
//     category: one(Category, {
//         fields: [CategoryCommonName.categoryId],
//         references: [Category.id],
//     }),
//     commonName: one(CommonName, {
//         fields: [CategoryCommonName.commonNameId],
//         references: [CommonName.id],
//     })
// }));

/* ProductType and CommonName */
// export const ProductTypeCommonNameRelations = relations(ProductType, ({ many }) => ({
//     categories: many(ProductTypeCommonName)
// }));

// export const CommonNameProductTypeRelations = relations(CommonName, ({ many }) => ({
//     productType: many(ProductTypeCommonName)
// }));

// export const ProductTypeWithCommonNameRelations = relations(ProductTypeCommonName, ({ one }) => ({
//     productType: one(ProductType, {
//         fields: [ProductTypeCommonName.productTypeId],
//         references: [ProductType.id],
//     }),
//     commonName: one(CommonName, {
//         fields: [ProductTypeCommonName.commonNameId],
//         references: [CommonName.id],
//     })
// }));

/* Variant and Option */
// export const VariantAndOptionRelations = relations(Variant, ({ many }) => ({
//     tags: many(VariantToOption)
// }))

// export const OptionAndVariantRelations = relations(VariantOption, ({ many }) => ({
//     tags: many(VariantToOption)
// }))

// export const VariantAndVariantOptionRelations = relations(VariantToOption, ({ one }) => ({
//     variant: one(Variant, {
//         fields: [VariantToOption.variantId],
//         references: [Variant.id],
//     }),
//     variantOption: one(VariantOption, {
//         fields: [VariantToOption.variantOptionId],
//         references: [VariantOption.id],
//     })
// }));

/* Variant and Stock */
// export const VariantStockRelations = relations(Variant, ({ many }) => ({
//     stocks: many(Stock)
// }));

// export const StockVariantRelations = relations(Stock, ({ one }) => ({
//     variant: one(Variant, {
//         fields: [Stock.variant],
//         references: [Variant.id],
//     })
// }));

/* Variant and Price */
// export const VariantPriceRelations = relations(Variant, ({ many }) => ({
//     prices: many(Price)
// }));

// export const PriceVariantRelations = relations(Price, ({ one }) => ({
//     variant: one(Variant, {
//         fields: [Price.variantId],
//         references: [Variant.id],
//     })
// }));

/* Variant and Metafield */
// export const VariantMetafieldRelations = relations(Variant, ({ many }) => ({
//     metafields: many(MetafieldToVariant)
// }));

// export const MetafieldVariantRelations = relations(Metafield, ({ many }) => ({
//     variants: many(MetafieldToVariant)
// }));

// export const VariantAndMetafieldRelations = relations(MetafieldToVariant, ({ one }) => ({
//     metafields: one(Variant, {
//         fields: [MetafieldToVariant.variantId],
//         references: [Variant.id],
//     }),
//     variants: one(Metafield, {
//         fields: [MetafieldToVariant.variantId],
//         references: [Metafield.id],
//     })
// }));

/* Variant and Value */
// export const VariantValueRelations = relations(Variant, ({ many }) => ({
//     options: many(VOV)
// }));

// export const VOVRelations = relations(VOV, ({ one }) => ({
//     variant: one(Variant, {
//         fields: [VOV.variantId],
//         references: [Variant.id],
//     }),
//     option: one(VariantOption, {
//         fields: [VOV.optionId],
//         references: [VariantOption.id],
//     }),
//     optionValue: one(VariantOptionValue, {
//         fields: [VOV.optionValueId],
//         references: [VariantOptionValue.id],
//     }),
// }));

/* CategoryPrice and Price  */
// export const CategoryPricePriceRelations = relations(CategoryPrice, ({ many }) => ({
//     price: many(Price)
// }));

// export const PriceCategoryPriceRelations = relations(Price, ({ one }) => ({
//     category: one(CategoryPrice, {
//         fields: [Price.category],
//         references: [CategoryPrice.id],
//     })
// }));
