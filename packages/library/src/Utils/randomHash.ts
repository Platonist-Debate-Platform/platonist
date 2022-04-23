export class RandomHash {
  private readonly chars: string =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';

  public create(length = 34): string {
    let hash = '';
    for (let i = 0; i < length; i++) {
      hash += this.chars.charAt(Math.floor(Math.random() * this.chars.length));
    }
    return hash;
  }
}

export const randomHash = (length = 16) => new RandomHash().create(length);
