// ability.factory.ts
import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action } from './action.enum';
import { Role, User } from './entities/user.entity';
import { Booking } from './entities/booking.entity';
import { UmrahPackage } from './entities/umrah.entity';

export type Subjects = typeof User | typeof Booking | typeof UmrahPackage | 'all';
export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
    defineAbility(user: User): AppAbility {
        const { can, cannot, build } = new AbilityBuilder(Ability as AbilityClass<AppAbility>);

        if (user.roles.includes(Role.ADMIN)) {
            can(Action.Manage, 'all'); // Admins can manage everything
        } else if (user.roles.includes(Role.EDITOR)) {
            can(Action.Read, User); // Editors can read all user data
        } else if (user.roles.includes(Role.USER)) {
            can(Action.Read, UmrahPackage,); // General users can read only Umrah packages
        } else {
            cannot(Action.Manage, 'all'); // Default deny all
        }

        return build();
    }
}