import { describe, expect, test } from 'vitest';
import { DefaultSignatureVerifier } from '../../../src';
import { MockSigner } from '../../client/mocks/MockSigner';

describe('DefaultSignatureVerifier (verify)', () => {
  test('GIVEN a body signed with the public key WHEN verifying THEN returns true', async () => {
    const signer = await MockSigner.create();
    const verifier = DefaultSignatureVerifier.create({
      publicKey: signer.publicKey,
    });
    const { body, signature, timestamp } =
      await signer.signRequest('{"type":1}');

    await expect(verifier.verify(body, signature, timestamp)).resolves.toBe(
      true,
    );
  });

  test('GIVEN a byte body WHEN verifying THEN checks the same bytes', async () => {
    const signer = await MockSigner.create();
    const verifier = DefaultSignatureVerifier.create({
      publicKey: signer.publicKey,
    });
    const { body, signature, timestamp } =
      await signer.signRequest('{"type":1}');

    await expect(
      verifier.verify(new TextEncoder().encode(body), signature, timestamp),
    ).resolves.toBe(true);
  });

  test('GIVEN a tampered body or timestamp WHEN verifying THEN returns false', async () => {
    const signer = await MockSigner.create();
    const verifier = DefaultSignatureVerifier.create({
      publicKey: signer.publicKey,
    });
    const { signature, timestamp } = await signer.signRequest('{"type":1}');

    await expect(
      verifier.verify('{"type":2}', signature, timestamp),
    ).resolves.toBe(false);
    await expect(
      verifier.verify('{"type":1}', signature, `${timestamp}0`),
    ).resolves.toBe(false);
  });

  test('GIVEN another key pair WHEN verifying THEN returns false', async () => {
    const signer = await MockSigner.create();
    const other = await MockSigner.create();
    const verifier = DefaultSignatureVerifier.create({
      publicKey: other.publicKey,
    });
    const { body, signature, timestamp } = await signer.signRequest('{}');

    await expect(verifier.verify(body, signature, timestamp)).resolves.toBe(
      false,
    );
  });

  test('GIVEN a malformed signature WHEN verifying THEN returns false', async () => {
    const signer = await MockSigner.create();
    const verifier = DefaultSignatureVerifier.create({
      publicKey: signer.publicKey,
    });

    await expect(verifier.verify('{}', 'not-hex', '1')).resolves.toBe(false);
    await expect(verifier.verify('{}', 'abcd', '1')).resolves.toBe(false);
  });

  test('GIVEN an invalid public key WHEN verifying THEN rejects', async () => {
    const verifier = DefaultSignatureVerifier.create({ publicKey: 'zz' });

    await expect(verifier.verify('{}', 'abcd', '1')).rejects.toThrow();
  });
});
