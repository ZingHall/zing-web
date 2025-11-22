/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import {
  MoveTuple,
  MoveStruct,
  normalizeMoveArguments,
  type RawTransactionArgument,
} from "../utils/index";
import { bcs } from "@mysten/sui/bcs";
import { type Transaction } from "@mysten/sui/transactions";
import * as object from "./deps/sui/object";
import * as vec_map from "./deps/sui/vec_map";
import * as derived_table from "./deps/zing_framework/derived_table";
import * as derived_object_bag from "./deps/zing_framework/derived_object_bag";
const $moduleName = "@local-pkg/zing_studio::studio";
export const Period = new MoveTuple({
  name: `${$moduleName}::Period`,
  fields: [bcs.u64(), bcs.u64()],
});
export const NewStudioEvent = new MoveStruct({
  name: `${$moduleName}::NewStudioEvent`,
  fields: {
    owner: bcs.Address,
    studio_id: bcs.Address,
  },
});
export const MembershipSubscribeEvent = new MoveStruct({
  name: `${$moduleName}::MembershipSubscribeEvent`,
  fields: {
    owner: bcs.Address,
    member: bcs.Address,
    level: bcs.u8(),
    extended_time_ms: bcs.u64(),
    expired_at: bcs.u64(),
  },
});
export const STUDIO = new MoveStruct({
  name: `${$moduleName}::STUDIO`,
  fields: {
    dummy_field: bcs.bool(),
  },
});
export const Studio = new MoveStruct({
  name: `${$moduleName}::Studio`,
  fields: {
    id: object.UID,
    /** The owner of this studio - only they can add/remove works */
    owner: bcs.Address,
    period: Period,
    /**
     * The fee amount charged by creators for fans to access their content. (quoted in
     * USD)
     */
    monthly_subscription_fee: vec_map.VecMap(bcs.u8(), bcs.u64()),
    /** membership of your studio and expired timestamp; none means permanent membership */
    membership: derived_table.DerivedTable,
    /** Bag containing the actual asset objects, indexed by their IDs */
    works: derived_object_bag.DerivedObjectBag,
    encrypted_file_key: bcs.option(bcs.vector(bcs.u8())),
  },
});
export const Member = new MoveStruct({
  name: `${$moduleName}::Member`,
  fields: {
    level: bcs.u8(),
    expired_at: bcs.u64(),
  },
});
export interface OwnerArguments {
  self: RawTransactionArgument<string>;
}
export interface OwnerOptions {
  package?: string;
  arguments: OwnerArguments | [self: RawTransactionArgument<string>];
}
/** Returns the owner address of this studio */
export function owner(options: OwnerOptions) {
  const packageAddress = options.package ?? "@local-pkg/zing_studio";
  const argumentsTypes = [
    `${packageAddress}::studio::Studio`,
  ] satisfies string[];
  const parameterNames = ["self"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "studio",
      function: "owner",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
    });
}
export interface PeriodArguments {
  self: RawTransactionArgument<string>;
}
export interface PeriodOptions {
  package?: string;
  arguments: PeriodArguments | [self: RawTransactionArgument<string>];
}
export function period(options: PeriodOptions) {
  const packageAddress = options.package ?? "@local-pkg/zing_studio";
  const argumentsTypes = [
    `${packageAddress}::studio::Studio`,
  ] satisfies string[];
  const parameterNames = ["self"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "studio",
      function: "period",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
    });
}
export interface StartAtArguments {
  self: RawTransactionArgument<string>;
}
export interface StartAtOptions {
  package?: string;
  arguments: StartAtArguments | [self: RawTransactionArgument<string>];
}
export function startAt(options: StartAtOptions) {
  const packageAddress = options.package ?? "@local-pkg/zing_studio";
  const argumentsTypes = [
    `${packageAddress}::studio::Studio`,
  ] satisfies string[];
  const parameterNames = ["self"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "studio",
      function: "start_at",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
    });
}
export interface EndAtArguments {
  self: RawTransactionArgument<string>;
}
export interface EndAtOptions {
  package?: string;
  arguments: EndAtArguments | [self: RawTransactionArgument<string>];
}
export function endAt(options: EndAtOptions) {
  const packageAddress = options.package ?? "@local-pkg/zing_studio";
  const argumentsTypes = [
    `${packageAddress}::studio::Studio`,
  ] satisfies string[];
  const parameterNames = ["self"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "studio",
      function: "end_at",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
    });
}
export interface MemberLevelArguments {
  member: RawTransactionArgument<string>;
}
export interface MemberLevelOptions {
  package?: string;
  arguments: MemberLevelArguments | [member: RawTransactionArgument<string>];
}
export function memberLevel(options: MemberLevelOptions) {
  const packageAddress = options.package ?? "@local-pkg/zing_studio";
  const argumentsTypes = [
    `${packageAddress}::studio::Member`,
  ] satisfies string[];
  const parameterNames = ["member"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "studio",
      function: "member_level",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
    });
}
export interface MemberExpiredAtArguments {
  member: RawTransactionArgument<string>;
}
export interface MemberExpiredAtOptions {
  package?: string;
  arguments:
    | MemberExpiredAtArguments
    | [member: RawTransactionArgument<string>];
}
export function memberExpiredAt(options: MemberExpiredAtOptions) {
  const packageAddress = options.package ?? "@local-pkg/zing_studio";
  const argumentsTypes = [
    `${packageAddress}::studio::Member`,
  ] satisfies string[];
  const parameterNames = ["member"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "studio",
      function: "member_expired_at",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
    });
}
export interface MonthlySubscriptionFeeArguments {
  self: RawTransactionArgument<string>;
}
export interface MonthlySubscriptionFeeOptions {
  package?: string;
  arguments:
    | MonthlySubscriptionFeeArguments
    | [self: RawTransactionArgument<string>];
}
export function monthlySubscriptionFee(options: MonthlySubscriptionFeeOptions) {
  const packageAddress = options.package ?? "@local-pkg/zing_studio";
  const argumentsTypes = [
    `${packageAddress}::studio::Studio`,
  ] satisfies string[];
  const parameterNames = ["self"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "studio",
      function: "monthly_subscription_fee",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
    });
}
export interface MembershipArguments {
  self: RawTransactionArgument<string>;
}
export interface MembershipOptions {
  package?: string;
  arguments: MembershipArguments | [self: RawTransactionArgument<string>];
}
export function membership(options: MembershipOptions) {
  const packageAddress = options.package ?? "@local-pkg/zing_studio";
  const argumentsTypes = [
    `${packageAddress}::studio::Studio`,
  ] satisfies string[];
  const parameterNames = ["self"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "studio",
      function: "membership",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
    });
}
export interface AssetOfArguments {
  self: RawTransactionArgument<string>;
  assetId: RawTransactionArgument<string>;
}
export interface AssetOfOptions {
  package?: string;
  arguments:
    | AssetOfArguments
    | [
        self: RawTransactionArgument<string>,
        assetId: RawTransactionArgument<string>,
      ];
  typeArguments: [string];
}
/**
 * Returns an immutable reference to a specific asset by its ID Panics if the asset
 * doesn't exist or has wrong type
 */
export function assetOf(options: AssetOfOptions) {
  const packageAddress = options.package ?? "@local-pkg/zing_studio";
  const argumentsTypes = [
    `${packageAddress}::studio::Studio`,
    "0x0000000000000000000000000000000000000000000000000000000000000002::object::ID",
  ] satisfies string[];
  const parameterNames = ["self", "assetId"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "studio",
      function: "asset_of",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
      typeArguments: options.typeArguments,
    });
}
export interface WorksArguments {
  self: RawTransactionArgument<string>;
}
export interface WorksOptions {
  package?: string;
  arguments: WorksArguments | [self: RawTransactionArgument<string>];
}
export function works(options: WorksOptions) {
  const packageAddress = options.package ?? "@local-pkg/zing_studio";
  const argumentsTypes = [
    `${packageAddress}::studio::Studio`,
  ] satisfies string[];
  const parameterNames = ["self"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "studio",
      function: "works",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
    });
}
export interface EncryptedFileKeyArguments {
  self: RawTransactionArgument<string>;
}
export interface EncryptedFileKeyOptions {
  package?: string;
  arguments: EncryptedFileKeyArguments | [self: RawTransactionArgument<string>];
}
export function encryptedFileKey(options: EncryptedFileKeyOptions) {
  const packageAddress = options.package ?? "@local-pkg/zing_studio";
  const argumentsTypes = [
    `${packageAddress}::studio::Studio`,
  ] satisfies string[];
  const parameterNames = ["self"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "studio",
      function: "encrypted_file_key",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
    });
}
export interface SealApproveStudioOwnerArguments {
  id: RawTransactionArgument<number[]>;
  config: RawTransactionArgument<string>;
  self: RawTransactionArgument<string>;
}
export interface SealApproveStudioOwnerOptions {
  package?: string;
  arguments:
    | SealApproveStudioOwnerArguments
    | [
        id: RawTransactionArgument<number[]>,
        config: RawTransactionArgument<string>,
        self: RawTransactionArgument<string>,
      ];
}
export function sealApproveStudioOwner(options: SealApproveStudioOwnerOptions) {
  const packageAddress = options.package ?? "@local-pkg/zing_studio";
  const argumentsTypes = [
    "vector<u8>",
    `${packageAddress}::config::Config`,
    `${packageAddress}::studio::Studio`,
  ] satisfies string[];
  const parameterNames = ["id", "config", "self"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "studio",
      function: "seal_approve_studio_owner",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
    });
}
export interface SealApproveRegisteredEnclaveArguments {
  id: RawTransactionArgument<number[]>;
  config: RawTransactionArgument<string>;
  self: RawTransactionArgument<string>;
  enclave: RawTransactionArgument<string>;
}
export interface SealApproveRegisteredEnclaveOptions {
  package?: string;
  arguments:
    | SealApproveRegisteredEnclaveArguments
    | [
        id: RawTransactionArgument<number[]>,
        config: RawTransactionArgument<string>,
        self: RawTransactionArgument<string>,
        enclave: RawTransactionArgument<string>,
      ];
}
export function sealApproveRegisteredEnclave(
  options: SealApproveRegisteredEnclaveOptions,
) {
  const packageAddress = options.package ?? "@local-pkg/zing_studio";
  const argumentsTypes = [
    "vector<u8>",
    `${packageAddress}::config::Config`,
    `${packageAddress}::studio::Studio`,
    `${packageAddress}::enclave::Enclave`,
  ] satisfies string[];
  const parameterNames = ["id", "config", "self", "enclave"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "studio",
      function: "seal_approve_registered_enclave",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
    });
}
export interface StudioOfArguments {
  config: RawTransactionArgument<string>;
  owner: RawTransactionArgument<string>;
}
export interface StudioOfOptions {
  package?: string;
  arguments:
    | StudioOfArguments
    | [
        config: RawTransactionArgument<string>,
        owner: RawTransactionArgument<string>,
      ];
}
/**
 * Calculates the expected ID of a studio for a given owner Uses deterministic
 * address derivation based on config and owner
 */
export function studioOf(options: StudioOfOptions) {
  const packageAddress = options.package ?? "@local-pkg/zing_studio";
  const argumentsTypes = [
    `${packageAddress}::config::Config`,
    "address",
  ] satisfies string[];
  const parameterNames = ["config", "owner"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "studio",
      function: "studio_of",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
    });
}
export interface StudioExistsArguments {
  config: RawTransactionArgument<string>;
  owner: RawTransactionArgument<string>;
}
export interface StudioExistsOptions {
  package?: string;
  arguments:
    | StudioExistsArguments
    | [
        config: RawTransactionArgument<string>,
        owner: RawTransactionArgument<string>,
      ];
}
/**
 * Checks if a studio already exists for the given owner Returns true if the studio
 * has been created, false otherwise
 */
export function studioExists(options: StudioExistsOptions) {
  const packageAddress = options.package ?? "@local-pkg/zing_studio";
  const argumentsTypes = [
    `${packageAddress}::config::Config`,
    "address",
  ] satisfies string[];
  const parameterNames = ["config", "owner"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "studio",
      function: "studio_exists",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
    });
}
export interface IsInValidPeriodArguments {
  self: RawTransactionArgument<string>;
}
export interface IsInValidPeriodOptions {
  package?: string;
  arguments: IsInValidPeriodArguments | [self: RawTransactionArgument<string>];
}
export function isInValidPeriod(options: IsInValidPeriodOptions) {
  const packageAddress = options.package ?? "@local-pkg/zing_studio";
  const argumentsTypes = [
    `${packageAddress}::studio::Studio`,
    "0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock",
  ] satisfies string[];
  const parameterNames = ["self"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "studio",
      function: "is_in_valid_period",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
    });
}
export interface MembershipLevelArguments {
  self: RawTransactionArgument<string>;
  member: RawTransactionArgument<string>;
}
export interface MembershipLevelOptions {
  package?: string;
  arguments:
    | MembershipLevelArguments
    | [
        self: RawTransactionArgument<string>,
        member: RawTransactionArgument<string>,
      ];
}
export function membershipLevel(options: MembershipLevelOptions) {
  const packageAddress = options.package ?? "@local-pkg/zing_studio";
  const argumentsTypes = [
    `${packageAddress}::studio::Studio`,
    "address",
    "0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock",
  ] satisfies string[];
  const parameterNames = ["self", "member"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "studio",
      function: "membership_level",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
    });
}
export interface IsMembershipArguments {
  self: RawTransactionArgument<string>;
  member: RawTransactionArgument<string>;
}
export interface IsMembershipOptions {
  package?: string;
  arguments:
    | IsMembershipArguments
    | [
        self: RawTransactionArgument<string>,
        member: RawTransactionArgument<string>,
      ];
}
export function isMembership(options: IsMembershipOptions) {
  const packageAddress = options.package ?? "@local-pkg/zing_studio";
  const argumentsTypes = [
    `${packageAddress}::studio::Studio`,
    "address",
    "0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock",
  ] satisfies string[];
  const parameterNames = ["self", "member"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "studio",
      function: "is_membership",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
    });
}
export interface NewArguments {
  config: RawTransactionArgument<string>;
}
export interface NewOptions {
  package?: string;
  arguments: NewArguments | [config: RawTransactionArgument<string>];
}
/**
 * Creates a new personal studio as a shared object Each user can only have one
 * studio, enforced by derived object mechanism The studio is immediately shared so
 * others can view (but not modify) the works
 */
export function _new(options: NewOptions) {
  const packageAddress = options.package ?? "@local-pkg/zing_studio";
  const argumentsTypes = [
    `${packageAddress}::config::Config`,
  ] satisfies string[];
  const parameterNames = ["config"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "studio",
      function: "new",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
    });
}
export interface ShareStudioArguments {
  self: RawTransactionArgument<string>;
}
export interface ShareStudioOptions {
  package?: string;
  arguments: ShareStudioArguments | [self: RawTransactionArgument<string>];
}
export function shareStudio(options: ShareStudioOptions) {
  const packageAddress = options.package ?? "@local-pkg/zing_studio";
  const argumentsTypes = [
    `${packageAddress}::studio::Studio`,
  ] satisfies string[];
  const parameterNames = ["self"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "studio",
      function: "share_studio",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
    });
}

