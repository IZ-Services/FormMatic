
import 'jest';

declare global {
  namespace jest {
    interface MockedFunction<T extends (...args: any[]) => any> {
      (...args: Parameters<T>): ReturnType<T>;
      mockImplementation: (fn: (...args: Parameters<T>) => ReturnType<T>) => MockedFunction<T>;
      mockReturnValue: (value: ReturnType<T>) => MockedFunction<T>;
      mockResolvedValue: <U extends ReturnType<T>>(value: Awaited<U>) => MockedFunction<T>;
      mockRejectedValue: (reason?: any) => MockedFunction<T>;
      mockReturnThis: () => MockedFunction<T>;
      mockRestore: () => void;
    }


  }
}

export {};