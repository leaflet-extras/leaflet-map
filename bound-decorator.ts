/* eslint-disable @typescript-eslint/ban-types */
export function bound<T extends Function>(
  target: object,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<T>
): TypedPropertyDescriptor<T> | void {
  if (!descriptor || typeof descriptor.value !== 'function') {
    throw new TypeError(
      `Only methods can be decorated with @bound. <${propertyKey}> is not a method!`
    );
  }

  return {
    configurable: true,
    get(this: T): T {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const f: T = descriptor.value!.bind(this);
      // Credits to https://github.com/andreypopp/autobind-decorator for memoizing the result of bind against a symbol on the instance.
      Object.defineProperty(this, propertyKey, {
        value: f,
        configurable: true,
        writable: true,
      });
      return f;
    },
  };
}

export default bound;
