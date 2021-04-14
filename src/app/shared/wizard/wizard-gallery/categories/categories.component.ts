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
import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostListener,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent implements AfterViewInit, OnDestroy {
  rightArrowVisible = false;
  leftArrowVisible = false;
  private observer: IntersectionObserver;

  categories: Array<string> = ['Notifications', 'Value Change', 'Item Creation'];

  constructor(private cd: ChangeDetectorRef) {}
  ngAfterViewInit(): void {
    this.readjust();

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        if (entry.intersectionRatio > 0) {
          document.getElementById(id + '-link').classList.add('active');
        } else {
          document.getElementById(id + '-link').classList.remove('active');
        }
      });
    });

    // Track all sections that have an `id` applied
    document.querySelectorAll('section[id]').forEach(section => {
      this.observer.observe(section);
    });
  }

  scroll(categoryId: string) {
    const el = document.getElementById(categoryId);
    el.scrollIntoView({behavior: 'smooth'});
  }

  moveCategoriesLeft() {
    document.getElementById('list').style.left = '0';
    this.readjust();
  }

  moveCategoriesRight() {
    const left: number = document.getElementById('list').getBoundingClientRect().left;
    //console.log(left, this.getHiddenCategoryListWidth())
    document.getElementById('list').style.left = left + this.getHiddenCategoryListWidth() + 'px';
    this.readjust();
  }

  private getCategoryListWidth(): number {
    const categories = document.getElementsByClassName('nav-item');
    let result = 0;
    for (let index = 0; index < categories.length; index++) {
      result += categories[index].clientWidth;
    }
    return result;
  }

  private getHiddenCategoryListWidth(): number {
    return (
      document.getElementById('wrapper').getBoundingClientRect().width -
      this.getCategoryListWidth() -
      document.getElementById('list').getBoundingClientRect().left -
      40
    );
  }

  @HostListener('window:resize', ['$event'])
  private readjust(): void {
    if (document.getElementById('wrapper').getBoundingClientRect().width < this.getCategoryListWidth()) {
      this.rightArrowVisible = true;
    } else {
      this.rightArrowVisible = false;
    }

    if (document.getElementById('list').getBoundingClientRect().left < 0) {
      this.leftArrowVisible = true;
    } else {
      this.leftArrowVisible = false;
    }
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }
}
