/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as vec_map from './deps/sui/vec_map';
import * as object from './deps/sui/object';
import * as blob from './deps/walrus/blob';
const $moduleName = '@local-pkg/zing_studio::article';
export const File = new MoveStruct({ name: `${$moduleName}::File`, fields: {
        /**
           * Whether the file is publicly accessible Index of the blob containing this file's
           * data
           */
        blob_index: bcs.u64(),
        /** MIME type of the file */
        mime_type: bcs.string(),
        /** Size of the file in bytes */
        size: bcs.u64()
    } });
export const PublishArticle = new MoveStruct({ name: `${$moduleName}::PublishArticle`, fields: {
        article_id: bcs.Address,
        owner: bcs.Address,
        blob_ids: bcs.vector(bcs.u256()),
        blob_sizes: bcs.vector(bcs.u64()),
        blob_storage_sizes: bcs.vector(bcs.u64()),
        blob_end_epochs: bcs.vector(bcs.u32()),
        files: vec_map.VecMap(bcs.string(), File),
        timestamp_ms: bcs.u64()
    } });
export const DeleteArticle = new MoveStruct({ name: `${$moduleName}::DeleteArticle`, fields: {
        article_id: bcs.Address,
        owner: bcs.Address,
        current_epoch: bcs.u32(),
        blob_end_epochs: bcs.vector(bcs.u32()),
        timestamp_ms: bcs.u64()
    } });
export const BurnArticle = new MoveStruct({ name: `${$moduleName}::BurnArticle`, fields: {
        article_id: bcs.Address,
        owner: bcs.Address,
        current_epoch: bcs.u32(),
        blob_end_epochs: bcs.vector(bcs.u32()),
        timestamp_ms: bcs.u64()
    } });
export const RenewArticle = new MoveStruct({ name: `${$moduleName}::RenewArticle`, fields: {
        article_id: bcs.Address,
        owner: bcs.Address,
        current_epoch: bcs.u32(),
        prev_blob_end_epochs: bcs.vector(bcs.u32()),
        new_blob_end_epochs: bcs.vector(bcs.u32())
    } });
export const ARTICLE = new MoveStruct({ name: `${$moduleName}::ARTICLE`, fields: {
        dummy_field: bcs.bool()
    } });
export const Article = new MoveStruct({ name: `${$moduleName}::Article`, fields: {
        id: object.UID,
        created_at: bcs.u64(),
        subscription_level: bcs.option(bcs.u8()),
        /**
         * Storage blobs containing the article content (all blobs must have compatible
         * properties)
         */
        blobs: bcs.vector(blob.Blob),
        /** Maps file identifiers to their corresponding metadata */
        files: vec_map.VecMap(bcs.string(), File)
    } });
export interface CreatedAtArguments {
    self: RawTransactionArgument<string>;
}
export interface CreatedAtOptions {
    package?: string;
    arguments: CreatedAtArguments | [
        self: RawTransactionArgument<string>
    ];
}
export function createdAt(options: CreatedAtOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::article::Article`
    ] satisfies string[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'article',
        function: 'created_at',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface SubscriptionLevelArguments {
    self: RawTransactionArgument<string>;
}
export interface SubscriptionLevelOptions {
    package?: string;
    arguments: SubscriptionLevelArguments | [
        self: RawTransactionArgument<string>
    ];
}
export function subscriptionLevel(options: SubscriptionLevelOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::article::Article`
    ] satisfies string[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'article',
        function: 'subscription_level',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface BlobsArguments {
    self: RawTransactionArgument<string>;
}
export interface BlobsOptions {
    package?: string;
    arguments: BlobsArguments | [
        self: RawTransactionArgument<string>
    ];
}
export function blobs(options: BlobsOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::article::Article`
    ] satisfies string[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'article',
        function: 'blobs',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface FilesArguments {
    self: RawTransactionArgument<string>;
}
export interface FilesOptions {
    package?: string;
    arguments: FilesArguments | [
        self: RawTransactionArgument<string>
    ];
}
export function files(options: FilesOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::article::Article`
    ] satisfies string[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'article',
        function: 'files',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface EndEpochArguments {
    self: RawTransactionArgument<string>;
}
export interface EndEpochOptions {
    package?: string;
    arguments: EndEpochArguments | [
        self: RawTransactionArgument<string>
    ];
}
/**
 * Returns the end epoch of the article (assumes all blobs have the same end epoch)
 * SECURITY NOTE: This function assumes blobs[0] exists and all blobs have the same
 * end epoch
 */
export function endEpoch(options: EndEpochOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::article::Article`
    ] satisfies string[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'article',
        function: 'end_epoch',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface TotalBlobSizeArguments {
    self: RawTransactionArgument<string>;
}
export interface TotalBlobSizeOptions {
    package?: string;
    arguments: TotalBlobSizeArguments | [
        self: RawTransactionArgument<string>
    ];
}
/** Calculates the total size of all blobs in the article */
export function totalBlobSize(options: TotalBlobSizeOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::article::Article`
    ] satisfies string[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'article',
        function: 'total_blob_size',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface IsExpiredArguments {
    self: RawTransactionArgument<string>;
    walrusSystem: RawTransactionArgument<string>;
}
export interface IsExpiredOptions {
    package?: string;
    arguments: IsExpiredArguments | [
        self: RawTransactionArgument<string>,
        walrusSystem: RawTransactionArgument<string>
    ];
}
export function isExpired(options: IsExpiredOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::article::Article`,
        `${packageAddress}::system::System`
    ] satisfies string[];
    const parameterNames = ["self", "walrusSystem"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'article',
        function: 'is_expired',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface IsPublicArguments {
    self: RawTransactionArgument<string>;
}
export interface IsPublicOptions {
    package?: string;
    arguments: IsPublicArguments | [
        self: RawTransactionArgument<string>
    ];
}
export function isPublic(options: IsPublicOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::article::Article`
    ] satisfies string[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'article',
        function: 'is_public',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface BlobIndexArguments {
    file: RawTransactionArgument<string>;
}
export interface BlobIndexOptions {
    package?: string;
    arguments: BlobIndexArguments | [
        file: RawTransactionArgument<string>
    ];
}
export function blobIndex(options: BlobIndexOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::article::File`
    ] satisfies string[];
    const parameterNames = ["file"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'article',
        function: 'blob_index',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface MimeTypeArguments {
    file: RawTransactionArgument<string>;
}
export interface MimeTypeOptions {
    package?: string;
    arguments: MimeTypeArguments | [
        file: RawTransactionArgument<string>
    ];
}
export function mimeType(options: MimeTypeOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::article::File`
    ] satisfies string[];
    const parameterNames = ["file"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'article',
        function: 'mime_type',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface FileSizeArguments {
    file: RawTransactionArgument<string>;
}
export interface FileSizeOptions {
    package?: string;
    arguments: FileSizeArguments | [
        file: RawTransactionArgument<string>
    ];
}
export function fileSize(options: FileSizeOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::article::File`
    ] satisfies string[];
    const parameterNames = ["file"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'article',
        function: 'file_size',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ArticleBlobAddMetadataArguments {
    config: RawTransactionArgument<string>;
    self: RawTransactionArgument<string>;
    blobIndex: RawTransactionArgument<number | bigint>;
    metadata: RawTransactionArgument<string>;
}
export interface ArticleBlobAddMetadataOptions {
    package?: string;
    arguments: ArticleBlobAddMetadataArguments | [
        config: RawTransactionArgument<string>,
        self: RawTransactionArgument<string>,
        blobIndex: RawTransactionArgument<number | bigint>,
        metadata: RawTransactionArgument<string>
    ];
}
export function articleBlobAddMetadata(options: ArticleBlobAddMetadataOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::config::Config`,
        `${packageAddress}::article::Article`,
        'u64',
        `${packageAddress}::metadata::Metadata`
    ] satisfies string[];
    const parameterNames = ["config", "self", "blobIndex", "metadata"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'article',
        function: 'article_blob_add_metadata',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ArticleBlobRemoveMetadataArguments {
    config: RawTransactionArgument<string>;
    self: RawTransactionArgument<string>;
    blobIndex: RawTransactionArgument<number | bigint>;
    key: RawTransactionArgument<string>;
}
export interface ArticleBlobRemoveMetadataOptions {
    package?: string;
    arguments: ArticleBlobRemoveMetadataArguments | [
        config: RawTransactionArgument<string>,
        self: RawTransactionArgument<string>,
        blobIndex: RawTransactionArgument<number | bigint>,
        key: RawTransactionArgument<string>
    ];
}
export function articleBlobRemoveMetadata(options: ArticleBlobRemoveMetadataOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::config::Config`,
        `${packageAddress}::article::Article`,
        'u64',
        '0x0000000000000000000000000000000000000000000000000000000000000001::string::String'
    ] satisfies string[];
    const parameterNames = ["config", "self", "blobIndex", "key"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'article',
        function: 'article_blob_remove_metadata',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ArticleBlobInsertOrUpdateMetadataPairArguments {
    config: RawTransactionArgument<string>;
    self: RawTransactionArgument<string>;
    blobIndex: RawTransactionArgument<number | bigint>;
    key: RawTransactionArgument<string>;
    value: RawTransactionArgument<string>;
}
export interface ArticleBlobInsertOrUpdateMetadataPairOptions {
    package?: string;
    arguments: ArticleBlobInsertOrUpdateMetadataPairArguments | [
        config: RawTransactionArgument<string>,
        self: RawTransactionArgument<string>,
        blobIndex: RawTransactionArgument<number | bigint>,
        key: RawTransactionArgument<string>,
        value: RawTransactionArgument<string>
    ];
}
export function articleBlobInsertOrUpdateMetadataPair(options: ArticleBlobInsertOrUpdateMetadataPairOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::config::Config`,
        `${packageAddress}::article::Article`,
        'u64',
        '0x0000000000000000000000000000000000000000000000000000000000000001::string::String',
        '0x0000000000000000000000000000000000000000000000000000000000000001::string::String'
    ] satisfies string[];
    const parameterNames = ["config", "self", "blobIndex", "key", "value"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'article',
        function: 'article_blob_insert_or_update_metadata_pair',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface CertifyArticleBlobArguments {
    config: RawTransactionArgument<string>;
    self: RawTransactionArgument<string>;
    walrusSystem: RawTransactionArgument<string>;
    blobIndex: RawTransactionArgument<number | bigint>;
    signature: RawTransactionArgument<number[]>;
    signersBitmap: RawTransactionArgument<number[]>;
    message: RawTransactionArgument<number[]>;
}
export interface CertifyArticleBlobOptions {
    package?: string;
    arguments: CertifyArticleBlobArguments | [
        config: RawTransactionArgument<string>,
        self: RawTransactionArgument<string>,
        walrusSystem: RawTransactionArgument<string>,
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
        `${packageAddress}::article::Article`,
        `${packageAddress}::system::System`,
        'u64',
        'vector<u8>',
        'vector<u8>',
        'vector<u8>'
    ] satisfies string[];
    const parameterNames = ["config", "self", "walrusSystem", "blobIndex", "signature", "signersBitmap", "message"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'article',
        function: 'certify_article_blob',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
