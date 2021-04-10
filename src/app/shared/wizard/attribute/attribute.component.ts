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

import {Component, ChangeDetectionStrategy, Input, Output, EventEmitter, AfterViewInit} from '@angular/core';
import {SelectItemModel} from '../../../../app/shared/select/select-item/select-item.model';
import {ConstraintTypeIconPipe} from '../../../../app/shared/pipes/constraint-type-icon.pipe';
import {OnInit} from '@angular/core';
import {Collection} from '../../../core/store/collections/collection';

@Component({
  selector: 'attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttributeComponent implements OnInit, AfterViewInit {
  @Input()
  public collections: Collection[];

  @Output()
  public selectedItem: EventEmitter<SelectItemModel> = new EventEmitter<SelectItemModel>();

  public options: SelectItemModel[] = [];
  public selectedAttributeId: any = {};

  constructor(private constraintTypeIconPipe: ConstraintTypeIconPipe) {}

  public ngOnInit(): void {
    this.transformCollectionsAttributesToSelectItems();
  }

  public ngAfterViewInit(): void {
    document.querySelectorAll('.wiz-select-button').forEach(item => item.classList.remove('dropdown-toggle'));
  }

  public onSelectValue(id: SelectItemModel): void {
    this.selectedAttributeId = id;
    this.selectedItem.emit(id);
  }

  private transformCollectionsAttributesToSelectItems(): void {
    this.collections.forEach((collection, colIndex) => {
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
