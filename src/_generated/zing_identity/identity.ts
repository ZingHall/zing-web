/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index';
import { bcs, type BcsType } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as object from './deps/sui/object';
import * as table from './deps/sui/table';
import * as vec_set from './deps/sui/vec_set';
import * as type_name from './deps/std/type_name';
const $moduleName = '@local-pkg/zing_identity::identity';
export const IdentityManager = new MoveStruct({ name: `${$moduleName}::IdentityManager`, fields: {
        id: object.UID,
        address_to_identifier: table.Table,
        identifier_info: table.Table,
        whitelist_modules: vec_set.VecSet(type_name.TypeName)
    } });
export const IdentifierInfo = new MoveStruct({ name: `${$moduleName}::IdentifierInfo`, fields: {
        owner: bcs.Address,
        updated_at: bcs.u64()
    } });
export const ReadAccess = new MoveStruct({ name: `${$moduleName}::ReadAccess`, fields: {
        dummy_field: bcs.bool()
    } });
export interface ModuleAddressToIdentifierBorrowArguments<T extends BcsType<any>> {
    self: RawTransactionArgument<string>;
    Witness: RawTransactionArgument<T>;
}
export interface ModuleAddressToIdentifierBorrowOptions<T extends BcsType<any>> {
    package?: string;
    arguments: ModuleAddressToIdentifierBorrowArguments<T> | [
        self: RawTransactionArgument<string>,
        Witness: RawTransactionArgument<T>
    ];
    typeArguments: [
        string
    ];
}
export function moduleAddressToIdentifierBorrow<T extends BcsType<any>>(options: ModuleAddressToIdentifierBorrowOptions<T>) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::identity::IdentityManager<${options.typeArguments[0]}>`,
        `${options.typeArguments[0]}`
    ] satisfies string[];
    const parameterNames = ["self", "Witness"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'identity',
        function: 'module_address_to_identifier_borrow',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface ModuleAddressToIdentifierBorrowMutArguments<T extends BcsType<any>> {
    self: RawTransactionArgument<string>;
    Witness: RawTransactionArgument<T>;
}
export interface ModuleAddressToIdentifierBorrowMutOptions<T extends BcsType<any>> {
    package?: string;
    arguments: ModuleAddressToIdentifierBorrowMutArguments<T> | [
        self: RawTransactionArgument<string>,
        Witness: RawTransactionArgument<T>
    ];
    typeArguments: [
        string
    ];
}
export function moduleAddressToIdentifierBorrowMut<T extends BcsType<any>>(options: ModuleAddressToIdentifierBorrowMutOptions<T>) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::identity::IdentityManager<${options.typeArguments[0]}>`,
        `${options.typeArguments[0]}`
    ] satisfies string[];
    const parameterNames = ["self", "Witness"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'identity',
        function: 'module_address_to_identifier_borrow_mut',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface ModuleIdentifierInfoBorrowArguments<T extends BcsType<any>> {
    self: RawTransactionArgument<string>;
    Witness: RawTransactionArgument<T>;
}
export interface ModuleIdentifierInfoBorrowOptions<T extends BcsType<any>> {
    package?: string;
    arguments: ModuleIdentifierInfoBorrowArguments<T> | [
        self: RawTransactionArgument<string>,
        Witness: RawTransactionArgument<T>
    ];
    typeArguments: [
        string
    ];
}
export function moduleIdentifierInfoBorrow<T extends BcsType<any>>(options: ModuleIdentifierInfoBorrowOptions<T>) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::identity::IdentityManager<${options.typeArguments[0]}>`,
        `${options.typeArguments[0]}`
    ] satisfies string[];
    const parameterNames = ["self", "Witness"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'identity',
        function: 'module_identifier_info_borrow',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface ModuleIdentifierInfoBorrowMutArguments<T extends BcsType<any>> {
    self: RawTransactionArgument<string>;
    Witness: RawTransactionArgument<T>;
}
export interface ModuleIdentifierInfoBorrowMutOptions<T extends BcsType<any>> {
    package?: string;
    arguments: ModuleIdentifierInfoBorrowMutArguments<T> | [
        self: RawTransactionArgument<string>,
        Witness: RawTransactionArgument<T>
    ];
    typeArguments: [
        string
    ];
}
export function moduleIdentifierInfoBorrowMut<T extends BcsType<any>>(options: ModuleIdentifierInfoBorrowMutOptions<T>) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::identity::IdentityManager<${options.typeArguments[0]}>`,
        `${options.typeArguments[0]}`
    ] satisfies string[];
    const parameterNames = ["self", "Witness"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'identity',
        function: 'module_identifier_info_borrow_mut',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface NewIdentifierInfoArguments {
    owner: RawTransactionArgument<string>;
    updatedAt: RawTransactionArgument<number | bigint>;
}
export interface NewIdentifierInfoOptions {
    package?: string;
    arguments: NewIdentifierInfoArguments | [
        owner: RawTransactionArgument<string>,
        updatedAt: RawTransactionArgument<number | bigint>
    ];
}
export function newIdentifierInfo(options: NewIdentifierInfoOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        'address',
        'u64'
    ] satisfies string[];
    const parameterNames = ["owner", "updatedAt"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'identity',
        function: 'new_identifier_info',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface DropIdentifierInfoArguments {
    identifierInfo: RawTransactionArgument<string>;
}
export interface DropIdentifierInfoOptions {
    package?: string;
    arguments: DropIdentifierInfoArguments | [
        identifierInfo: RawTransactionArgument<string>
    ];
}
export function dropIdentifierInfo(options: DropIdentifierInfoOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::identity::IdentifierInfo`
    ] satisfies string[];
    const parameterNames = ["identifierInfo"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'identity',
        function: 'drop_identifier_info',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface OwnerArguments {
    info: RawTransactionArgument<string>;
}
export interface OwnerOptions {
    package?: string;
    arguments: OwnerArguments | [
        info: RawTransactionArgument<string>
    ];
}
export function owner(options: OwnerOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::identity::IdentifierInfo`
    ] satisfies string[];
    const parameterNames = ["info"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'identity',
        function: 'owner',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface UpdatedAtArguments {
    info: RawTransactionArgument<string>;
}
export interface UpdatedAtOptions {
    package?: string;
    arguments: UpdatedAtArguments | [
        info: RawTransactionArgument<string>
    ];
}
export function updatedAt(options: UpdatedAtOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::identity::IdentifierInfo`
    ] satisfies string[];
    const parameterNames = ["info"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'identity',
        function: 'updated_at',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface UpdateOwnerArguments {
    info: RawTransactionArgument<string>;
    owner: RawTransactionArgument<string>;
}
export interface UpdateOwnerOptions {
    package?: string;
    arguments: UpdateOwnerArguments | [
        info: RawTransactionArgument<string>,
        owner: RawTransactionArgument<string>
    ];
}
export function updateOwner(options: UpdateOwnerOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::identity::IdentifierInfo`,
        'address'
    ] satisfies string[];
    const parameterNames = ["info", "owner"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'identity',
        function: 'update_owner',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface UpdateUpdatedAtArguments {
    info: RawTransactionArgument<string>;
    updatedAt: RawTransactionArgument<number | bigint>;
}
export interface UpdateUpdatedAtOptions {
    package?: string;
    arguments: UpdateUpdatedAtArguments | [
        info: RawTransactionArgument<string>,
        updatedAt: RawTransactionArgument<number | bigint>
    ];
}
export function updateUpdatedAt(options: UpdateUpdatedAtOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::identity::IdentifierInfo`,
        'u64'
    ] satisfies string[];
    const parameterNames = ["info", "updatedAt"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'identity',
        function: 'update_updated_at',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface GetReadAccessArguments {
    config: RawTransactionArgument<string>;
    treasury: RawTransactionArgument<string>;
    balance: RawTransactionArgument<string>;
}
export interface GetReadAccessOptions {
    package?: string;
    arguments: GetReadAccessArguments | [
        config: RawTransactionArgument<string>,
        treasury: RawTransactionArgument<string>,
        balance: RawTransactionArgument<string>
    ];
}
export function getReadAccess(options: GetReadAccessOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::config::Config`,
        `${packageAddress}::treasury::Treasury`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::balance::Balance<0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI>'
    ] satisfies string[];
    const parameterNames = ["config", "treasury", "balance"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'identity',
        function: 'get_read_access',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface IdentifierByAddressWithReadAccessArguments {
    self: RawTransactionArgument<string>;
    Access: RawTransactionArgument<string>;
    user: RawTransactionArgument<string>;
}
export interface IdentifierByAddressWithReadAccessOptions {
    package?: string;
    arguments: IdentifierByAddressWithReadAccessArguments | [
        self: RawTransactionArgument<string>,
        Access: RawTransactionArgument<string>,
        user: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function identifierByAddressWithReadAccess(options: IdentifierByAddressWithReadAccessOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::identity::IdentityManager<${options.typeArguments[0]}>`,
        `${packageAddress}::identity::ReadAccess`,
        'address'
    ] satisfies string[];
    const parameterNames = ["self", "Access", "user"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'identity',
        function: 'identifier_by_address_with_read_access',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface IdentifierInfoWithReadAccessArguments {
    self: RawTransactionArgument<string>;
    Access: RawTransactionArgument<string>;
    identifier: RawTransactionArgument<string>;
}
export interface IdentifierInfoWithReadAccessOptions {
    package?: string;
    arguments: IdentifierInfoWithReadAccessArguments | [
        self: RawTransactionArgument<string>,
        Access: RawTransactionArgument<string>,
        identifier: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function identifierInfoWithReadAccess(options: IdentifierInfoWithReadAccessOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::identity::IdentityManager<${options.typeArguments[0]}>`,
        `${packageAddress}::identity::ReadAccess`,
        '0x0000000000000000000000000000000000000000000000000000000000000001::ascii::String'
    ] satisfies string[];
    const parameterNames = ["self", "Access", "identifier"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'identity',
        function: 'identifier_info_with_read_access',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface NewArguments {
    config: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
}
export interface NewOptions {
    package?: string;
    arguments: NewArguments | [
        config: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function _new(options: NewOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::config::Config`,
        `${packageAddress}::admin::AdminCap`
    ] satisfies string[];
    const parameterNames = ["config", "Cap"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'identity',
        function: 'new',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface AddWhiteslitArguments {
    self: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
}
export interface AddWhiteslitOptions {
    package?: string;
    arguments: AddWhiteslitArguments | [
        self: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function addWhiteslit(options: AddWhiteslitOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::identity::IdentityManager<${options.typeArguments[0]}>`,
        `${packageAddress}::admin::AdminCap`
    ] satisfies string[];
    const parameterNames = ["self", "Cap"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'identity',
        function: 'add_whiteslit',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface RemoveWhiteslitArguments {
    self: RawTransactionArgument<string>;
    Cap: RawTransactionArgument<string>;
}
export interface RemoveWhiteslitOptions {
    package?: string;
    arguments: RemoveWhiteslitArguments | [
        self: RawTransactionArgument<string>,
        Cap: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function removeWhiteslit(options: RemoveWhiteslitOptions) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::identity::IdentityManager<${options.typeArguments[0]}>`,
        `${packageAddress}::admin::AdminCap`
    ] satisfies string[];
    const parameterNames = ["self", "Cap"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'identity',
        function: 'remove_whiteslit',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface IdentifierByAddressWithWhitelistArguments<Whitelist extends BcsType<any>> {
    self: RawTransactionArgument<string>;
    _: RawTransactionArgument<Whitelist>;
    user: RawTransactionArgument<string>;
}
export interface IdentifierByAddressWithWhitelistOptions<Whitelist extends BcsType<any>> {
    package?: string;
    arguments: IdentifierByAddressWithWhitelistArguments<Whitelist> | [
        self: RawTransactionArgument<string>,
        _: RawTransactionArgument<Whitelist>,
        user: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function identifierByAddressWithWhitelist<Whitelist extends BcsType<any>>(options: IdentifierByAddressWithWhitelistOptions<Whitelist>) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::identity::IdentityManager<${options.typeArguments[0]}>`,
        `${options.typeArguments[1]}`,
        'address'
    ] satisfies string[];
    const parameterNames = ["self", "_", "user"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'identity',
        function: 'identifier_by_address_with_whitelist',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface IdentifierInfoWithWhitelistArguments<Whitelist extends BcsType<any>> {
    self: RawTransactionArgument<string>;
    _: RawTransactionArgument<Whitelist>;
    identifier: RawTransactionArgument<string>;
}
export interface IdentifierInfoWithWhitelistOptions<Whitelist extends BcsType<any>> {
    package?: string;
    arguments: IdentifierInfoWithWhitelistArguments<Whitelist> | [
        self: RawTransactionArgument<string>,
        _: RawTransactionArgument<Whitelist>,
        identifier: RawTransactionArgument<string>
    ];
    typeArguments: [
        string,
        string
    ];
}
export function identifierInfoWithWhitelist<Whitelist extends BcsType<any>>(options: IdentifierInfoWithWhitelistOptions<Whitelist>) {
    const packageAddress = options.package ?? '@local-pkg/zing_identity';
    const argumentsTypes = [
        `${packageAddress}::identity::IdentityManager<${options.typeArguments[0]}>`,
        `${options.typeArguments[1]}`,
        '0x0000000000000000000000000000000000000000000000000000000000000001::ascii::String'
    ] satisfies string[];
    const parameterNames = ["self", "_", "identifier"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'identity',
        function: 'identifier_info_with_whitelist',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
