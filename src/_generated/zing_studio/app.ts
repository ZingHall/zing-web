/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as studio from './studio';
const $moduleName = '@local-pkg/zing_studio::app';
export const App = new MoveStruct({ name: `${$moduleName}::App`, fields: {
        dummy_field: bcs.bool()
    } });
export const PurchaseStorageTier = new MoveStruct({ name: `${$moduleName}::PurchaseStorageTier`, fields: {
        owner: bcs.Address,
        current_epoch: bcs.u32(),
        timestamp_ms: bcs.u64(),
        prev_period: studio.Period,
        current_period: studio.Period,
        prev_tier: bcs.option(bcs.u8()),
        current_tier: bcs.u8(),
        prev_storage_limit: bcs.u64(),
        current_storage_limit: bcs.u64(),
        payment: bcs.u64()
    } });
export const PublishReceipt = new MoveStruct({ name: `${$moduleName}::PublishReceipt`, fields: {
        studio_id: bcs.Address,
        work_id: bcs.Address
    } });
export interface SetupFileKeyArguments {
    config: RawTransactionArgument<string>;
    studio: RawTransactionArgument<string>;
    encryptedFileKey: RawTransactionArgument<number[]>;
}
export interface SetupFileKeyOptions {
    package?: string;
    arguments: SetupFileKeyArguments | [
        config: RawTransactionArgument<string>,
        studio: RawTransactionArgument<string>,
        encryptedFileKey: RawTransactionArgument<number[]>
    ];
}
export function setupFileKey(options: SetupFileKeyOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::config::Config`,
        `${packageAddress}::studio::Studio`,
        'vector<u8>'
    ] satisfies string[];
    const parameterNames = ["config", "studio", "encryptedFileKey"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'app',
        function: 'setup_file_key',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface UpdateFileKeyArguments {
    config: RawTransactionArgument<string>;
    studio: RawTransactionArgument<string>;
    encryptedFileKey: RawTransactionArgument<number[]>;
}
export interface UpdateFileKeyOptions {
    package?: string;
    arguments: UpdateFileKeyArguments | [
        config: RawTransactionArgument<string>,
        studio: RawTransactionArgument<string>,
        encryptedFileKey: RawTransactionArgument<number[]>
    ];
}
export function updateFileKey(options: UpdateFileKeyOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::config::Config`,
        `${packageAddress}::studio::Studio`,
        'vector<u8>'
    ] satisfies string[];
    const parameterNames = ["config", "studio", "encryptedFileKey"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'app',
        function: 'update_file_key',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface SetMonthlySubscriptionFeeArguments {
    config: RawTransactionArgument<string>;
    studio: RawTransactionArgument<string>;
    level: RawTransactionArgument<number>;
    monthlySubscriptionFee: RawTransactionArgument<number | bigint>;
}
export interface SetMonthlySubscriptionFeeOptions {
    package?: string;
    arguments: SetMonthlySubscriptionFeeArguments | [
        config: RawTransactionArgument<string>,
        studio: RawTransactionArgument<string>,
        level: RawTransactionArgument<number>,
        monthlySubscriptionFee: RawTransactionArgument<number | bigint>
    ];
}
export function setMonthlySubscriptionFee(options: SetMonthlySubscriptionFeeOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::config::Config`,
        `${packageAddress}::studio::Studio`,
        'u8',
        'u64'
    ] satisfies string[];
    const parameterNames = ["config", "studio", "level", "monthlySubscriptionFee"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'app',
        function: 'set_monthly_subscription_fee',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface DonateArguments {
    config: RawTransactionArgument<string>;
    donation: RawTransactionArgument<string>;
    identifier: RawTransactionArgument<string>;
    treasury: RawTransactionArgument<string>;
    payment: RawTransactionArgument<string>;
}
export interface DonateOptions {
    package?: string;
    arguments: DonateArguments | [
        config: RawTransactionArgument<string>,
        donation: RawTransactionArgument<string>,
        identifier: RawTransactionArgument<string>,
        treasury: RawTransactionArgument<string>,
        payment: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/**
 * This function can not be foreclly executed, therefore, mechanism should be
 * designed to incentivize supporter; ex: donation can be accumulated and in
 * changed for the membership
 */
export function donate(options: DonateOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::config::Config`,
        `${packageAddress}::donation::Donation`,
        '0x0000000000000000000000000000000000000000000000000000000000000001::ascii::String',
        `${packageAddress}::treasury::Treasury`,
        `0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["config", "donation", "identifier", "treasury", "payment"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'app',
        function: 'donate',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface ClaimArguments {
    config: RawTransactionArgument<string>;
    studio: RawTransactionArgument<string>;
    donation: RawTransactionArgument<string>;
    identityManager: RawTransactionArgument<string>;
}
export interface ClaimOptions {
    package?: string;
    arguments: ClaimArguments | [
        config: RawTransactionArgument<string>,
        studio: RawTransactionArgument<string>,
        donation: RawTransactionArgument<string>,
        identityManager: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function claim(options: ClaimOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::config::Config`,
        `${packageAddress}::studio::Studio`,
        `${packageAddress}::donation::Donation`,
        `${packageAddress}::identity::IdentityManager<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["config", "studio", "donation", "identityManager"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'app',
        function: 'claim',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface SubscribeToStudioArguments {
    studio: RawTransactionArgument<string>;
    treasury: RawTransactionArgument<string>;
    subscriptionLevel: RawTransactionArgument<number>;
    payment: RawTransactionArgument<string>;
    config: RawTransactionArgument<string>;
}
export interface SubscribeToStudioOptions {
    package?: string;
    arguments: SubscribeToStudioArguments | [
        studio: RawTransactionArgument<string>,
        treasury: RawTransactionArgument<string>,
        subscriptionLevel: RawTransactionArgument<number>,
        payment: RawTransactionArgument<string>,
        config: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function subscribeToStudio(options: SubscribeToStudioOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::studio::Studio`,
        `${packageAddress}::treasury::Treasury`,
        'u8',
        `0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<${options.typeArguments[0]}>`,
        `${packageAddress}::config::Config`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["studio", "treasury", "subscriptionLevel", "payment", "config"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'app',
        function: 'subscribe_to_studio',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface PurchaseStorageTierArguments {
    config: RawTransactionArgument<string>;
    studio: RawTransactionArgument<string>;
    treasury: RawTransactionArgument<string>;
    walrusSystem: RawTransactionArgument<string>;
    storageTreasury: RawTransactionArgument<string>;
    storageSpace: RawTransactionArgument<string>;
    newTierIdx: RawTransactionArgument<number>;
    payment: RawTransactionArgument<string>;
}
export interface PurchaseStorageTierOptions {
    package?: string;
    arguments: PurchaseStorageTierArguments | [
        config: RawTransactionArgument<string>,
        studio: RawTransactionArgument<string>,
        treasury: RawTransactionArgument<string>,
        walrusSystem: RawTransactionArgument<string>,
        storageTreasury: RawTransactionArgument<string>,
        storageSpace: RawTransactionArgument<string>,
        newTierIdx: RawTransactionArgument<number>,
        payment: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function purchaseStorageTier(options: PurchaseStorageTierOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::config::Config`,
        `${packageAddress}::studio::Studio`,
        `${packageAddress}::treasury::Treasury`,
        `${packageAddress}::system::System`,
        `${packageAddress}::storage::StorageTreasury`,
        `${packageAddress}::storage::StorageSpace`,
        'u8',
        `0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<${options.typeArguments[0]}>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["config", "studio", "treasury", "walrusSystem", "storageTreasury", "storageSpace", "newTierIdx", "payment"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'app',
        function: 'purchase_storage_tier',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface AllocateStorageAndRegisterBlobArguments {
    config: RawTransactionArgument<string>;
    studio: RawTransactionArgument<string>;
    walrusSystem: RawTransactionArgument<string>;
    storageTreasury: RawTransactionArgument<string>;
    storageSpace: RawTransactionArgument<string>;
    blobId: RawTransactionArgument<number | bigint>;
    rootHash: RawTransactionArgument<number | bigint>;
    unencodedBlobSize: RawTransactionArgument<number | bigint>;
    encodingType: RawTransactionArgument<number>;
}
export interface AllocateStorageAndRegisterBlobOptions {
    package?: string;
    arguments: AllocateStorageAndRegisterBlobArguments | [
        config: RawTransactionArgument<string>,
        studio: RawTransactionArgument<string>,
        walrusSystem: RawTransactionArgument<string>,
        storageTreasury: RawTransactionArgument<string>,
        storageSpace: RawTransactionArgument<string>,
        blobId: RawTransactionArgument<number | bigint>,
        rootHash: RawTransactionArgument<number | bigint>,
        unencodedBlobSize: RawTransactionArgument<number | bigint>,
        encodingType: RawTransactionArgument<number>
    ];
}
export function allocateStorageAndRegisterBlob(options: AllocateStorageAndRegisterBlobOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::config::Config`,
        `${packageAddress}::studio::Studio`,
        `${packageAddress}::system::System`,
        `${packageAddress}::storage::StorageTreasury`,
        `${packageAddress}::storage::StorageSpace`,
        'u256',
        'u256',
        'u64',
        'u8',
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["config", "studio", "walrusSystem", "storageTreasury", "storageSpace", "blobId", "rootHash", "unencodedBlobSize", "encodingType"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'app',
        function: 'allocate_storage_and_register_blob',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface StartPublishArticleArguments {
    config: RawTransactionArgument<string>;
    studio: RawTransactionArgument<string>;
    walrusSystem: RawTransactionArgument<string>;
    storageTreasury: RawTransactionArgument<string>;
    storageSpace: RawTransactionArgument<string>;
    subscriptionLevel: RawTransactionArgument<number | null>;
    blobId: RawTransactionArgument<number | bigint>;
    rootHash: RawTransactionArgument<number | bigint>;
    unencodedBlobSize: RawTransactionArgument<number | bigint>;
    encodingType: RawTransactionArgument<number>;
    identifiers: RawTransactionArgument<string[]>;
    blobIndexes: RawTransactionArgument<number | bigint[]>;
    mimeTypes: RawTransactionArgument<string[]>;
    metadataSizes: RawTransactionArgument<number | bigint[]>;
}
export interface StartPublishArticleOptions {
    package?: string;
    arguments: StartPublishArticleArguments | [
        config: RawTransactionArgument<string>,
        studio: RawTransactionArgument<string>,
        walrusSystem: RawTransactionArgument<string>,
        storageTreasury: RawTransactionArgument<string>,
        storageSpace: RawTransactionArgument<string>,
        subscriptionLevel: RawTransactionArgument<number | null>,
        blobId: RawTransactionArgument<number | bigint>,
        rootHash: RawTransactionArgument<number | bigint>,
        unencodedBlobSize: RawTransactionArgument<number | bigint>,
        encodingType: RawTransactionArgument<number>,
        identifiers: RawTransactionArgument<string[]>,
        blobIndexes: RawTransactionArgument<number | bigint[]>,
        mimeTypes: RawTransactionArgument<string[]>,
        metadataSizes: RawTransactionArgument<number | bigint[]>
    ];
}
export function startPublishArticle(options: StartPublishArticleOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::config::Config`,
        `${packageAddress}::studio::Studio`,
        `${packageAddress}::system::System`,
        `${packageAddress}::storage::StorageTreasury`,
        `${packageAddress}::storage::StorageSpace`,
        '0x0000000000000000000000000000000000000000000000000000000000000001::option::Option<u8>',
        'u256',
        'u256',
        'u64',
        'u8',
        'vector<0x0000000000000000000000000000000000000000000000000000000000000001::ascii::String>',
        'vector<u64>',
        'vector<0x0000000000000000000000000000000000000000000000000000000000000001::ascii::String>',
        'vector<u64>',
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["config", "studio", "walrusSystem", "storageTreasury", "storageSpace", "subscriptionLevel", "blobId", "rootHash", "unencodedBlobSize", "encodingType", "identifiers", "blobIndexes", "mimeTypes", "metadataSizes"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'app',
        function: 'start_publish_article',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface FinalizePublishArticleArguments {
    config: RawTransactionArgument<string>;
    studio: RawTransactionArgument<string>;
    receipt: RawTransactionArgument<string>;
    article: RawTransactionArgument<string>;
}
export interface FinalizePublishArticleOptions {
    package?: string;
    arguments: FinalizePublishArticleArguments | [
        config: RawTransactionArgument<string>,
        studio: RawTransactionArgument<string>,
        receipt: RawTransactionArgument<string>,
        article: RawTransactionArgument<string>
    ];
}
export function finalizePublishArticle(options: FinalizePublishArticleOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::config::Config`,
        `${packageAddress}::studio::Studio`,
        `${packageAddress}::app::PublishReceipt`,
        `${packageAddress}::article::Article`
    ] satisfies string[];
    const parameterNames = ["config", "studio", "receipt", "article"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'app',
        function: 'finalize_publish_article',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface CertifyArticleBlobArguments {
    config: RawTransactionArgument<string>;
    studio: RawTransactionArgument<string>;
    walrusSystem: RawTransactionArgument<string>;
    articleId: RawTransactionArgument<string>;
    blobIndex: RawTransactionArgument<number | bigint>;
    signature: RawTransactionArgument<number[]>;
    signersBitmap: RawTransactionArgument<number[]>;
    message: RawTransactionArgument<number[]>;
}
export interface CertifyArticleBlobOptions {
    package?: string;
    arguments: CertifyArticleBlobArguments | [
        config: RawTransactionArgument<string>,
        studio: RawTransactionArgument<string>,
        walrusSystem: RawTransactionArgument<string>,
        articleId: RawTransactionArgument<string>,
        blobIndex: RawTransactionArgument<number | bigint>,
        signature: RawTransactionArgument<number[]>,
        signersBitmap: RawTransactionArgument<number[]>,
        message: RawTransactionArgument<number[]>
    ];
}
export function certifyArticleBlob(options: CertifyArticleBlobOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::config::Config`,
        `${packageAddress}::studio::Studio`,
        `${packageAddress}::system::System`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::object::ID',
        'u64',
        'vector<u8>',
        'vector<u8>',
        'vector<u8>'
    ] satisfies string[];
    const parameterNames = ["config", "studio", "walrusSystem", "articleId", "blobIndex", "signature", "signersBitmap", "message"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'app',
        function: 'certify_article_blob',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface DeleteArticleArguments {
    config: RawTransactionArgument<string>;
    studio: RawTransactionArgument<string>;
    storageTreasury: RawTransactionArgument<string>;
    storageSpace: RawTransactionArgument<string>;
    walrusSystem: RawTransactionArgument<string>;
    articleId: RawTransactionArgument<string>;
}
export interface DeleteArticleOptions {
    package?: string;
    arguments: DeleteArticleArguments | [
        config: RawTransactionArgument<string>,
        studio: RawTransactionArgument<string>,
        storageTreasury: RawTransactionArgument<string>,
        storageSpace: RawTransactionArgument<string>,
        walrusSystem: RawTransactionArgument<string>,
        articleId: RawTransactionArgument<string>
    ];
}
export function deleteArticle(options: DeleteArticleOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::config::Config`,
        `${packageAddress}::studio::Studio`,
        `${packageAddress}::storage::StorageTreasury`,
        `${packageAddress}::storage::StorageSpace`,
        `${packageAddress}::system::System`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::object::ID',
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["config", "studio", "storageTreasury", "storageSpace", "walrusSystem", "articleId"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'app',
        function: 'delete_article',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface BurnArticleByAdminArguments {
    config: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
    studio: RawTransactionArgument<string>;
    walrusSystem: RawTransactionArgument<string>;
    articleId: RawTransactionArgument<string>;
}
export interface BurnArticleByAdminOptions {
    package?: string;
    arguments: BurnArticleByAdminArguments | [
        config: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        studio: RawTransactionArgument<string>,
        walrusSystem: RawTransactionArgument<string>,
        articleId: RawTransactionArgument<string>
    ];
}
export function burnArticleByAdmin(options: BurnArticleByAdminOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::config::Config`,
        `${packageAddress}::admin::AdminCap`,
        `${packageAddress}::studio::Studio`,
        `${packageAddress}::system::System`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::object::ID',
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["config", "Cap", "studio", "walrusSystem", "articleId"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'app',
        function: 'burn_article_by_admin',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface RenewArticleWithStorageTreasuryArguments {
    config: RawTransactionArgument<string>;
    studio: RawTransactionArgument<string>;
    walrusSystem: RawTransactionArgument<string>;
    storageTreasury: RawTransactionArgument<string>;
    storageSpace: RawTransactionArgument<string>;
    articleId: RawTransactionArgument<string>;
}
export interface RenewArticleWithStorageTreasuryOptions {
    package?: string;
    arguments: RenewArticleWithStorageTreasuryArguments | [
        config: RawTransactionArgument<string>,
        studio: RawTransactionArgument<string>,
        walrusSystem: RawTransactionArgument<string>,
        storageTreasury: RawTransactionArgument<string>,
        storageSpace: RawTransactionArgument<string>,
        articleId: RawTransactionArgument<string>
    ];
}
export function renewArticleWithStorageTreasury(options: RenewArticleWithStorageTreasuryOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::config::Config`,
        `${packageAddress}::studio::Studio`,
        `${packageAddress}::system::System`,
        `${packageAddress}::storage::StorageTreasury`,
        `${packageAddress}::storage::StorageSpace`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::object::ID',
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["config", "studio", "walrusSystem", "storageTreasury", "storageSpace", "articleId"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'app',
        function: 'renew_article_with_storage_treasury',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface RenewArticleWithWalPaymentArguments {
    config: RawTransactionArgument<string>;
    studio: RawTransactionArgument<string>;
    walrusSystem: RawTransactionArgument<string>;
    articleId: RawTransactionArgument<string>;
    payment: RawTransactionArgument<string>;
}
export interface RenewArticleWithWalPaymentOptions {
    package?: string;
    arguments: RenewArticleWithWalPaymentArguments | [
        config: RawTransactionArgument<string>,
        studio: RawTransactionArgument<string>,
        walrusSystem: RawTransactionArgument<string>,
        articleId: RawTransactionArgument<string>,
        payment: RawTransactionArgument<string>
    ];
}
export function renewArticleWithWalPayment(options: RenewArticleWithWalPaymentOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::config::Config`,
        `${packageAddress}::studio::Studio`,
        `${packageAddress}::system::System`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::object::ID',
        `0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<${packageAddress}::wal::WAL>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["config", "studio", "walrusSystem", "articleId", "payment"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'app',
        function: 'renew_article_with_wal_payment',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
