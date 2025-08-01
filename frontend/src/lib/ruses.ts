type Listener = () => void;

export default class Ruse<T> {
  private _ruse: T;
  protected listeners: Set<Listener> = new Set();

  constructor(initial: T) {
    this._ruse = initial;
    this.listeners = new Set<Listener>();
  }
  notify() {
    for (const listener of this.listeners) {
      listener();
    }
  }
  protected _set(val: T) {
    this._ruse = val;
  }
  protected _get(): T {
    return this._ruse;
  }
  getValue() {
    return this._ruse;
  }
  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  getSnapshot(): T {
    return this._ruse;
  }
}
