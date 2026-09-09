import { MockPaginationSession } from '#mocks/MockPaginationSession';
import { MockSession } from '#mocks/MockSession';
import { DefaultSessionRepository } from '#src';
import { describe, expect, it, test, vi } from 'vitest';

async function createSession(): Promise<MockSession> {
  return MockSession.createMock();
}

async function createPaginationSession(): Promise<MockPaginationSession> {
  return MockPaginationSession.createMock();
}

describe('DefaultSessionRepository', () => {
  describe('getByConstructor', () => {
    it('returns empty collection when no sessions exist', () => {
      const repo = DefaultSessionRepository.create();

      const result = repo.getByConstructor(MockSession);

      expect(result.size).toBe(0);
    });

    it('returns empty collection when no sessions match the constructor', async () => {
      const repo = DefaultSessionRepository.create();
      repo.save(await createSession());

      const result = repo.getByConstructor(MockPaginationSession);

      expect(result.size).toBe(0);
    });

    it('returns a single saved session by its constructor', async () => {
      const repo = DefaultSessionRepository.create();
      const session = await createSession();
      repo.save(session);

      const result = repo.getByConstructor(MockSession);

      expect(result.size).toBe(1);
      expect(result.get(session.getId())).toBe(session);
    });

    it('returns multiple sessions of the same constructor', async () => {
      const repo = DefaultSessionRepository.create();
      const a = await createSession();
      const b = await createSession();
      const c = await createSession();
      repo.save(a);
      repo.save(b);
      repo.save(c);

      const result = repo.getByConstructor(MockSession);

      expect(result.size).toBe(3);
      expect(result.get(a.getId())).toBe(a);
      expect(result.get(b.getId())).toBe(b);
      expect(result.get(c.getId())).toBe(c);
    });

    it('separates sessions by constructor', async () => {
      const repo = DefaultSessionRepository.create();
      const session = await createSession();
      const pagination = await createPaginationSession();
      repo.save(session);
      repo.save(pagination);

      const sessions = repo.getByConstructor(MockSession);
      const paginations = repo.getByConstructor(MockPaginationSession);

      expect(sessions.size).toBe(1);
      expect(paginations.size).toBe(1);
    });
  });

  describe('index maintenance', () => {
    test('deleted session is removed from the constructor index', async () => {
      const repo = DefaultSessionRepository.create();
      const session = await createSession();
      repo.save(session);

      repo.delete(session.getId());

      expect(repo.getByConstructor(MockSession).size).toBe(0);
    });

    test('saving a session with the same ID updates the index', async () => {
      const repo = DefaultSessionRepository.create();
      const original = await createSession();
      repo.save(original);

      const replacement = await createSession();
      Object.defineProperty(replacement, 'id', {
        value: original.getId(),
        writable: false,
      });
      repo.save(replacement);

      const result = repo.getByConstructor(MockSession);
      expect(result.size).toBe(1);
      expect(result.get(original.getId())).toBe(replacement);
    });

    test('saving more than one session to the same key increments the count', async () => {
      const repo = DefaultSessionRepository.create();

      repo.save(await createSession());
      expect(repo.getByConstructor(MockSession).size).toBe(1);

      repo.save(await createSession());
      expect(repo.getByConstructor(MockSession).size).toBe(2);

      repo.save(await createSession());
      expect(repo.getByConstructor(MockSession).size).toBe(3);
    });

    test('deleting the last session of a constructor removes the key entirely', async () => {
      const repo = DefaultSessionRepository.create();
      const session = await createSession();
      repo.save(session);

      repo.delete(session.getId());

      const result = repo.getByConstructor(MockSession);
      expect(result.size).toBe(0);
    });
  });

  describe('TTL and expiration', () => {
    test('GIVEN a session with TTL WHEN it expires THEN it is deindexed and expirationCallback is called', async () => {
      const callback = vi.fn();
      const repo = DefaultSessionRepository.create(callback);
      const session = await createSession();
      vi.spyOn(session, 'getTTL').mockReturnValue(100);

      repo.save(session);
      expect(repo.getByConstructor(MockSession).size).toBe(1);

      await new Promise(r => setTimeout(r, 150));
      repo.get(session.getId()); // Trigger stale check if lazy

      expect(repo.getByConstructor(MockSession).size).toBe(0);
      expect(callback).toHaveBeenCalledWith(session, session.getId(), 'stale');
    });

    test('GIVEN a session WHEN it is explicitly deleted THEN it is deindexed but expirationCallback is NOT called', async () => {
      const callback = vi.fn();
      const repo = DefaultSessionRepository.create(callback);
      const session = await createSession();

      repo.save(session);
      repo.delete(session.getId());

      expect(repo.getByConstructor(MockSession).size).toBe(0);
      expect(callback).not.toHaveBeenCalled();
    });

    test('GIVEN a callback is set via setExpirationCallback WHEN session expires THEN callback is called', async () => {
      const repo = DefaultSessionRepository.create();
      const callback = vi.fn();
      repo.setExpirationCallback(callback);

      const session = await createSession();
      vi.spyOn(session, 'getTTL').mockReturnValue(100);

      repo.save(session);
      await new Promise(r => setTimeout(r, 150));
      repo.get(session.getId()); // Trigger stale check if lazy

      expect(callback).toHaveBeenCalledWith(session, session.getId(), 'stale');
    });
  });

  describe('subclass handling', () => {
    it('returns sessions of the exact constructor, not parent classes', async () => {
      const repo = DefaultSessionRepository.create();
      const pagination = await createPaginationSession();
      const session = await createSession();
      repo.save(pagination);
      repo.save(session);

      const paginations = repo.getByConstructor(MockPaginationSession);
      const sessions = repo.getByConstructor(MockSession);

      expect(paginations.size).toBe(1);
      expect(sessions.size).toBe(1);
    });
  });
});
