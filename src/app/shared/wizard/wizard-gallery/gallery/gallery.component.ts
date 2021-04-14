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
import {Component} from '@angular/core';
import {WizardService} from '../../wizard.service';

@Component({
  selector: 'gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent {
  categories = [
    {
      name: 'Notifications',
      rules: [
        'When a <b> number </b> is <b> greater then </b> a <b> value,</b> change <b> attribute </b> to <b> something.</b>',
        'When <b> attribute </b> changes to <b> something,</b> change <b> attribute </b> to <b> something </b>, and <b> another attribute </b> to <b> something.</b>',
        'When <b> an attribute </b> changes to <b> something,</b> move this record to <b> collection.</b>',
        'When <b> an attribute </b> changes to <b> something,</b> archive the record.',
        'When <b> attribute </b> changes to <b> something,</b> change <b> another attribute </b> to <b> something.</b>',
        'When a <b> number </b> is <b> greater then </b> a <b> value,</b> change <b> attribute </b> to <b> something.</b>',
        'When <b> attribute </b> changes to <b> something,</b> change <b> attribute </b> to <b> something </b>, and <b> another attribute </b> to <b> something.</b>',
        'When <b> an attribute </b> changes to <b> something,</b> move this record to <b> collection.</b>',
        'When <b> an attribute </b> changes to <b> something,</b> archive the record.',
        'When <b> attribute </b> changes to <b> something,</b> change <b> another attribute </b> to <b> something.</b>',
      ],
    },
    {
      name: 'Value Change',
      rules: [
        'When <b> attribute </b> changes to <b> something,</b> set <b> date </b> to current date plus <b> some days.</b>',
        'When <b> attribute </b> changes to <b> something,</b> set <b> date to current date.',
        'When <b> date </b> arrives and <b> an attribute </b> is <b> something,</b> change it to <b> something else.</b>',
        'When <b> attribute </b> changes to <b> something,</b> push <b> due date </b> by <b> some days.</b>',
        'When <b> attribute </b> changes to <b> something,</b> set <b> date </b> to current date plus <b> some days.</b>',
        'When <b> attribute </b> changes to <b> something,</b> set <b> date to current date.',
        'When <b> date </b> arrives and <b> an attribute </b> is <b> something,</b> change it to <b> something else.</b>',
        'When <b> attribute </b> changes to <b> something,</b> push <b> due date </b> by <b> some days.</b>',
      ],
    },
    {
      name: 'Item Creation',
      rules: [
        'When <b> an attribute </b> changes to <b> something,</b> assign <b> someone </b> as <b> assignee.</b>',
        'When a new record is created <b>,</b> change its <b> attribute </b> to <b> something.</b>',
      ],
    },
  ];

  constructor(private wizardService: WizardService) {}

  displayEditor(rule: string): void {
    this.wizardService.changeRule(rule);
    this.wizardService.changeEditingState(true);
  }
}
