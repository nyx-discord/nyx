/** Signs request bodies like Discord does, with a fresh Ed25519 key pair. */
export class MockSigner {
  protected readonly keys: CryptoKeyPair;

  protected readonly encoder = new TextEncoder();

  public readonly publicKey: string;

  constructor(keys: CryptoKeyPair, publicKey: string) {
    this.keys = keys;
    this.publicKey = publicKey;
  }

  public static async create(): Promise<MockSigner> {
    const keys = (await crypto.subtle.generateKey({ name: 'Ed25519' }, true, [
      'sign',
      'verify',
    ])) as CryptoKeyPair;
    const publicKey = this.toHex(
      await crypto.subtle.exportKey('raw', keys.publicKey),
    );
    return new this(keys, publicKey);
  }

  public static now(): string {
    return Math.floor(Date.now() / 1_000).toString();
  }

  public async sign(body: string, timestamp: string): Promise<string> {
    const signature = await crypto.subtle.sign(
      { name: 'Ed25519' },
      this.keys.privateKey,
      this.encoder.encode(timestamp + body),
    );
    return MockSigner.toHex(signature);
  }

  public async signRequest(body: string, timestamp = MockSigner.now()) {
    return { body, timestamp, signature: await this.sign(body, timestamp) };
  }

  protected static toHex(bytes: ArrayBuffer): string {
    return Buffer.from(bytes).toString('hex');
  }
}
