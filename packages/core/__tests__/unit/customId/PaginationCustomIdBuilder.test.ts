import { PaginationCustomIdBuilder } from '../../../src';
import { runBaseTests } from './helpers/BaseCustomIdBuilderTests.test';
import { runMetadatableTests } from './helpers/MetadatableTests.test';

const namespace = 'TEST';
const objectId = 'myObject';
const separator = '-';
const metadataSeparator = '|';

runBaseTests((options) => {
  // Charcode magic to make sure the metadata separator is not the same as the separator
  const testDataSeparator = String.fromCharCode(
    options.separator.charCodeAt(0) + 1,
  );

  return new PaginationCustomIdBuilder({
    ...options,
    namespace,
    objectId,
    metadataSeparator: testDataSeparator,
  });
});

runMetadatableTests((options) => {
  return new PaginationCustomIdBuilder(options);
});

describe('WHEN instantiating with a page', () => {
  const page = Math.ceil(Math.random() * 100);
  let builder: PaginationCustomIdBuilder;

  beforeEach(() => {
    builder = new PaginationCustomIdBuilder({
      namespace,
      objectId,
      separator,
      metadataSeparator,
      page,
    });
  });

  test('THEN the page should be set', () => {
    expect(builder.getPage()).toEqual(page);
  });
});

describe('WHEN instantiating without a page', () => {
  let builder: PaginationCustomIdBuilder;

  beforeEach(() => {
    builder = new PaginationCustomIdBuilder({
      namespace,
      objectId,
      separator,
      metadataSeparator,
    });
  });

  test('THEN the page should be null', () => {
    expect(builder.getPage()).toBeNull();
  });
});

describe('WHEN instantiating with a valid string with a page with .fromPaginatedString()', () => {
  let builder: PaginationCustomIdBuilder | null;

  const page = Math.ceil(Math.random() * 100);
  const tokens = ['abc', 'def', 'ghi'] as const;
  const tokenString = tokens.join(separator);

  const string = `${namespace}${metadataSeparator}${objectId}${metadataSeparator}${page}${separator}${tokenString}`;

  beforeEach(() => {
    builder = PaginationCustomIdBuilder.fromPaginatedString(
      string,
      separator,
      metadataSeparator,
    );
  });

  test('THEN the builder should be created', () => {
    expect(builder).not.toBeNull();
  });

  test('THEN the builder should be an instance of PaginationCustomIdBuilder', () => {
    expect(builder).toBeInstanceOf(PaginationCustomIdBuilder);
  });

  test('THEN the page should be set', () => {
    const setBuilder = builder as PaginationCustomIdBuilder;
    expect(setBuilder.getPage()).toEqual(page);
  });

  test('THEN the namespace should be set', () => {
    const setBuilder = builder as PaginationCustomIdBuilder;
    expect(setBuilder.getNamespace()).toEqual(namespace);
  });

  test('THEN the objectId should be set', () => {
    const setBuilder = builder as PaginationCustomIdBuilder;
    expect(setBuilder.getObjectId()).toEqual(objectId);
  });

  test('THEN the separator should be set', () => {
    const setBuilder = builder as PaginationCustomIdBuilder;
    expect(setBuilder.getSeparator()).toEqual(separator);
  });

  test('THEN the metadataSeparator should be set', () => {
    const setBuilder = builder as PaginationCustomIdBuilder;
    expect(setBuilder.getMetadataSeparator()).toEqual(metadataSeparator);
  });

  test('THEN the tokens should be set', () => {
    const setBuilder = builder as PaginationCustomIdBuilder;
    expect(setBuilder.getTokens()).toEqual(tokens);
  });
});

describe('WHEN instantiating with a valid string with a non number page with .fromPaginatedString()', () => {
  let builder: PaginationCustomIdBuilder | null;

  const page = 'ABC';
  const tokens = ['abc', 'def', 'ghi'] as const;
  const tokenString = tokens.join(separator);

  const string = `${namespace}${metadataSeparator}${objectId}${metadataSeparator}${page}${separator}${tokenString}`;

  beforeEach(() => {
    builder = PaginationCustomIdBuilder.fromPaginatedString(
      string,
      separator,
      metadataSeparator,
    );
  });

  test('THEN the builder should be created', () => {
    expect(builder).not.toBeNull();
  });

  test('THEN the builder should be an instance of PaginationCustomIdBuilder', () => {
    expect(builder).toBeInstanceOf(PaginationCustomIdBuilder);
  });

  test('THEN the page should not be set', () => {
    const setBuilder = builder as PaginationCustomIdBuilder;
    expect(setBuilder.getPage()).toBeNull();
  });

  test('THEN the namespace should be set', () => {
    const setBuilder = builder as PaginationCustomIdBuilder;
    expect(setBuilder.getNamespace()).toEqual(namespace);
  });

  test('THEN the objectId should be set', () => {
    const setBuilder = builder as PaginationCustomIdBuilder;
    expect(setBuilder.getObjectId()).toEqual(objectId);
  });

  test('THEN the separator should be set', () => {
    const setBuilder = builder as PaginationCustomIdBuilder;
    expect(setBuilder.getSeparator()).toEqual(separator);
  });

  test('THEN the metadataSeparator should be set', () => {
    const setBuilder = builder as PaginationCustomIdBuilder;
    expect(setBuilder.getMetadataSeparator()).toEqual(metadataSeparator);
  });

  test('THEN the tokens should be set', () => {
    const setBuilder = builder as PaginationCustomIdBuilder;
    expect(setBuilder.getTokens()).toEqual(tokens);
  });
});

describe('WHEN instantiating with an empty string and empty separator with .fromPaginatedString()', () => {
  let builder: PaginationCustomIdBuilder | null;

  beforeEach(() => {
    builder = PaginationCustomIdBuilder.fromPaginatedString('', '', '');
  });

  test('THEN it should return null', () => {
    expect(builder).toBeNull();
  });
});

describe('WHEN using #clone()', () => {
  let builder: PaginationCustomIdBuilder;
  const page = Math.ceil(Math.random() * 100);

  beforeEach(() => {
    builder = new PaginationCustomIdBuilder({
      namespace,
      objectId,
      separator,
      metadataSeparator,
    });
  });

  test('THEN the clone should have the same page', () => {
    expect(builder.clone().getPage()).toEqual(null);
    builder.setPage(page);
    expect(builder.clone().getPage()).toEqual(page);
  });
});

describe('WHEN using #setPage()', () => {
  let builder: PaginationCustomIdBuilder;
  const page = Math.ceil(Math.random() * 100);

  beforeEach(() => {
    builder = new PaginationCustomIdBuilder({
      namespace,
      objectId,
      separator,
      metadataSeparator,
    });
  });

  test('THEN the page should be set', () => {
    expect(builder.setPage(page).getPage()).toEqual(page);
  });

  test('THEN the page should be replaced if one was set', () => {
    expect(
      builder
        .setPage(page)
        .setPage(page + 1)
        .getPage(),
    ).toEqual(page + 1);
  });
});

describe('WHEN using #cloneSetPage()', () => {
  let builder: PaginationCustomIdBuilder;
  const page = Math.ceil(Math.random() * 100);

  beforeEach(() => {
    builder = new PaginationCustomIdBuilder({
      namespace,
      objectId,
      separator,
      metadataSeparator,
    });
  });

  test('THEN the clone should have the new page', () => {
    expect(builder.cloneSetPage(page).getPage()).toEqual(page);
  });

  test('THEN the original should not have changed', () => {
    expect(builder.getPage()).toEqual(null);
  });
});

describe('WHEN using #setToNextPage()', () => {
  let builder: PaginationCustomIdBuilder;
  const page = Math.ceil(Math.random() * 100);

  beforeEach(() => {
    builder = new PaginationCustomIdBuilder({
      namespace,
      objectId,
      separator,
      metadataSeparator,
    });
  });

  test("THEN if the page wasn't set, it should be null", () => {
    expect(builder.setToNextPage().getPage()).toEqual(null);
  });

  test('THEN if the page was set, it should be the next page', () => {
    builder.setPage(page);
    expect(builder.setToNextPage().getPage()).toEqual(page + 1);
  });
});

describe('WHEN using #setToPreviousPage()', () => {
  let builder: PaginationCustomIdBuilder;
  const page = Math.ceil(Math.random() * 100);

  beforeEach(() => {
    builder = new PaginationCustomIdBuilder({
      namespace,
      objectId,
      separator,
      metadataSeparator,
    });
  });

  test("THEN if the page wasn't set, it should be null", () => {
    expect(builder.setToPreviousPage().getPage()).toEqual(null);
  });

  test('THEN if the page was set, it should be the previous page', () => {
    builder.setPage(page);
    expect(builder.setToPreviousPage().getPage()).toEqual(page - 1);
  });
});

describe('WHEN using #cloneSetNextPage()', () => {
  let builder: PaginationCustomIdBuilder;
  const page = Math.ceil(Math.random() * 100);

  beforeEach(() => {
    builder = new PaginationCustomIdBuilder({
      namespace,
      objectId,
      separator,
      metadataSeparator,
    });
  });

  test("THEN if the page wasn't set, it should be null", () => {
    expect(builder.cloneSetNextPage().getPage()).toEqual(null);
  });

  test('THEN if the page was set, it should be the next page', () => {
    builder.setPage(page);
    expect(builder.cloneSetNextPage().getPage()).toEqual(page + 1);
  });

  test('THEN the original should not have changed', () => {
    expect(builder.getPage()).toEqual(null);
  });
});

describe('WHEN using #cloneSetPreviousPage()', () => {
  let builder: PaginationCustomIdBuilder;
  const page = Math.ceil(Math.random() * 100);

  beforeEach(() => {
    builder = new PaginationCustomIdBuilder({
      namespace,
      objectId,
      separator,
      metadataSeparator,
    });
  });

  test("THEN if the page wasn't set, it should be null", () => {
    expect(builder.cloneSetPreviousPage().getPage()).toEqual(null);
  });

  test('THEN if the page was set, it should be the previous page', () => {
    builder.setPage(page);
    expect(builder.cloneSetPreviousPage().getPage()).toEqual(page - 1);
  });

  test('THEN the original should not have changed', () => {
    expect(builder.getPage()).toEqual(null);
  });
});
