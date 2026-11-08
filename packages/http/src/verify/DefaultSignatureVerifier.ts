import type { SignatureVerifier } from './SignatureVerifier.js';

type SignatureVerifierOptions = {
  publicKey: string;
  subtle: SubtleCrypto;
};

export class DefaultSignatureVerifier implements SignatureVerifier {
  protected readonly publicKey: string;

  protected readonly subtle: SubtleCrypto;

  protected readonly encoder = new TextEncoder();

  protected key: Promise<CryptoKey> | null = null;

  constructor(options: SignatureVerifierOptions) {
    this.publicKey = options.publicKey;
    this.subtle = options.subtle;
  }

  /**
   * Creates a verifier that checks Ed25519 signatures with WebCrypto.
   *
   * @throws {Error} If no `subtle` is given and the runtime has no global `crypto.subtle`.
   */
  public static create(options: {
    publicKey: string;
    subtle?: SubtleCrypto;
  }): SignatureVerifier {
    const subtle = options.subtle ?? globalThis.crypto?.subtle;
    if (!subtle) {
      throw new Error(
        'This runtime has no global crypto.subtle. Pass `subtle` (e.g. webcrypto.subtle from node:crypto) or your own SignatureVerifier.',
      );
    }

    return new this({ publicKey: options.publicKey, subtle });
  }

  public async verify(
    body: string | Uint8Array,
    signature: string,
    timestamp: string,
  ): Promise<boolean> {
    const signatureBytes = this.hexToBytes(signature);
    if (!signatureBytes) {
      return false;
    }

    const bodyBytes =
      typeof body === 'string' ? this.encoder.encode(body) : body;
    const timestampBytes = this.encoder.encode(timestamp);
    const message = new Uint8Array(timestampBytes.length + bodyBytes.length);
    message.set(timestampBytes);
    message.set(bodyBytes, timestampBytes.length);

    // key import errors (e.g. no Ed25519 support) are thrown, not reported as invalid requests
    const key = await this.getKey();
    try {
      return await this.subtle.verify(
        { name: 'Ed25519' },
        key,
        signatureBytes,
        message,
      );
    } catch {
      return false;
    }
  }

  protected getKey(): Promise<CryptoKey> {
    if (this.key) {
      return this.key;
    }

    const keyBytes = this.hexToBytes(this.publicKey);
    if (!keyBytes) {
      return Promise.reject(new Error('The public key is not valid hex.'));
    }

    this.key = this.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'Ed25519' },
      false,
      ['verify'],
    );
    // let a failed import be retried on the next request
    this.key.catch(() => {
      this.key = null;
    });
    return this.key;
  }

  protected hexToBytes(hex: string): Uint8Array<ArrayBuffer> | null {
    if (hex.length % 2 !== 0 || !/^[\da-f]*$/i.test(hex)) {
      return null;
    }

    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    }
    return bytes;
  }
}
