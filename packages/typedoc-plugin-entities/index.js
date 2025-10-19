import { writeFileSync } from 'fs';
import { join } from 'path';
import { DeclarationReflection, ReflectionKind, Renderer } from 'typedoc';
import { object, record, string, url } from 'zod';

export const Schema = record(
  string(),
  object({
    typedoc: url(),
    github: url(),
  }),
);

const supportedTopLevelKinds = new Set([
  ReflectionKind.Class,
  ReflectionKind.Interface,
  ReflectionKind.Enum,
  ReflectionKind.TypeAlias,
  ReflectionKind.Variable,
  ReflectionKind.Function,
]);

const supportedNestedKindsSet = new Set([
  ReflectionKind.Method,
  ReflectionKind.Property,
  ReflectionKind.GetSignature,
  ReflectionKind.SetSignature,
]);

/** @param {import("typedoc").Application} app */
export function load(app) {
  let baseUrl = app.options.getValue('hostedBaseUrl');
  if (!baseUrl) {
    app.logger.warn(
      "[typedoc-plugin-entities] No hostedBaseUrl set in typedoc config, won't generate entities",
    );
    return;
  }
  baseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

  app.renderer.on(
    Renderer.EVENT_BEGIN,
    (/** @type {import("typedoc").RendererEvent}*/ event) => {
      const entities = {};

      for (const page of event.pages) {
        if (
          page.model instanceof DeclarationReflection
          && supportedTopLevelKinds.has(page.model.kind)
        ) {
          const typedoc = new URL(page.url, baseUrl).href;
          const name = `${page.model.getFullName()}${page.model.kind === ReflectionKind.Function ? '()' : ''}`;
          entities[name] = {
            typedoc: typedoc,
            github: page.model.sources?.[0]?.url,
          };

          if (
            page.model.kind === ReflectionKind.Function
            || page.model.kind === ReflectionKind.Variable
          )
            continue;

          for (const nested of page.model.children ?? []) {
            if (
              !supportedNestedKindsSet.has(nested.kind)
              || !nested.sources?.[0]?.url
            ) {
              continue;
            }

            const nestedName = `${name}.${nested.name}${nested.kind === ReflectionKind.Method ? '()' : ''}`;
            const nestedTypedoc = new URL(`#${nested.name}`, typedoc).href;

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
