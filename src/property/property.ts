/*
 * Copyright (c) 2017 Imply Data, Inc. All rights reserved.
 *
 * This software is the confidential and proprietary information
 * of Imply Data, Inc.
 */

import { BaseImmutable, Property as ImmutableProperty, PropertyType as ImmutablePropertyType } from 'immutable-class';
import { PropertyDescription, PropertyDescriptionJS, PropertyDescriptionValue } from '../property-description/property-description';

export interface PropertyValue {
  label: string;
  type: string;
  description: PropertyDescriptionValue;
  optional?: boolean;
}

export interface PropertyJS {
  label: string;
  type: string;
  description: PropertyDescriptionJS;
  optional?: boolean;
}

export class Property extends BaseImmutable<PropertyValue, PropertyJS> {

  static isProperty(candidate: any): candidate is Property {
    return candidate instanceof Property;
  }

  static PROPERTIES: ImmutableProperty[] = [
    { name: 'label', defaultValue: null},
    { name: 'type', defaultValue: null},
    { name: 'description', immutableClass: PropertyDescription, defaultValue: null},
    { name: 'optional', defaultValue: false},
  ];

  static fromJS(parameters: PropertyJS): Property {
    if (!parameters.description) parameters.description = {};
    return new Property(BaseImmutable.jsToValue(Property.PROPERTIES, parameters));
  }

  public label: string;
  public type: string;
  public description: PropertyDescription;
  public optional?: boolean;

  constructor(parameters: PropertyValue) {
    super(parameters);
  }

  getExamplesHTML(): string {
    const examples = this.description.getExamples();

    if (!examples || !examples.length) return '';

    return `
      <div class="examples">
        <h3>Example${examples.length > 1 ? 's' : ''}</h3>
        ${examples.map(e => e.toHTML()).join('')}
      </div>
    `;
  }

  toHTML(): string {
    const {label, type, description, optional} = this;

    return `
      <div class="property">
        <div class="label">
          <span class="name">${label}</span>
          <span class="type">${type}</span>
          ${optional ? '<span class="optional">optional</span>' : ''}
        </div>
        <div class="description">${description.getContent()}</div>
        ${this.getExamplesHTML()}
      </div>
    `;
  }

}
BaseImmutable.finalize(Property);
