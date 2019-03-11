/*
 * Copyright (c) 2017 Imply Data, Inc. All rights reserved.
 *
 * This software is the confidential and proprietary information
 * of Imply Data, Inc.
 */

import { BaseImmutable, Property as ImmutableProperty, PropertyType as ImmutablePropertyType } from 'immutable-class';
import { Property, PropertyJS, PropertyValue } from '../property/property';

export interface InterfaceApiValue {
  label: string;
  name: string;
  properties: PropertyValue[];
  fileName?: string;
}

export interface InterfaceApiJS {
  label: string;
  name: string;
  properties: PropertyJS[];
  fileName?: string;
}

export class InterfaceApi extends BaseImmutable<InterfaceApiValue, InterfaceApiJS> {

  static isInterfaceApi(candidate: any): candidate is InterfaceApi {
    return candidate instanceof InterfaceApi;
  }

  static PROPERTIES: ImmutableProperty[] = [
    { name: 'label' },
    { name: 'name' },
    { name: 'fileName', defaultValue: null },
    { name: 'properties', immutableClassArray: Property, type: ImmutablePropertyType.ARRAY },
  ];

  static fromJS(parameters: InterfaceApiJS): InterfaceApi {
    return new InterfaceApi(BaseImmutable.jsToValue(InterfaceApi.PROPERTIES, parameters));
  }

  public label: string;
  public fileName: string;
  public name: string;
  public properties: Property[];

  constructor(parameters: InterfaceApiValue) {
    super(parameters);
  }

  toHTML(): string {
    const { label, properties } = this;

    return `
      <div class="class">
        <h2>${label}</h2>
        <div class="properties">
          ${properties.map(p => p.toHTML()).join('')}
        </div>
      </div>
    `;
  }

}
BaseImmutable.finalize(InterfaceApi);
