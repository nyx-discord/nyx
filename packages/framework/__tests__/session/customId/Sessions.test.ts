import type { PaginationSession, Session } from '@nyx-discord/core';
import { MockListPaginationSession } from '../mocks/MockListPaginationSession';
import { MockPaginationSession } from '../mocks/MockPaginationSession';
import { MockSession } from '../mocks/MockSession';
import { MockSessionStage } from '../mocks/stage/MockSessionStage';
import { MockStagePaginationSession } from '../mocks/stage/MockStagePaginationSession';

const createSession = () => MockSession.createMock();
const createPaginationSession = () => MockPaginationSession.createMock();
const createListPaginationSession = <T>(items?: T[]) =>
  MockListPaginationSession.createMock<T>(items ?? []);
const createStagePaginationSession = () =>
  MockStagePaginationSession.createMock();

const createSessionStage = () => MockSessionStage.createMock();

function runBaseTests(name: string, factory: () => Session<any>) {
  describe(name, () => {
    it('builds a string customId', () => {
      const session = factory();
      expect(typeof session.buildCustomId()).toEqual('string');
      expect(typeof session.buildCustomId('test')).toEqual('string');
    });

    test('GIVEN no extra THEN customId is equal to codec output', () => {
      const session = factory();
      const bot = session.bot;

      const sessionGenerated = session.buildCustomId();
      const codecGenerated = bot
        .getSessionManager()
        .getCustomIdCodec()
        .serialize({
          id: session.getId(),
          extra: null,
          page: null,
        });

      expect(sessionGenerated).toEqual(codecGenerated);
    });

    test('GIVEN extra THEN customId is equal to codec output', () => {
      const session = factory();
      const bot = session.bot;

      const sessionGenerated = session.buildCustomId('test');
      const codecGenerated = bot
        .getSessionManager()
        .getCustomIdCodec()
        .serialize({
          id: session.getId(),
          extra: 'test',
          page: null,
        });

      expect(sessionGenerated).toEqual(codecGenerated);
    });

    it('returns customId data matching its own data', () => {
      const session = factory();
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
  factory: () => PaginationSession<any>,
) {
  runBaseTests(name, factory);

  describe(name, () => {
    it('GIVEN a page THEN builds a string pagination customId', () => {
      const session = factory();
      expect(typeof session.buildPageCustomId(1)).toEqual('string');
      expect(typeof session.buildPageCustomId(1, 'test')).toEqual('string');
    });

    test('GIVEN a page and extra THEN customId is equal to codec output', () => {
      const session = createPaginationSession();
      const bot = session.bot;

      const sessionGenerated = session.buildPageCustomId(1, 'test');
      const codecGenerated = bot
        .getSessionManager()
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
    test('GIVEN a page THEN builds a string pagination customId', () => {
      const stage = createSessionStage();
      expect(typeof stage['buildPageCustomId'](1)).toEqual('string');
    });

    test('GIVEN a stage THEN it builds a string pagination customId for that stage', () => {
      const stage = createSessionStage();
      const startStage = stage.getSession().getStages()[0];

      expect(typeof stage['buildCustomIdForStage'](startStage)).toEqual(
        'string',
      );
      expect(typeof stage['buildCustomIdForStage'](startStage, 'test')).toEqual(
        'string',
      );
    });

    test('GIVEN a stage and extra THEN customId is equal to codec output', () => {
      const stage = createSessionStage();
      const bot = stage.bot;

      const sessionGenerated = stage['buildCustomIdForStage'](
        stage.getSession().getStages()[0],
        'test',
      );
      const codecGenerated = bot
        .getSessionManager()
        .getCustomIdCodec()
        .serialize({
          id: stage.getSession().getId(),
          extra: 'test',
          page: 0,
        });

      expect(sessionGenerated).toEqual(codecGenerated);
    });

    test('GIVEN a non present stage THEN it throws', () => {
      const stage = createSessionStage();
      const nonPresent = createSessionStage();
      expect(() => stage['buildCustomIdForStage'](nonPresent)).toThrow();
    });
  });
});
