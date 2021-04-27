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

import {Component, ChangeDetectionStrategy, Input} from '@angular/core';
import {ConstraintData} from '@lumeer/data-filters';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {AppState} from 'src/app/core/store/app.state';
import {Collection} from 'src/app/core/store/collections/collection';
import {selectConstraintData} from 'src/app/core/store/constraint-data/constraint-data.state';
import {AttributeChangeActionComponent} from './rule/actions/attribute-change-action/attribute-change-action.component';
import {AttributeChangeConditionComponent} from './rule/conditions/attribute-change-condition/attribute-change-condition.component';

@Component({
  selector: 'rule-editor',
  templateUrl: './rule-editor.component.html',
  styleUrls: ['./rule-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RuleEditorComponent {
  @Input()
  public collections: Collection[];

  @Input()
  public rule = {
    actions: [AttributeChangeActionComponent],
    conditions: [AttributeChangeConditionComponent],
  };

  public constraintData$: Observable<ConstraintData>;

  constructor(private store$: Store<AppState>) {
    this.constraintData$ = this.store$.pipe(select(selectConstraintData));
  }

  /* TODO */
  public goBackToGallery() {}

  public onCodeChange(code: string) {}
}
