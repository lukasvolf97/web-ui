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

export class RuleBuilderUtil {
  private static readonly LUMEER_VAR: string = 'lumeer';
  private static readonly OLD_DOCUMENT_VAR: string = 'oldRecord';
  private static readonly NEW_DOCUMENT_VAR: string = 'newRecord';
  private variables: Array<string> = [
    RuleBuilderUtil.LUMEER_VAR,
    RuleBuilderUtil.OLD_DOCUMENT_VAR,
    RuleBuilderUtil.NEW_DOCUMENT_VAR,
  ];
  private code: Array<string> = [];

  constructor() {}

  public generateCode() {
    let result: string = 'var ';
    this.variables.forEach((variable, index) => {
      result += variable + (this.variables[index + 1] ? ',' : '');
    });
    result += ';\n';
    result += `${RuleBuilderUtil.LUMEER_VAR} = Polyglot.import('lumeer')\n`;
    this.code.forEach(expression => {
      result += expression;
    });
    return result;
  }

  public build() {
    let result = '';
    this.code.forEach(expression => {
      result += expression;
    });
    return result;
  }

  public ifEachConditionIsValid(...conditions: Array<string>): RuleBuilderUtil {
    this.code.push('if (');
    conditions.forEach((condition, index) => {
      this.code.push(`(${condition})${index < conditions.length - 1 ? ' && ' : ''}`);
    });
    this.code.push(')\n');
    return this;
  }

  public do(...commands: Array<string>): RuleBuilderUtil {
    this.code.push('{\n');
    commands.forEach(command => {
      this.code.push(`\t${command}\n`);
    });
    this.code.push('}\n');
    return this;
  }

  public equalsTo(value: string): RuleBuilderUtil {
    this.code.push(` == '${value}'`);
    return this;
  }

  public oldDocumentAttribute(attribute: string): RuleBuilderUtil {
    this.code.push(this.getDocumentAttribute(RuleBuilderUtil.OLD_DOCUMENT_VAR, attribute));
    return this;
  }

  public newDocumentAttribute(attribute: string): RuleBuilderUtil {
    this.code.push(this.getDocumentAttribute(RuleBuilderUtil.NEW_DOCUMENT_VAR, attribute));
    return this;
  }

  public setValueForOldDocumentAttribute(attribute: string, value: any): RuleBuilderUtil {
    this.code.push(this.setDocumentAttribute(RuleBuilderUtil.OLD_DOCUMENT_VAR, attribute, value));
    return this;
  }

  public setValueForNewDocumentAttribute(attribute: string, value: any): RuleBuilderUtil {
    this.code.push(this.setDocumentAttribute(RuleBuilderUtil.NEW_DOCUMENT_VAR, attribute, value));
    return this;
  }

  private getDocumentAttribute(record: string, attribute: string): string {
    return `${RuleBuilderUtil.LUMEER_VAR}.getDocumentAttribute(${record},'${attribute}')`;
  }

  private setDocumentAttribute(record: string, attribute: string, value: any): string {
    return `${RuleBuilderUtil.LUMEER_VAR}.setDocumentAttribute(${record},'${attribute}','${value}');`;
  }
}
