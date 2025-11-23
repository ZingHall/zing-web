/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct } from '../../../utils/index';
import { bcs } from '@mysten/sui/bcs';
import * as object from '../sui/object';
const $moduleName = 'zing_framework::derived_table';
export const DerivedTable = new MoveStruct({ name: `${$moduleName}::DerivedTable`, fields: {
        /** the ID of this table */
        id: object.UID,
        /** the number of key-value pairs in the table */
        size: bcs.u64()
    } });
