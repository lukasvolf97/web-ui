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

import {OnInit, Output} from '@angular/core';
import {Input} from '@angular/core';
import {Component, ChangeDetectionStrategy} from '@angular/core';
import {ConstraintData, DataValue} from '@lumeer/data-filters';
import {combineLatest, Subject} from 'rxjs';
import {Attribute, Collection} from 'src/app/core/store/collections/collection';
import {RuleBuilderUtil} from '../../../rule-builder-util';
import {Action} from '../action';

@Component({
  selector: 'attribute-change-action',
  templateUrl: './attribute-change-action.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttributeChangeActionComponent implements OnInit, Action {
  @Input()
  public collections: Array<Collection>;

  @Input()
  public constraintData: ConstraintData;

  @Output()
  public code: Subject<string> = new Subject();

  public selectedAttribute$: Subject<Attribute> = new Subject();
  public editedValue$: Subject<DataValue> = new Subject();

  constructor() {}

  ngOnInit(): void {
    combineLatest([this.editedValue$, this.selectedAttribute$]).subscribe(val => {
      const editedValue = (<DataValue>val[0]).value;
      const attributeId = (<Attribute>val[1]).id;
      this.code.next(new RuleBuilderUtil().setValueForNewDocumentAttribute(attributeId, editedValue).build());
    });
  }

  public onSelectedItem(event: any): void {
    this.selectedAttribute$.next(this.collections[event.collectionIndex].attributes[event.attributeIndex]);
  }

  public onValueChange(data: DataValue): void {
    this.editedValue$.next(data);
  }
}
