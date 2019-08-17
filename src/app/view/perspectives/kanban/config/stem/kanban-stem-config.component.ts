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

import {Component, ChangeDetectionStrategy, Input, Output, EventEmitter} from '@angular/core';
import {Collection} from '../../../../../core/store/collections/collection';
import {KanbanStemConfig} from '../../../../../core/store/kanbans/kanban';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {Constraint} from '../../../../../core/model/data/constraint';
import {SelectItemWithConstraintId} from '../../../../../shared/select/select-constraint-item/select-item-with-constraint.component';
import {LinkType} from '../../../../../core/store/link-types/link.type';
import {QueryStem} from '../../../../../core/store/navigation/query/query';
import {queryStemAttributesResourcesOrder} from '../../../../../core/store/navigation/query/query.util';
import {getAttributesResourceType} from '../../../../../shared/utils/resource.utils';

@Component({
  selector: 'kanban-collection-config',
  templateUrl: './kanban-stem-config.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanStemConfigComponent {
  @Input()
  public collections: Collection[];

  @Input()
  public linkTypes: LinkType[];

  @Input()
  public config: KanbanStemConfig;

  @Input()
  public stem: QueryStem;

  @Output()
  public configChange = new EventEmitter<KanbanStemConfig>();

  public readonly buttonClasses = 'flex-grow-1 text-truncate';
  public readonly emptyValueString: string;

  constructor(private i18n: I18n) {
    this.emptyValueString = i18n({id: 'kanban.config.collection.attribute.empty', value: 'Select attribute'});
  }

  public onAttributeRemoved() {
    this.configChange.emit({attribute: null});
  }

  public onConstraintSelected(constraint: Constraint) {
    const attribute = {...this.config.attribute};
    this.configChange.emit({...this.config, attribute: {...attribute, constraint}});
  }

  public onAttributeSelected(selectId: SelectItemWithConstraintId) {
    const {attributeId, resourceIndex} = selectId;
    const attributesResourcesOrder = queryStemAttributesResourcesOrder(this.stem, this.collections, this.linkTypes);
    const resource = attributesResourcesOrder[resourceIndex];
    if (resource) {
      const resourceType = getAttributesResourceType(resource);
      const attribute = {attributeId, resourceIndex, resourceType, resourceId: resource.id};
      this.configChange.emit({...this.config, attribute});
    }
  }
}
