/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/


/**
 * Defines the `Coin` type - platform wide representation of fungible tokens and
 * coins. `Coin` can be described as a secure wrapper around `Balance` type.
 */

import { MoveStruct } from '../../../utils/index';
import * as object from './object';
import * as balance from './balance';
const $moduleName = '0x2::coin';
export const Coin = new MoveStruct({ name: `${$moduleName}::Coin`, fields: {
        id: object.UID,
        balance: balance.Balance
    } });
