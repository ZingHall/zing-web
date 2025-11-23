/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as object from './deps/sui/object';
import * as vec_map from './deps/sui/vec_map';
import * as storage_resource from './deps/walrus/storage_resource';
import * as coin from './deps/sui/coin';
const $moduleName = '@local-pkg/zing_studio::storage';
export const AddStorageEvent = new MoveStruct({ name: `${$moduleName}::AddStorageEvent`, fields: {
        current_epoch: bcs.u32(),
        added_epoch: bcs.u32(),
        added_size: bcs.u64()
    } });
export const RemoveStorageEvent = new MoveStruct({ name: `${$moduleName}::RemoveStorageEvent`, fields: {
        current_epoch: bcs.u32(),
        removed_epoch: bcs.u32(),
        removed_size: bcs.u64()
    } });
export const AllocateStorageEvent = new MoveStruct({ name: `${$moduleName}::AllocateStorageEvent`, fields: {
        current_epoch: bcs.u32(),
        start_epoch: bcs.u32(),
        end_epoch: bcs.u32(),
        size_per_epoch: bcs.u64()
    } });
export const DeallocateStorageEvent = new MoveStruct({ name: `${$moduleName}::DeallocateStorageEvent`, fields: {
        current_epoch: bcs.u32(),
        start_epoch: bcs.u32(),
        end_epoch: bcs.u32(),
        size_per_epoch: bcs.u64()
    } });
export const STORAGE = new MoveStruct({ name: `${$moduleName}::STORAGE`, fields: {
        dummy_field: bcs.bool()
    } });
export const StorageTier = new MoveStruct({ name: `${$moduleName}::StorageTier`, fields: {
        price: bcs.u64(),
        duration_days: bcs.u16(),
        storage_limit: bcs.u64()
    } });
export const StorageTreasury = new MoveStruct({ name: `${$moduleName}::StorageTreasury`, fields: {
        id: object.UID,
        tier_plan: vec_map.VecMap(bcs.u8(), StorageTier),
        /**
         * Maps epoch number to storage resources available for that epoch Each epoch can
         * have multiple storage resources that get fused together
         */
        storages_by_epoch: vec_map.VecMap(bcs.u32(), storage_resource.Storage),
        wal_treasury: coin.Coin
    } });
export const StorageSpace = new MoveStruct({ name: `${$moduleName}::StorageSpace`, fields: {
        id: object.UID,
        owner: bcs.Address,
        /** Storage tier that determines the storage limit and pricing */
        tier: bcs.option(bcs.u8()),
        /** Maps epoch number to storage used in that epoch */
        storage_used: vec_map.VecMap(bcs.u32(), bcs.u64()),
        credits: bcs.u64()
    } });
export interface TierPlanArguments {
    self: RawTransactionArgument<string>;
}
export interface TierPlanOptions {
    package?: string;
    arguments: TierPlanArguments | [
        self: RawTransactionArgument<string>
    ];
}
export function tierPlan(options: TierPlanOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::storage::StorageTreasury`
    ] satisfies string[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'storage',
        function: 'tier_plan',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface StoragesByEpochArguments {
    self: RawTransactionArgument<string>;
}
export interface StoragesByEpochOptions {
    package?: string;
    arguments: StoragesByEpochArguments | [
        self: RawTransactionArgument<string>
    ];
}
export function storagesByEpoch(options: StoragesByEpochOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::storage::StorageTreasury`
    ] satisfies string[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'storage',
        function: 'storages_by_epoch',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface WalTreasuryArguments {
    self: RawTransactionArgument<string>;
}
export interface WalTreasuryOptions {
    package?: string;
    arguments: WalTreasuryArguments | [
        self: RawTransactionArgument<string>
    ];
}
export function walTreasury(options: WalTreasuryOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::storage::StorageTreasury`
    ] satisfies string[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'storage',
        function: 'wal_treasury',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface TierPriceArguments {
    tier: RawTransactionArgument<string>;
}
export interface TierPriceOptions {
    package?: string;
    arguments: TierPriceArguments | [
        tier: RawTransactionArgument<string>
    ];
}
export function tierPrice(options: TierPriceOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::storage::StorageTier`
    ] satisfies string[];
    const parameterNames = ["tier"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'storage',
        function: 'tier_price',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface TierDurationDaysArguments {
    tier: RawTransactionArgument<string>;
}
export interface TierDurationDaysOptions {
    package?: string;
    arguments: TierDurationDaysArguments | [
        tier: RawTransactionArgument<string>
    ];
}
export function tierDurationDays(options: TierDurationDaysOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::storage::StorageTier`
    ] satisfies string[];
    const parameterNames = ["tier"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'storage',
        function: 'tier_duration_days',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface TierDurationArguments {
    tier: RawTransactionArgument<string>;
}
export interface TierDurationOptions {
    package?: string;
    arguments: TierDurationArguments | [
        tier: RawTransactionArgument<string>
    ];
}
export function tierDuration(options: TierDurationOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::storage::StorageTier`
    ] satisfies string[];
    const parameterNames = ["tier"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'storage',
        function: 'tier_duration',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface TierStorageLimitArguments {
    tier: RawTransactionArgument<string>;
}
export interface TierStorageLimitOptions {
    package?: string;
    arguments: TierStorageLimitArguments | [
        tier: RawTransactionArgument<string>
    ];
}
export function tierStorageLimit(options: TierStorageLimitOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::storage::StorageTier`
    ] satisfies string[];
    const parameterNames = ["tier"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'storage',
        function: 'tier_storage_limit',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface StorageLimitArguments {
    self: RawTransactionArgument<string>;
    storageSpace: RawTransactionArgument<string>;
}
export interface StorageLimitOptions {
    package?: string;
    arguments: StorageLimitArguments | [
        self: RawTransactionArgument<string>,
        storageSpace: RawTransactionArgument<string>
    ];
}
export function storageLimit(options: StorageLimitOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::storage::StorageTreasury`,
        `${packageAddress}::storage::StorageSpace`
    ] satisfies string[];
    const parameterNames = ["self", "storageSpace"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'storage',
        function: 'storage_limit',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface OwnerArguments {
    storageSpace: RawTransactionArgument<string>;
}
export interface OwnerOptions {
    package?: string;
    arguments: OwnerArguments | [
        storageSpace: RawTransactionArgument<string>
    ];
}
export function owner(options: OwnerOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::storage::StorageSpace`
    ] satisfies string[];
    const parameterNames = ["storageSpace"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'storage',
        function: 'owner',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface TierArguments {
    storageSpace: RawTransactionArgument<string>;
}
export interface TierOptions {
    package?: string;
    arguments: TierArguments | [
        storageSpace: RawTransactionArgument<string>
    ];
}
export function tier(options: TierOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::storage::StorageSpace`
    ] satisfies string[];
    const parameterNames = ["storageSpace"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'storage',
        function: 'tier',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface StorageUsedArguments {
    storageSpace: RawTransactionArgument<string>;
}
export interface StorageUsedOptions {
    package?: string;
    arguments: StorageUsedArguments | [
        storageSpace: RawTransactionArgument<string>
    ];
}
/** Returns the storage limit for this storage space */
export function storageUsed(options: StorageUsedOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::storage::StorageSpace`
    ] satisfies string[];
    const parameterNames = ["storageSpace"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'storage',
        function: 'storage_used',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface StorageUsedByEpochArguments {
    storageSpace: RawTransactionArgument<string>;
    epoch: RawTransactionArgument<number>;
}
export interface StorageUsedByEpochOptions {
    package?: string;
    arguments: StorageUsedByEpochArguments | [
        storageSpace: RawTransactionArgument<string>,
        epoch: RawTransactionArgument<number>
    ];
}
export function storageUsedByEpoch(options: StorageUsedByEpochOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::storage::StorageSpace`,
        'u32'
    ] satisfies string[];
    const parameterNames = ["storageSpace", "epoch"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'storage',
        function: 'storage_used_by_epoch',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface CreditsArguments {
    storageSpace: RawTransactionArgument<string>;
}
export interface CreditsOptions {
    package?: string;
    arguments: CreditsArguments | [
        storageSpace: RawTransactionArgument<string>
    ];
}
export function credits(options: CreditsOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::storage::StorageSpace`
    ] satisfies string[];
    const parameterNames = ["storageSpace"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'storage',
        function: 'credits',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface RemainingStorageArguments {
    self: RawTransactionArgument<string>;
    storageSpace: RawTransactionArgument<string>;
    epoch: RawTransactionArgument<number>;
}
export interface RemainingStorageOptions {
    package?: string;
    arguments: RemainingStorageArguments | [
        self: RawTransactionArgument<string>,
        storageSpace: RawTransactionArgument<string>,
        epoch: RawTransactionArgument<number>
    ];
}
/**
 * Calculates the remaining available storage capacity Returns 0 if already over
 * limit (defensive programming)
 */
export function remainingStorage(options: RemainingStorageOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::storage::StorageTreasury`,
        `${packageAddress}::storage::StorageSpace`,
        'u32'
    ] satisfies string[];
    const parameterNames = ["self", "storageSpace", "epoch"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'storage',
        function: 'remaining_storage',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface UpdateTierPlanArguments {
    self: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
    tierIndex: RawTransactionArgument<number>;
    price: RawTransactionArgument<number | bigint>;
    durationDays: RawTransactionArgument<number>;
    storageLimit: RawTransactionArgument<number | bigint>;
}
export interface UpdateTierPlanOptions {
    package?: string;
    arguments: UpdateTierPlanArguments | [
        self: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        tierIndex: RawTransactionArgument<number>,
        price: RawTransactionArgument<number | bigint>,
        durationDays: RawTransactionArgument<number>,
        storageLimit: RawTransactionArgument<number | bigint>
    ];
}
export function updateTierPlan(options: UpdateTierPlanOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::storage::StorageTreasury`,
        `${packageAddress}::admin::AdminCap`,
        'u8',
        'u64',
        'u16',
        'u64'
    ] satisfies string[];
    const parameterNames = ["self", "Cap", "tierIndex", "price", "durationDays", "storageLimit"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'storage',
        function: 'update_tier_plan',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface RemoveStorageByAdminArguments {
    self: RawTransactionArgument<string>;
    walrusSystem: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
    epoch: RawTransactionArgument<number>;
    splitSize: RawTransactionArgument<number | bigint>;
}
export interface RemoveStorageByAdminOptions {
    package?: string;
    arguments: RemoveStorageByAdminArguments | [
        self: RawTransactionArgument<string>,
        walrusSystem: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>,
        epoch: RawTransactionArgument<number>,
        splitSize: RawTransactionArgument<number | bigint>
    ];
}
/**
 * Admin function to remove storage from treasury for a specific epoch Requires
 * AdminCap to ensure only authorized users can call this Returns the requested
 * storage amount, splitting if necessary
 */
export function removeStorageByAdmin(options: RemoveStorageByAdminOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::storage::StorageTreasury`,
        `${packageAddress}::system::System`,
        `${packageAddress}::admin::AdminCap`,
        'u32',
        'u64'
    ] satisfies string[];
    const parameterNames = ["self", "walrusSystem", "Cap", "epoch", "splitSize"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'storage',
        function: 'remove_storage_by_admin',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ShareStorageSpaceArguments {
    storageSpace: RawTransactionArgument<string>;
}
export interface ShareStorageSpaceOptions {
    package?: string;
    arguments: ShareStorageSpaceArguments | [
        storageSpace: RawTransactionArgument<string>
    ];
}
export function shareStorageSpace(options: ShareStorageSpaceOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::storage::StorageSpace`
    ] satisfies string[];
    const parameterNames = ["storageSpace"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'storage',
        function: 'share_storage_space',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface FundWalTreasuryArguments {
    self: RawTransactionArgument<string>;
    config: RawTransactionArgument<string>;
    coin: RawTransactionArgument<string>;
}
export interface FundWalTreasuryOptions {
    package?: string;
    arguments: FundWalTreasuryArguments | [
        self: RawTransactionArgument<string>,
        config: RawTransactionArgument<string>,
        coin: RawTransactionArgument<string>
    ];
}
export function fundWalTreasury(options: FundWalTreasuryOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::storage::StorageTreasury`,
        `${packageAddress}::config::Config`,
        `0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<${packageAddress}::wal::WAL>`
    ] satisfies string[];
    const parameterNames = ["self", "config", "coin"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'storage',
        function: 'fund_wal_treasury',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface AddStorageToTreasuryArguments {
    self: RawTransactionArgument<string>;
    config: RawTransactionArgument<string>;
    walrusSystem: RawTransactionArgument<string>;
    storage: RawTransactionArgument<string>;
}
export interface AddStorageToTreasuryOptions {
    package?: string;
    arguments: AddStorageToTreasuryArguments | [
        self: RawTransactionArgument<string>,
        config: RawTransactionArgument<string>,
        walrusSystem: RawTransactionArgument<string>,
        storage: RawTransactionArgument<string>
    ];
}
export function addStorageToTreasury(options: AddStorageToTreasuryOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_studio';
    const argumentsTypes = [
        `${packageAddress}::storage::StorageTreasury`,
        `${packageAddress}::config::Config`,
        `${packageAddress}::system::System`,
        `${packageAddress}::storage_resource::Storage`
    ] satisfies string[];
    const parameterNames = ["self", "config", "walrusSystem", "storage"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'storage',
        function: 'add_storage_to_treasury',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
