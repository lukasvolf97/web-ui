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
import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {AppState} from 'src/app/core/store/app.state';
import {
  selectCollectionsByWritePermission,
  selectLinkTypesByWritePermission,
  selectViewsByRead,
} from 'src/app/core/store/common/permissions.selectors';
import {LinkType} from 'src/app/core/store/link-types/link.type';
import {View} from 'src/app/core/store/views/view';
import {RuleVariable} from 'src/app/shared/blockly/rule-variable-type';
import {Collection} from '../../../../../../core/store/collections/collection';

@Component({
  selector: 'wizard-form',
  templateUrl: './wizard-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardFormComponent implements OnInit {
  @Input()
  public form: FormGroup;

  @Input()
  public collection: Collection;

  @Input()
  public linkType: LinkType;

  public collections$: Observable<Collection[]>;
  public linkTypes$: Observable<LinkType[]>;
  public views$: Observable<View[]>;

  public variables: RuleVariable[];

  constructor(private store$: Store<AppState>) {}

  public ngOnInit(): void {
    this.collections$ = this.store$.pipe(select(selectCollectionsByWritePermission));
    this.views$ = this.store$.pipe(select(selectViewsByRead));
    this.linkTypes$ = this.store$.pipe(select(selectLinkTypesByWritePermission));
    if (this.collection) {
      this.variables = [
        {name: 'oldRecord', collectionId: this.collection.id},
        {name: 'newRecord', collectionId: this.collection.id},
      ];
    }
    if (this.linkType) {
      this.variables = [
        {name: 'oldLink', linkTypeId: this.linkType.id},
        {name: 'newLink', linkTypeId: this.linkType.id},
      ];
    }
  }
}
