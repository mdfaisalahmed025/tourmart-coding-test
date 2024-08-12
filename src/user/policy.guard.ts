import { Role } from './roles.enum';
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
        const policyHandlers = this.reflector.get<PolicyHandler[]>(
            CHECK_POLICIES_KEY,
            context.getHandler(),
        ) || [];

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        console.log('Request user:', user);

        // Check if user and roles are defined
        if (!user || !user.role) {
            console.log('Access denied: User or roles not found.');
            throw new ForbiddenException('Access denied');
        }

        const ability = this.abilityFactory.defineAbility(user);

        console.log('User roles:', user.role);
        console.log('Abilities:', ability.rules);

        // Check if policy handlers pass
        const result = policyHandlers.every((handler) =>
            this.execPolicyHandler(handler, ability),
        );

        if (!result) {
            console.log('Access denied: Policy handlers did not pass.');
            throw new ForbiddenException('Access denied');
        }

        return result;
    }

    private execPolicyHandler(handler: PolicyHandler, ability: AppAbility): boolean {
        if (typeof handler === 'function') {
            return handler(ability);
        }
        return handler.handle(ability);
    }
}