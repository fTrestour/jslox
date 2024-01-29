export class LexicalError extends Error {
  constructor(message: string, public position: number) {
    super(message);
  }

  public toString() {
    return `${this.message} at index ${this.position}`;
  }
}
