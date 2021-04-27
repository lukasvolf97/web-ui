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

import {Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {Collection} from '../../../../core/store/collections/collection';
import {ConstraintTypeIconPipe} from 'src/app/shared/pipes/constraint-type-icon.pipe';
import {SelectItem2Model} from 'src/app/shared/select/select-item2/select-item2.model';

@Component({
  selector: 'attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttributeComponent implements OnChanges {
  @Input()
  public collections: Array<Collection>;

  @Input()
  public emptyValue: string;

  @Output()
  public selectedItem: EventEmitter<any> = new EventEmitter<any>();

  public options: Array<SelectItem2Model> = [];
  public selectedAttributeId: Array<any> = [];

  constructor(private constraintTypeIconPipe: ConstraintTypeIconPipe) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.collections) {
      this.transformCollectionsAttributesToSelectItems(changes.collections.currentValue);
    }
  }

  public onSelectValue(event: SelectItem2Model[]): void {
    this.selectedAttributeId = event[0]?.id;
    this.selectedItem.emit(this.selectedAttributeId);
  }

  private transformCollectionsAttributesToSelectItems(collections: Array<Collection>): void {
    collections.forEach((collection, colIndex) => {
      collection.attributes.forEach((attribute, attrIndex) => {
        this.options.push({
          id: {
            collectionIndex: colIndex,
            attributeIndex: attrIndex,
          },
          value: attribute.name,
          icons: [collection.icon, this.constraintTypeIconPipe.transform(attribute.constraint)],
          iconColors: [collection.color],
        });
      });
    });
  }
}
