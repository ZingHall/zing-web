/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct } from '../../../utils/index';
import { bcs } from '@mysten/sui/bcs';
import * as object from '../sui/object';
const $moduleName = 'zing_framework::derived_object_bag';
export const DerivedObjectBag = new MoveStruct({ name: `${$moduleName}::DerivedObjectBag`, fields: {
        /** the ID of this bag */
        id: object.UID,
        /** the number of key-value pairs in the bag */
        size: bcs.u64()
    } });
