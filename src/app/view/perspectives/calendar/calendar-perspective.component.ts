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

import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {DocumentModel} from '../../../core/store/documents/document.model';
import {Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {selectDocumentsAndLinksByQuerySorted} from '../../../core/store/common/permissions.selectors';
import {Collection} from '../../../core/store/collections/collection';
import {map} from 'rxjs/operators';
import {ViewConfig} from '../../../core/store/views/view';
import {DocumentsAction} from '../../../core/store/documents/documents.action';
import {AppState} from '../../../core/store/app.state';
import {selectCalendarById} from '../../../core/store/calendars/calendars.state';
import {CalendarConfig} from '../../../core/store/calendars/calendar';
import {CalendarsAction} from '../../../core/store/calendars/calendars.action';
import {Query} from '../../../core/store/navigation/query/query';
import {AllowedPermissions} from '../../../core/model/allowed-permissions';
import {checkOrTransformCalendarConfig} from './util/calendar-util';
import {LinkInstance} from '../../../core/store/link-instances/link.instance';
import {LinkType} from '../../../core/store/link-types/link.type';
import {LinkInstancesAction} from '../../../core/store/link-instances/link-instances.action';
import {selectCollectionsPermissions} from '../../../core/store/user-permissions/user-permissions.state';
import {DataPerspectiveComponent} from '../data-perspective.component';

@Component({
  selector: 'calendar',
  templateUrl: './calendar-perspective.component.html',
  styleUrls: ['./calendar-perspective.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarPerspectiveComponent
  extends DataPerspectiveComponent<CalendarConfig>
  implements OnInit, OnDestroy {
  public permissions$: Observable<Record<string, AllowedPermissions>>;

  constructor(protected store$: Store<AppState>) {
    super(store$);
  }

  public ngOnInit() {
    super.ngOnInit();
    this.subscribeAdditionalData();
  }

  public checkOrTransformConfig(
    config: CalendarConfig,
    query: Query,
    collections: Collection[],
    linkTypes: LinkType[]
  ): CalendarConfig {
    return checkOrTransformCalendarConfig(config, query, collections, linkTypes);
  }

  public configChanged(perspectiveId: string, config: CalendarConfig) {
    this.store$.dispatch(new CalendarsAction.AddCalendar({calendar: {id: perspectiveId, config}}));
  }

  public getConfig(viewConfig: ViewConfig): CalendarConfig {
    return viewConfig?.calendar;
  }

  public subscribeConfig$(perspectiveId: string): Observable<CalendarConfig> {
    return this.store$.pipe(
      select(selectCalendarById(perspectiveId)),
      map(entity => entity?.config)
    );
  }

  public subscribeDocumentsAndLinks$(): Observable<{documents: DocumentModel[]; linkInstances: LinkInstance[]}> {
    return this.store$.pipe(select(selectDocumentsAndLinksByQuerySorted));
  }

  private subscribeAdditionalData() {
    this.permissions$ = this.store$.pipe(select(selectCollectionsPermissions));
  }

  public onConfigChanged(config: CalendarConfig) {
    this.store$.dispatch(new CalendarsAction.SetConfig({calendarId: this.perspectiveId$.value, config}));
  }

  public patchDocumentData(document: DocumentModel) {
    this.store$.dispatch(new DocumentsAction.PatchData({document}));
  }

  public patchLinkInstanceData(linkInstance: LinkInstance) {
    this.store$.dispatch(new LinkInstancesAction.PatchData({linkInstance}));
  }
}
