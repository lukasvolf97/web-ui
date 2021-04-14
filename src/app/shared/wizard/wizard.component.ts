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
import {Observable} from 'rxjs';
import {Collection} from 'src/app/core/store/collections/collection';
import {LinkType} from 'src/app/core/store/link-types/link.type';
import {View} from 'src/app/core/store/views/view';
import {RuleVariable} from '../blockly/rule-variable-type';
import {WizardService} from './wizard.service';

@Component({
  selector: 'wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardComponent implements OnInit {
  @Input()
  public collections: Collection[] = [];

  @Input()
  public linkTypes: LinkType[] = [];

  @Input()
  public views: View[] = [];

  @Input()
  public variables: RuleVariable[] = [];

  public isEditing: boolean = false;

  constructor(private wizardService: WizardService) {}

  ngOnInit(): void {
    this.wizardService.isEditing$.subscribe(state => {
      this.isEditing = state;
    });
  }
}
