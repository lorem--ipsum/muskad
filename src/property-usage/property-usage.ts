/*
 * Copyright (c) 2017 Imply Data, Inc. All rights reserved.
 *
 * This software is the confidential and proprietary information
 * of Imply Data, Inc.
 */

import { BaseImmutable, Property, PropertyType } from 'immutable-class';

export interface PropertyUsageValue {
  value: string;
  label: string;
}

export interface PropertyUsageJS {
  value: string;
  label: string;
}

export class PropertyUsage extends BaseImmutable<PropertyUsageValue, PropertyUsageJS> {

  static isPropertyUsage(candidate: any): candidate is PropertyUsage {
    return candidate instanceof PropertyUsage;
  }

  static PROPERTIES: Property[] = [
    { name: 'value' },
    { name: 'label' },
  ];

  static fromJS(parameters: PropertyUsageJS): PropertyUsage {
    let { value } = parameters;

    if (value.indexOf('\n') > 1) {
      let lines = value.split('\n');
      let firstLineIndent = lines[0].match(/^\s+/);

      if (firstLineIndent) {
        const indentation = firstLineIndent[0].length;
        const regExp = new RegExp('^\\s{' + indentation + '}');

        parameters.value = lines
          .map(l => l.replace(regExp, ''))
          .join('\n')
          ;
      }
    }

    return new PropertyUsage(BaseImmutable.jsToValue(PropertyUsage.PROPERTIES, parameters));
  }

  public value: string;
  public label: string;

  constructor(parameters: PropertyUsageValue) {
    super(parameters);
  }

  public getValue: () => string;
  public getLabel: () => string;

  toHTML(): string {
    const { label, value } = this;

    return `<div class="example ${value.indexOf('\n') > 1 ? 'block' : ''}">
      <div class="value">${value}</div>
      <div class="label">${label}</div>
    </div>`;
  }

}
BaseImmutable.finalize(PropertyUsage);
