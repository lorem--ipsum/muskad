/*
 * Copyright (c) 2017 Imply Data, Inc. All rights reserved.
 *
 * This software is the confidential and proprietary information
 * of Imply Data, Inc.
 */

const parser = require('./dynamic-doc-parser');

import { BaseImmutable, Property as ImmutableProperty, PropertyType as ImmutablePropertyType } from 'immutable-class';
import { InterfaceApi, InterfaceApiJS, InterfaceApiValue } from '../interface-api/interface-api';

export interface DynamicDocValue {
  componentName: string;
  fileName: string;
  interfaces: InterfaceApiValue[];
}

export interface DynamicDocJS {
  componentName: string;
  fileName: string;
  interfaces: InterfaceApiJS[];
}

export class DynamicDoc extends BaseImmutable<DynamicDocValue, DynamicDocJS> {
  static interfacesFromFileContent(fileContent: string): InterfaceApi[] {
    try {
      return parser.parse(fileContent).map(InterfaceApi.fromJS);
    } catch(e) {
      console.error('Could not parse dynamic doc for file:\n' + fileContent);

      if (e.location) {
        const lines = fileContent.split('\n');
        console.error(lines.slice(e.location.start.line -1 , e.location.end.line + 1).join('\n'));
      }

      throw(e);
    }
  }

  static isDynamicDoc(candidate: any): candidate is DynamicDoc {
    return candidate instanceof DynamicDoc;
  }

  static PROPERTIES: ImmutableProperty[] = [
    { name: 'componentName' },
    { name: 'fileName' },
    { name: 'interfaces', immutableClassArray: InterfaceApi, type: ImmutablePropertyType.ARRAY }
  ];

  static fromJS(parameters: DynamicDocJS): DynamicDoc {
    return new DynamicDoc(BaseImmutable.jsToValue(DynamicDoc.PROPERTIES, parameters));
  }

  public componentName: string;
  public fileName: string;
  public interfaces: InterfaceApi[];

  constructor(parameters: DynamicDocValue) {
    super(parameters);
  }

  isEmpty() {
    return !this.interfaces || this.interfaces.length === 0;
  }

  toHTML(): string {
    const { componentName, interfaces } = this;

    return interfaces.map(p => p.toHTML()).join('');
  }

}
BaseImmutable.finalize(DynamicDoc);
