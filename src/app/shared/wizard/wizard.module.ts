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

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {WizardComponent} from './wizard.component';
import {SearchBarComponent} from './wizard-gallery/search-bar/search-bar.component';
import {CategoriesComponent} from './wizard-gallery/categories/categories.component';
import {GalleryComponent} from './wizard-gallery/gallery/gallery.component';
import {PreviewComponent} from './wizard-gallery/gallery/preview/preview.component';
import {WizardGalleryComponent} from './wizard-gallery/wizard-gallery.component';
import {WizardEditorComponent} from './wizard-editor/wizard-editor.component';
import {WizardService} from './wizard.service';
import {AttributeComponent} from './wizard-editor/attribute/attribute.component';
import {PipesModule} from '../pipes/pipes.module';
import {SelectModule} from '../select/select.module';
import {ConstraintTypeIconPipe} from '../pipes/constraint-type-icon.pipe';
import {SomethingComponent} from './wizard-editor/something/something.component';
import {DataInputModule} from '../data-input/data-input.module';

@NgModule({
  declarations: [
    WizardComponent,
    SearchBarComponent,
    CategoriesComponent,
    GalleryComponent,
    PreviewComponent,
    WizardGalleryComponent,
    WizardEditorComponent,
    AttributeComponent,
    SomethingComponent,
  ],
  exports: [WizardComponent],
  imports: [CommonModule, SelectModule, PipesModule, DataInputModule],
  providers: [WizardService, ConstraintTypeIconPipe],
})
export class WizardModule {}
