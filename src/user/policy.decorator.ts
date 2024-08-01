// policy.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { AppAbility } from './ability.factor';


export const CHECK_POLICIES_KEY = 'check_policy';
export type PolicyHandlerCallback = (ability: AppAbility) => boolean;
export interface PolicyHandlerObject {
    handle(ability: AppAbility): boolean;
}

export type PolicyHandler = PolicyHandlerCallback | PolicyHandlerObject;

export const CheckPolicies = (...handlers: PolicyHandler[]) => SetMetadata(CHECK_POLICIES_KEY, handlers);
