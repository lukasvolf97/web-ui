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

import {Pipe, PipeTransform} from '@angular/core';
import {QueryData} from '../../top-panel/search-box/util/query-data';
import {QueryItemsConverter} from '../../top-panel/search-box/query-item/query-items.converter';
import {Query} from '../../../core/store/navigation/query/query';
import {COLOR_PRIMARY} from '../../../core/constants';

@Pipe({
  name: 'queryColor',
})
export class QueryColorPipe implements PipeTransform {
  public transform(query: Query, queryData: QueryData): string {
    const queryItems = new QueryItemsConverter(queryData).fromQuery(query);

    if (!queryItems || !queryItems.length || !queryItems[0].colors || !queryItems[0].colors.length) {
      return COLOR_PRIMARY;
    }

    return queryItems[0].colors[0];
  }
}