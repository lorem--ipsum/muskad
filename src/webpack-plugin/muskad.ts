import * as fs from 'fs-extra';
import * as path from 'path';
import { compiler, compilation } from 'webpack'
import { DynamicDoc } from '../index';

class MuskadPlugin {
  apply(compilr: compiler.Compiler) {
    compilr.hooks.emit.tapAsync('MuskadPlugin', (compilation: compilation.Compilation, callback: any) => {
      const promises = compilation.modules.map(async m => {
        const filePath = String(m.resource);
        const ext = path.extname(filePath);

        if (ext !== '.tsx' && ext !== '.ts') return null;

        const content = await fs.readFile(filePath);

        return DynamicDoc.fromJS({
          componentName: path.basename(filePath, ext),
          fileName: path.basename(filePath, ext),
          interfaces: DynamicDoc.interfacesFromFileContent(String(content))
        });
      }).filter(Boolean);

      Promise.all(promises)
        .then(result => {
          const m: any = {};
          result.forEach(r => m[r.componentName] = r)

          const content = JSON.stringify(m);

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
