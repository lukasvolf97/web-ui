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

import {Input, OnInit, Output} from '@angular/core';
import {Component, ChangeDetectionStrategy} from '@angular/core';
import {DataValue} from '@lumeer/data-filters/dist/data-value/data-value';
import {Attribute, Collection} from 'src/app/core/store/collections/collection';
import {Subject, combineLatest} from 'rxjs';
import {RuleBuilderUtil} from '../../rule-builder-util';
import {ConstraintData} from '@lumeer/data-filters';
import {Condition} from '../condition';

@Component({
  selector: 'attribute-change-condition',
  templateUrl: './attribute-change-condition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttributeChangeConditionComponent implements OnInit, Condition {
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
      this.code.next(new RuleBuilderUtil().newDocumentAttribute(attributeId).equalsTo(editedValue).build());
    });
  }

  public onSelectedItem(event: any): void {
    this.selectedAttribute$.next(this.collections[event.collectionIndex].attributes[event.attributeIndex]);
  }

  public onValueChange(data: DataValue): void {
    this.editedValue$.next(data);
  }
}
