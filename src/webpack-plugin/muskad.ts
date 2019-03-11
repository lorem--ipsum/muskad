import * as fs from 'fs-extra';
import * as path from 'path';
import { compiler, compilation } from 'webpack';
import { DynamicDoc } from '../index';

class MuskadPlugin {
  private context: string;

  constructor(options: any) {
    if (options && options.context) this.context = options.context;
  }

  apply(compilr: compiler.Compiler) {
    compilr.hooks.emit.tapAsync('MuskadPlugin', (compilation: compilation.Compilation, callback: any) => {
      const promises = compilation.modules.map(async m => {
        const filePath = String(m.resource);
        const ext = path.extname(filePath);

        if (ext !== '.tsx' && ext !== '.ts') return [];

        const content = await fs.readFile(filePath);

        const interfaces = DynamicDoc.interfacesFromFileContent(String(content));

        if (!interfaces || !interfaces.length) return [];

        let fileName = path.basename(filePath, ext) + ext;
        if (this.context) fileName = path.relative(this.context, filePath);

        return interfaces.map(i => i.change('fileName', fileName));
      });

      Promise.all(promises)
        .then(result => {
          const content = JSON.stringify(result.reduce((a, b) => a.concat(b), []));

          compilation.assets['muskad-doc.json'] = {
            source: function() {
              return content;
            },
            size: function() {
              return content.length;
            }
          };
        })
        .then(() => callback())
    });
  }
}

module.exports = MuskadPlugin;
