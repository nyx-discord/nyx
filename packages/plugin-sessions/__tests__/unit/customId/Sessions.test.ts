import { MockListPaginationSession } from '#mocks/MockListPaginationSession';
import { MockPaginationSession } from '#mocks/MockPaginationSession';
import { MockSession } from '#mocks/MockSession';
import { MockSessionStage } from '#mocks/stage/MockSessionStage';
import { MockStagePaginationSession } from '#mocks/stage/MockStagePaginationSession';
import type { PaginationSession, Session } from '#src';
import { DjsSessionPlugin } from '#src';
import { describe, expect, it, test } from 'vitest';

const createSession = () => MockSession.createMock();
const createPaginationSession = () => MockPaginationSession.createMock();
const createListPaginationSession = async <T>(items?: T[]) =>
  MockListPaginationSession.createMock<T>(items ?? []);
const createStagePaginationSession = () =>
  MockStagePaginationSession.createMock();

const createSessionStage = () => MockSessionStage.createMock();

function runBaseTests(name: string, factory: () => Promise<Session<any>>) {
  describe(name, () => {
    it('builds a string customId', async () => {
      const session = await factory();
      expect(typeof session.buildCustomId()).toEqual('string');
      expect(typeof session.buildCustomId('test')).toEqual('string');
    });

    test('GIVEN no extra THEN customId is equal to codec output', async () => {
      const session = await factory();
      const bot = session.getBot();

      const sessionGenerated = session.buildCustomId();

      const codecGenerated = DjsSessionPlugin.getFromBot(bot)
        .getCustomIdCodec()
        .serialize({
          id: session.getId(),
          extra: null,
          page: null,
        });

      expect(sessionGenerated).toEqual(codecGenerated);
    });

    test('GIVEN extra THEN customId is equal to codec output', async () => {
      const session = await factory();
      const bot = session.getBot();

      const sessionGenerated = session.buildCustomId('test');
      const codecGenerated = DjsSessionPlugin.getFromBot(bot)
        .getCustomIdCodec()
        .serialize({
          id: session.getId(),
          extra: 'test',
          page: null,
        });

      expect(sessionGenerated).toEqual(codecGenerated);
    });

    it('returns customId data matching its own data', async () => {
      const session = await factory();
      const id = session.getId();
      expect(session.getCustomIdData()).toEqual({
        id,
        extra: null,
        page: null,
      });
      expect(session.getCustomIdData('test')).toEqual({
        id,
        extra: 'test',
        page: null,
      });
    });
  });
}

function runPaginationTests(
  name: string,
  factory: () => Promise<PaginationSession<any>>,
) {
  runBaseTests(name, factory);

  describe(name, () => {
    it('GIVEN a page THEN builds a string pagination customId', async () => {
      const session = await factory();
      expect(typeof session.buildPageCustomId(1)).toEqual('string');
      expect(typeof session.buildPageCustomId(1, 'test')).toEqual('string');
    });

    test('GIVEN a page and extra THEN customId is equal to codec output', async () => {
      const session = await createPaginationSession();
      const bot = session.getBot();

      const sessionGenerated = session.buildPageCustomId(1, 'test');
      const codecGenerated = DjsSessionPlugin.getFromBot(bot)
        .getCustomIdCodec()
        .serialize({
          id: session.getId(),
          extra: 'test',
          page: 1,
        });

      expect(sessionGenerated).toEqual(codecGenerated);
    });
  });
}

describe("AbstractSessions' CustomIds", () => {
  runBaseTests('AbstractSession', createSession);
  runPaginationTests('AbstractPaginationSession', createPaginationSession);
  runPaginationTests(
    'AbstractListPaginationSession',
    createListPaginationSession,
  );
  runPaginationTests(
    'AbstractStagePaginationSession',
    createStagePaginationSession,
  );

  describe('AbstractSessionStage', () => {
    test('GIVEN a page THEN builds a string pagination customId', async () => {
      const stage = await createSessionStage();
      expect(typeof stage['buildPageCustomId'](1)).toEqual('string');
    });

    test('GIVEN a stage THEN it builds a string pagination customId for that stage', async () => {
      const stage = await createSessionStage();
      const startStage = stage.getSession().getStages()[0];

      expect(typeof stage['buildCustomIdForStage'](startStage)).toEqual(
        'string',
      );
      expect(typeof stage['buildCustomIdForStage'](startStage, 'test')).toEqual(
        'string',
      );
    });

    test('GIVEN a stage and extra THEN customId is equal to codec output', async () => {
      const stage = await createSessionStage();
      const bot = stage.getBot();

      const sessionGenerated = stage['buildCustomIdForStage'](
        stage.getSession().getStages()[0],
        'test',
      );
      const codecGenerated = DjsSessionPlugin.getFromBot(bot)
        .getCustomIdCodec()
        .serialize({
          id: stage.getSession().getId(),
          extra: 'test',
          page: 0,
        });

      expect(sessionGenerated).toEqual(codecGenerated);
    });

    test('GIVEN a non present stage THEN it throws', async () => {
      const stage = await createSessionStage();
      const nonPresent = await createSessionStage();
      expect(() => stage['buildCustomIdForStage'](nonPresent)).toThrow();
    });
  });
});
