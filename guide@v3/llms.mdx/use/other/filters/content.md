# Filters (https://nyx-discord.github.io/nyx/guide@v3/use/other/filters)

Filters are objects or callbacks that can restrict the execution of a given component.

They receive all the information about the execution (context, arguments, metadata), and return a boolean indicating whether the execution should proceed (`true`) or strictly stop (`false`).

## Wrapping/Merging Filters [#wrappingmerging-filters]

The framework has some utility filters that wrap or merge others, allowing you to create complex filters by combining simpler ones.

<Callout>These wrappers work "synchronously", meaning that it'll wait for each filter, in the order they were passed, before checking whether to proceed to the next.</Callout>

### AndFilter [#andfilter]

Combines multiple filters and only allows the execution if **all** filters return `true`.

```ts
new AndFilter(filter1, filter2, filter3)
```

### OrFilter [#orfilter]

Combines multiple filters and allows the execution if **at least one** filter returns `true`.

```ts
new OrFilter(filter1, filter2)
```

### NotFilter [#notfilter]

Inverts the result of a single filter, allowing the execution if the filter returns `false`.

```ts
new NotFilter(filter)
```
