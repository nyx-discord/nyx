import { writeFileSync } from 'fs';
import { join } from 'path';
import { DeclarationReflection, ReflectionKind, Renderer } from 'typedoc';
import { Schema } from './schema.js';

export { Schema };

const supportedTopLevelKinds = new Set([
  ReflectionKind.Class,
  ReflectionKind.Interface,
  ReflectionKind.Enum,
  ReflectionKind.TypeAlias,
  ReflectionKind.Variable,
  ReflectionKind.Function,
]);

const supportedNestedKinds = new Set([
  ReflectionKind.Method,
  ReflectionKind.Property,
  ReflectionKind.GetSignature,
  ReflectionKind.SetSignature,
  ReflectionKind.EnumMember,
]);

/** @param {import("typedoc").Application} app */
export function load(app) {
  app.renderer.on(
    Renderer.EVENT_BEGIN,
    (/** @type {import("typedoc").RendererEvent}*/ event) => {
      const entities = {};

      for (const page of event.pages) {
        if (
          page.model instanceof DeclarationReflection
          && supportedTopLevelKinds.has(page.model.kind)
        ) {
          const typedoc = page.url;
          const name = `${page.model.getFullName()}${page.model.kind === ReflectionKind.Function ? '()' : ''}`;
          entities[name] = {
            typedoc,
            github: page.model.sources?.[0]?.url,
          };

          if (
            page.model.kind === ReflectionKind.Function
            || page.model.kind === ReflectionKind.Variable
          )
            continue;

          for (const nested of page.model.children ?? []) {
            if (
              !supportedNestedKinds.has(nested.kind)
              || !nested.sources?.[0]?.url
            ) {
              continue;
            }

            const nestedName = `${name}.${nested.name}${nested.kind === ReflectionKind.Method ? '()' : ''}`;
            const nestedTypedoc = `${typedoc}#${nested.name}`;

            entities[nestedName] = {
              typedoc: nestedTypedoc,
              github: nested.sources?.[0]?.url,
            };
          }
        }
      }

      Schema.parse(entities);

      writeFileSync(
        join(event.outputDirectory, '/entities.json'),
        JSON.stringify(entities),
        'utf-8',
      );
    },
  );
}
