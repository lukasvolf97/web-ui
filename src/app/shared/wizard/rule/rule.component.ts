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
  AfterViewInit,
  ComponentFactoryResolver,
  Injector,
  Input,
  Output,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {Component, ChangeDetectionStrategy, ComponentRef} from '@angular/core';
import {ConstraintData} from '@lumeer/data-filters';
import {combineLatest, Subject} from 'rxjs';
import {Collection} from 'src/app/core/store/collections/collection';
import {Action} from '../actions/action';
import {RuleBuilderUtil} from '../rule-builder-util';
import {SeparatorComponent} from '../components/separator/separator.component';
import {Condition} from '../conditions/condition';

@Component({
  selector: 'rule',
  templateUrl: './rule.component.html',
  styleUrls: ['./rule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RuleComponent implements AfterViewInit {
  public static readonly CONDITION_SEPARATOR = ',';
  public static readonly ACTION_SEPARATOR = '.';
  public static readonly CHAIN_SEPARATOR = 'and';

  @Input()
  public collections: Array<Collection>;

  @Input()
  public constraintData: ConstraintData;

  @Input()
  public conditions: Array<Type<Condition>>;

  @Input()
  public actions: Array<Type<Action>>;

  @Output()
  public code: Subject<string> = new Subject();

  @ViewChild('host', {read: ViewContainerRef})
  public theHost: ViewContainerRef;

  private rulesParts: Array<ComponentRef<Condition | Action | SeparatorComponent>> = [];
  private conditionsCode$: Subject<{[id: number]: string}> = new Subject();
  private actionsCode$: Subject<{[id: number]: string}> = new Subject();
  private conditionsCode: {[id: number]: string} = {};
  private actionsCode: {[id: number]: string} = {};

  constructor(private resolver: ComponentFactoryResolver, private injector: Injector) {}

  ngAfterViewInit(): void {
    this.theHost.detach();
    this.buildRulesParts();
    this.rulesParts.forEach(part => {
      this.theHost.insert(part.hostView);
    });
    this.generateCode();
  }

  private generateCode(): void {
    combineLatest([this.conditionsCode$, this.actionsCode$]).subscribe(val => {
      const conditionsCode: string[] = Object.keys(val[0]).map(key => val[0][key]);
      const actionsCode: string[] = Object.keys(val[1]).map(key => val[1][key]);
      this.code.next(
        new RuleBuilderUtil()
          .ifEachConditionIsValid(...conditionsCode)
          .do(...actionsCode)
          .generateCode()
      );
    });
  }

  private buildRulesParts(): void {
    this.conditions.forEach((condition, index) => {
      this.rulesParts.push(this.buildPart(index, condition, this.conditionsCode, this.conditionsCode$));
      this.rulesParts.push(this.buildSeparator(RuleComponent.CONDITION_SEPARATOR, !this.conditions[index + 1]));
    });
    this.actions.forEach((action, index) => {
      this.rulesParts.push(this.buildPart(index, action, this.actionsCode, this.actionsCode$));
      this.rulesParts.push(this.buildSeparator(RuleComponent.ACTION_SEPARATOR, !this.actions[index + 1]));
    });
  }

  private buildPart(
    id: number,
    part: Type<Condition> | Type<Action>,
    codeDict: {[id: number]: string},
    codeDict$: Subject<{[id: number]: string}>
  ): ComponentRef<Condition> {
    const factory = this.resolver.resolveComponentFactory(part);
    const componentRef = factory.create(this.injector);
    componentRef.instance.collections = this.collections;
    componentRef.instance.constraintData = this.constraintData;
    componentRef.instance.code.subscribe(code => {
      codeDict[id] = code;
      codeDict$.next(codeDict);
    });
    componentRef.changeDetectorRef.detectChanges();
    return componentRef;
  }

  private buildSeparator(separator: string, isLastOne: boolean): ComponentRef<SeparatorComponent> {
    const factory = this.resolver.resolveComponentFactory(SeparatorComponent);
    const componentRef = factory.create(this.injector);
    componentRef.instance.separator = isLastOne ? separator : RuleComponent.CHAIN_SEPARATOR;
    componentRef.changeDetectorRef.detectChanges();
    return componentRef;
  }
}
