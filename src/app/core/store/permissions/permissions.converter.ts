/*
 * Lumeer: Modern Data Definition and Processing Platform
 *
 * Copyright (C) since 2017 Lumeer.io, s.r.o. and/or its affiliates.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import {Permission, Permissions} from './permissions';
import {PermissionDto, PermissionsDto} from '../../dto';

export class PermissionsConverter {
  public static fromDto(dto: PermissionsDto): Permissions {
    if (!dto) {
      return null;
    }

    return {
      users: dto.users ? dto.users.map(PermissionsConverter.fromPermissionDto) : [],
      groups: dto.groups ? dto.groups.map(PermissionsConverter.fromPermissionDto) : [],
    };
  }

  public static toDto(permissions: Permissions): PermissionsDto {
    if (!permissions) {
      return null;
    }

    return {
      users: permissions.users ? permissions.users.map(PermissionsConverter.toPermissionDto) : [],
      groups: permissions.groups ? permissions.groups.map(PermissionsConverter.toPermissionDto) : [],
    };
  }

  public static fromPermissionDto(dto: PermissionDto): Permission {
    return {
      id: dto.id,
      roles: dto.roles,
    };
  }

  public static toPermissionDto(permission: Permission): PermissionDto {
    return {
      id: permission.id,
      roles: permission.roles,
    };
  }
}
