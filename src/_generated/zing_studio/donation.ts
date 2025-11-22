/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct } from '../utils/index';
import * as object from './deps/sui/object';
import * as table from './deps/sui/table';
import * as bag from './deps/sui/bag';
const $moduleName = '@local-pkg/zing_studio::donation';
export const Donation = new MoveStruct({ name: `${$moduleName}::Donation`, fields: {
        id: object.UID,
        donations: table.Table,
        accumulated_donations: table.Table,
        balances: bag.Bag
    } });
