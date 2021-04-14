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
import {ConstraintData} from '@lumeer/data-filters';
import {select, Store} from '@ngrx/store';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {AppState} from 'src/app/core/store/app.state';
import {Attribute, Collection} from 'src/app/core/store/collections/collection';
import {selectConstraintData} from 'src/app/core/store/constraint-data/constraint-data.state';
import {LinkType} from 'src/app/core/store/link-types/link.type';
import {WizardService} from '../wizard.service';

@Component({
  selector: 'wizard-editor',
  templateUrl: './wizard-editor.component.html',
  styleUrls: ['./wizard-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardEditorComponent {
  @Input()
  public collections: Collection[];

  @Input()
  public linkTypes: LinkType[];

  public rule$: Observable<string>;
  public constraintData$: Observable<ConstraintData>;

  public selectedCollection$: Subject<Collection> = new Subject();
  public selectedAttribute$: Subject<Attribute> = new Subject();

  constructor(private store$: Store<AppState>, private wizardService: WizardService) {
    this.rule$ = this.wizardService.rule$.pipe(map(r => r.replace(/<b>/g, ''))).pipe(map(r => r.replace(/<\/b>/g, '')));
    this.constraintData$ = this.store$.pipe(select(selectConstraintData));
  }

  displayGallery() {
    this.wizardService.changeEditingState(false);
  }

  onSelectedItem(event: any) {
    this.selectedCollection$.next(this.collections[event.collectionIndex]);
    this.selectedAttribute$.next(this.collections[event.collectionIndex].attributes[event.attributeIndex]);
  }
}
