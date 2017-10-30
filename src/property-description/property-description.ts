/*
 * Copyright (c) 2017 Imply Data, Inc. All rights reserved.
 *
 * This software is the confidential and proprietary information
 * of Imply Data, Inc.
 */

import { BaseImmutable, Property, PropertyType } from 'immutable-class';
import { PropertyUsage, PropertyUsageJS, PropertyUsageValue } from '../property-usage/property-usage';

export interface PropertyDescriptionValue {
  content?: string;
  examples?: PropertyUsageValue[];
}

export interface PropertyDescriptionJS {
  content?: string;
  examples?: PropertyUsageJS[];
}

export class PropertyDescription extends BaseImmutable<PropertyDescriptionValue, PropertyDescriptionJS> {

  static isPropertyDescription(candidate: any): candidate is PropertyDescription {
    return candidate instanceof PropertyDescription;
  }

  static PROPERTIES: Property[] = [
    { name: 'content', defaultValue: '<i> no description </i>' },
    { name: 'examples', immutableClassArray: PropertyUsage, type: PropertyType.ARRAY, emptyArrayIsOk: true }
  ];

  static fromJS(parameters: PropertyDescriptionJS): PropertyDescription {
    return new PropertyDescription(BaseImmutable.jsToValue(PropertyDescription.PROPERTIES, parameters));
  }

  public content: string;
  public examples: PropertyUsage[];

  constructor(parameters: PropertyDescriptionValue) {
    super(parameters);
  }

  public getContent: () => string;
  public getExamples: () => PropertyUsage[];

}
BaseImmutable.finalize(PropertyDescription);
