/** An object that verifies that a request was signed by Discord. */
export interface SignatureVerifier {
  /** Returns whether the signature is valid for the given body and timestamp. */
  verify(
    body: string | Uint8Array,
    signature: string,
    timestamp: string,
  ): Promise<boolean>;
}
