import { sqliteTable, int, text, integer, blob } from "drizzle-orm/sqlite-core"

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
    userId: blob('user_id', { mode: 'bigint' })
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