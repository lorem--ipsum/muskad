/*
 * Copyright (c) 2017 Imply Data, Inc. All rights reserved.
 *
 * This software is the confidential and proprietary information
 * of Imply Data, Inc.
 */

import * as path from 'path';
import * as fs from 'fs-extra';

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

function interfacesFromFileContent(fileContent: string, filePath: string): InterfaceApi[] {
  try {
    return parser.parse(fileContent).map(InterfaceApi.fromJS);
  } catch(e) {
    console.error('Could not parse dynamic doc for file ' + filePath);

    if (e.location) {
      const lines = fileContent.split('\n');
      console.error(lines.slice(e.location.start.line -1 , e.location.end.line + 1).join('\n'));
    }

    throw(e);
  }
}

export class DynamicDoc extends BaseImmutable<DynamicDocValue, DynamicDocJS> {

  static async fromFile(filePath: string) {
    const componentName = path.dirname(filePath);
    const fileName = path.basename(filePath, '.tsx');

    const fileContent = await fs.readFile(filePath);

    return new DynamicDoc({
      componentName,
      fileName,
      interfaces: interfacesFromFileContent(String(fileContent), filePath)
    });
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
