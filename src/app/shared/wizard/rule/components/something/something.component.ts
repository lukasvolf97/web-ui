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

import {EventEmitter, Output, SimpleChanges} from '@angular/core';
import {Component, ChangeDetectionStrategy, Input, OnChanges} from '@angular/core';
import {ConstraintData, ConstraintType, DataValue, UnknownConstraint} from '@lumeer/data-filters';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Attribute} from 'src/app/core/store/collections/collection';
import {DataInputConfiguration} from 'src/app/shared/data-input/data-input-configuration';
import DOMPurify from 'dompurify';

@Component({
  selector: 'something',
  templateUrl: './something.component.html',
  styleUrls: ['./something.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SomethingComponent implements OnChanges {
  @Input()
  public attribute: Attribute;

  @Input()
  public constraintData: ConstraintData;

  @Output()
  public inputValue: EventEmitter<DataValue> = new EventEmitter<DataValue>();

  public editedValue: DataValue;
  public editing$ = new BehaviorSubject(false);
  public editable: boolean = true;
  public dataValue$: Observable<DataValue>;

  public configuration: DataInputConfiguration = {
    common: {inline: true, skipValidation: true, resizeToContent: true, minWidth: 16, allowRichText: true},
    color: {limitWidth: true},
  };

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.editedValue) {
      this.dataValue$ = this.createDataValue(this.getValue());
    }
    if (changes.attribute) {
      this.editing$.next(false);
      this.editedValue = null;
      this.dataValue$ = this.createDataValue(this.getValue());
    }
  }

  private createDataValue(value: any): Observable<DataValue> {
    const constraint = this.attribute?.constraint || new UnknownConstraint();
    return of(constraint.createDataValue(value, this.constraintData));
  }

  public onCancelEditing() {
    this.editing$.next(false);
    this.updateOutputValuesWithValue(this.editedValue);
  }

  public onValueChange(dataValue: DataValue) {
    this.editedValue = dataValue;
    this.updateOutputValuesWithValue(this.editedValue);
  }

  public onValueSave(dataValue: DataValue) {
    this.editedValue = dataValue.value ? dataValue : null;
    if (this.attribute?.constraint?.type === ConstraintType.User && this.editedValue?.value.length === 0) {
      this.editedValue = null;
    }
    this.editing$.next(false);
    this.updateOutputValuesWithValue(this.editedValue);
  }

  public openEditor(attribute: Attribute) {
    if (attribute) {
      this.editing$.next(true);
    }
  }

  private updateOutputValuesWithValue(dataValue: DataValue) {
    if (dataValue?.value) {
      dataValue.value = DOMPurify.sanitize(dataValue.value);
    }
    this.dataValue$ = of(dataValue);
    this.inputValue.emit(dataValue);
  }

  private getValue(): any {
    return this.editedValue?.value ?? '';
  }
}
