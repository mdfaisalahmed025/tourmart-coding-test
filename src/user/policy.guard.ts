// policies.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CHECK_POLICIES_KEY, PolicyHandler } from './policy.decorator';
import { AbilityFactory, AppAbility } from './ability.factor';

@Injectable()
export class PoliciesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private abilityFactory: AbilityFactory,
    ) { }

    canActivate(context: ExecutionContext): boolean {
        const policyHandlers =
            this.reflector.get<PolicyHandler[]>(
                CHECK_POLICIES_KEY,
                context.getHandler(),
            ) || [];

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Check if user is defined and has roles
        if (!user || !user.roles) {
            throw new ForbiddenException('Access denied');
        }

        const ability = this.abilityFactory.defineAbility(user);

        return policyHandlers.every((handler) =>
            this.execPolicyHandler(handler, ability),
        );
    }

    private execPolicyHandler(handler: PolicyHandler, ability: AppAbility): boolean {
        if (typeof handler === 'function') {
            return handler(ability);
        }
        return handler.handle(ability);
    }
}