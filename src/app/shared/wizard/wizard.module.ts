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

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AttributeComponent} from './rule-editor/rule/components/attribute/attribute.component';
import {PipesModule} from '../pipes/pipes.module';
import {SelectModule} from '../select/select.module';
import {ConstraintTypeIconPipe} from '../pipes/constraint-type-icon.pipe';
import {SomethingComponent} from './rule-editor/rule/components/something/something.component';
import {DataInputModule} from '../data-input/data-input.module';
import {SeparatorComponent} from './rule-editor/rule/components/separator/separator.component';
import {AttributeChangeActionComponent} from './rule-editor/rule/actions/attribute-change-action/attribute-change-action.component';
import {AttributeChangeConditionComponent} from './rule-editor/rule/conditions/attribute-change-condition/attribute-change-condition.component';
import {RuleComponent} from './rule-editor/rule/rule.component';
import {RuleEditorComponent} from './rule-editor/rule-editor.component';

@NgModule({
  declarations: [
    AttributeComponent,
    SomethingComponent,
    SeparatorComponent,
    AttributeChangeActionComponent,
    AttributeChangeConditionComponent,
    RuleComponent,
    RuleEditorComponent,
  ],
  imports: [CommonModule, SelectModule, PipesModule, DataInputModule],
  providers: [ConstraintTypeIconPipe],
})
export class WizardModule {}
