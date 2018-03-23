/*
 * Lumeer: Modern Data Definition and Processing Platform
 *
 * Copyright (C) since 2017 Answer Institute, s.r.o. and/or its affiliates.
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

import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {Observable} from 'rxjs/Observable';
import {catchError, map, skipWhile, switchMap, tap, withLatestFrom, flatMap} from 'rxjs/operators';
import {Document} from '../../dto';
import {DocumentService, SearchService} from '../../rest';
import {AppState} from '../app.state';
import {QueryConverter} from '../navigation/query.converter';
import {QueryHelper} from '../navigation/query.helper';
import {NotificationsAction} from '../notifications/notifications.action';
import {DocumentConverter} from './document.converter';
import {DocumentModel} from './document.model';
import {DocumentsAction, DocumentsActionType} from './documents.action';
import {selectDocumentsDictionary, selectDocumentsQueries} from './documents.state';
import {selectCollectionsDictionary} from "../collections/collections.state";
import {CollectionsAction} from "../collections/collections.action";
import {AttributeModel, CollectionModel} from "../collections/collection.model";
import {forEach} from "@angular/router/src/utils/collection";
import {extractAttributeName} from "../../../shared/utils/attribute.utils";

@Injectable()
export class DocumentsEffects {

  @Effect()
  public get$: Observable<Action> = this.actions$.ofType<DocumentsAction.Get>(DocumentsActionType.GET).pipe(
    withLatestFrom(this.store$.select(selectDocumentsQueries)),
    skipWhile(([action, queries]) => queries.some(query => QueryHelper.equal(query, action.payload.query))),
    switchMap(([action]) => {
      const queryDto = QueryConverter.toDto(action.payload.query);

      return this.searchService.searchDocuments(queryDto).pipe(
        map(dtos => dtos.map(dto => DocumentConverter.fromDto(dto)))
      );
    }),
    map(documents => new DocumentsAction.GetSuccess({documents: documents})),
    catchError((error) => Observable.of(new DocumentsAction.GetFailure({error: error})))
  );

  @Effect()
  public getFailure$: Observable<Action> = this.actions$.ofType<DocumentsAction.GetFailure>(DocumentsActionType.GET_FAILURE).pipe(
    tap(action => console.error(action.payload.error)),
    map(() => {
      const message = this.i18n({id: 'documents.get.fail', value: 'Failed to get records'});
      return new NotificationsAction.Error({message});
    })
  );

  @Effect()
  public create$: Observable<Action> = this.actions$.ofType<DocumentsAction.Create>(DocumentsActionType.CREATE).pipe(
    switchMap(action => {
      const documentDto = DocumentConverter.toDto(action.payload.document);

      return this.documentService.createDocument(documentDto).pipe(
        map(dto => DocumentConverter.fromDto(dto, action.payload.document.correlationId))
      );
    }),
    withLatestFrom(this.store$.select(selectCollectionsDictionary)),
    flatMap(([document, collectionEntities]) => {
      const collection = collectionEntities[document.collectionId];
      return [new DocumentsAction.CreateSuccess({document}),
        this.createAddCollectionAttributesAction(collection, document)];
    }),
    catchError((error) => Observable.of(new DocumentsAction.CreateFailure({error: error})))
  );

  @Effect()
  public createFailure$: Observable<Action> = this.actions$.ofType<DocumentsAction.CreateFailure>(DocumentsActionType.CREATE_FAILURE).pipe(
    tap(action => console.error(action.payload.error)),
    map(() => {
      const message = this.i18n({id: 'document.create.fail', value: 'Failed to create record'});
      return new NotificationsAction.Error({message});
    })
  );

  @Effect()
  public update$: Observable<Action> = this.actions$.ofType<DocumentsAction.Update>(DocumentsActionType.UPDATE).pipe(
    switchMap(action => {
      const documentDto = DocumentConverter.toDto(action.payload.document);

      if (action.payload.toggleFavourite) {
        return this.documentService.toggleDocumentFavorite(documentDto).pipe(
          map(() => {
            action.payload.document.favorite = !action.payload.document.favorite;
            return action.payload.document;
          })
        );
      }

      throw Error('not implemented on backend yet');
    }),
    map((document: DocumentModel) => new DocumentsAction.UpdateSuccess({document: document})),
    catchError((error) => Observable.of(new DocumentsAction.UpdateFailure({error: error})))
  );

  @Effect()
  public updateFailure$: Observable<Action> = this.actions$.ofType<DocumentsAction.UpdateFailure>(DocumentsActionType.UPDATE_FAILURE).pipe(
    tap(action => console.error(action.payload.error)),
    map(() => {
      const message = this.i18n({id: 'document.update.fail', value: 'Failed to update record'});
      return new NotificationsAction.Error({message});
    })
  );

  @Effect()
  public updateData$: Observable<Action> = this.actions$.ofType<DocumentsAction.UpdateData>(DocumentsActionType.UPDATE_DATA).pipe(
    switchMap(action => {
      const documentDto: Document = {
        id: action.payload.documentId,
        collectionId: action.payload.collectionId,
        data: action.payload.data
      };
      return this.documentService.updateDocument(documentDto).pipe(
        map(dto => DocumentConverter.fromDto(dto))
      );
    }),
    withLatestFrom(this.store$.select(selectCollectionsDictionary)),
    withLatestFrom(this.store$.select(selectDocumentsDictionary)),
    flatMap(([[document, collectionEntities], documentEntities]) => {
      const collection = collectionEntities[document.collectionId];
      const oldDocument = documentEntities[document.id];

      return [new DocumentsAction.UpdateDataSuccess({document}),
        this.createUpdateCollectionAttributesAction(collection, document, oldDocument)];
    }),
    catchError((error) => Observable.of(new DocumentsAction.UpdateDataFailure({error: error})))
  );

  @Effect()
  public updateDataFailure$: Observable<Action> = this.actions$.ofType<DocumentsAction.UpdateDataFailure>(DocumentsActionType.UPDATE_DATA_FAILURE).pipe(
    tap(action => console.error(action.payload.error)),
    map(() => {
      const message = this.i18n({id: 'document.update.fail', value: 'Failed to update record'});
      return new NotificationsAction.Error({message});
    })
  );

  @Effect()
  public delete$: Observable<Action> = this.actions$.ofType<DocumentsAction.Delete>(DocumentsActionType.DELETE).pipe(
    switchMap(action => {
      return this.documentService.removeDocument(action.payload.collectionId, action.payload.documentId).pipe(
        map(() => action.payload)
      )
    }),
    withLatestFrom(this.store$.select(selectCollectionsDictionary)),
    withLatestFrom(this.store$.select(selectDocumentsDictionary)),
    flatMap(([[payload, collectionEntities], documentEntities]) => {
      const collection = collectionEntities[payload.collectionId];
      const oldDocument = documentEntities[payload.documentId];

      return [new DocumentsAction.DeleteSuccess({documentId: oldDocument.id}),
        this.createRemoveCollectionsAttributesAction(collection, oldDocument)];
    }),
    catchError((error) => Observable.of(new DocumentsAction.DeleteFailure({error: error})))
  );

  @Effect()
  public deleteConfirm$: Observable<Action> = this.actions$.ofType<DocumentsAction.DeleteConfirm>(DocumentsActionType.DELETE_CONFIRM).pipe(
    map((action: DocumentsAction.DeleteConfirm) => {
      const title = this.i18n({id: 'document.delete.dialog.title', value: 'Delete document'});
      const message = this.i18n({id: 'document.delete.dialog.message', value: 'Do you really want to delete this document?'});

      return new NotificationsAction.Confirm({
        title,
        message,
        action: new DocumentsAction.Delete(action.payload)
      });
    })
  );

  @Effect()
  public deleteFailure$: Observable<Action> = this.actions$.ofType<DocumentsAction.DeleteFailure>(DocumentsActionType.DELETE_FAILURE).pipe(
    tap(action => console.error(action.payload.error)),
    map(() => {
      const message = this.i18n({id: 'document.delete.fail', value: 'Failed to delete record'});
      return new NotificationsAction.Error({message});
    })
  );

  constructor(private actions$: Actions,
              private documentService: DocumentService,
              private i18n: I18n,
              private searchService: SearchService,
              private store$: Store<AppState>) {
  }

  private createAddCollectionAttributesAction(collection: CollectionModel, document: DocumentModel): Action {
    const collectionCopy = {...collection, documentsCount: collection.documentsCount + 1};

    const addedAttributes = Object.keys(document.data);

    collectionCopy.attributes = this.updateAttributesInColection(collectionCopy.attributes, addedAttributes, []);

    return new CollectionsAction.UpdateSuccess({collection: collectionCopy});
  }

  private createUpdateCollectionAttributesAction(collection: CollectionModel, document: DocumentModel, oldDocument: DocumentModel): Action {
    const collectionCopy = {...collection};

    const oldAttributesIds = Object.keys(oldDocument.data);
    const newAttributesIds = Object.keys(document.data);

    const addedAttributesIds = newAttributesIds.filter(attr => !oldAttributesIds.includes(attr));
    const removedAttributesIds = oldAttributesIds.filter(attr => !newAttributesIds.includes(attr));

    collectionCopy.attributes = this.updateAttributesInColection(collectionCopy.attributes, addedAttributesIds, removedAttributesIds);

    return new CollectionsAction.UpdateSuccess({collection: collectionCopy});
  }

  private createRemoveCollectionsAttributesAction(collection: CollectionModel, document: DocumentModel): Action {
    const collectionCopy = {...collection, documentsCount: Math.max(collection.documentsCount - 1, 0)};

    const deletedAttributes = Object.keys(document.data);

    collectionCopy.attributes = this.updateAttributesInColection(collectionCopy.attributes, [], deletedAttributes);

    return new CollectionsAction.UpdateSuccess({collection: collectionCopy});
  }

  private updateAttributesInColection(attributes: AttributeModel[], attributeToInc: string[], attributeToDec: string[]): AttributeModel[] {
    const newAttributes = attributes.map(attribute => {
        if (attributeToDec.includes(attribute.id)) {
          return {...attribute, usageCount: Math.max(attribute.usageCount - 1, 0)};
        } else {
          const attributeIndex = attributeToInc.indexOf(attribute.id);
          if (attributeIndex !== -1) {
            attributeToInc.splice(attributeIndex, 1);
            return {...attribute, usageCount: attribute.usageCount + 1};
          }
        }
        return attribute;
      }
    );

    attributeToInc.map(attributeId => ({id: attributeId, name: extractAttributeName(attributeId), constraints: [], usageCount: 1}))
      .forEach(attribute => newAttributes.push(attribute));

    return newAttributes;
  }

}
