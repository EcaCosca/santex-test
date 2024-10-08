import { renderHook, act } from '@testing-library/react-hooks';
import { useStateWithStorage } from '../useStateWithStorage';

describe('useStateWithStorage', () => {
    const key = 'testKey';
    const initialValue = 'initialValue';

    beforeEach(() => {
        localStorage.clear();
    });

    it('should initialize with value from localStorage if available', () => {
        localStorage.setItem(key, JSON.stringify('storedValue'));
        const { result } = renderHook(() => useStateWithStorage(key, initialValue));
        expect(result.current[0]).toBe('storedValue');
    });

    it('should initialize with initialValue if localStorage is empty', () => {
        const { result } = renderHook(() => useStateWithStorage(key, initialValue));
        expect(result.current[0]).toBe(initialValue);
    });

    it('should update localStorage when state changes', () => {
        const { result } = renderHook(() => useStateWithStorage(key, initialValue));
        act(() => {
            result.current[1]('newValue');
        });
        expect(localStorage.getItem(key)).toBe(JSON.stringify('newValue'));
    });

    it('should update state when setValue is called', () => {
        const { result } = renderHook(() => useStateWithStorage(key, initialValue));
        act(() => {
            result.current[1]('newValue');
        });
        expect(result.current[0]).toBe('newValue');
    });

    it('should handle non-string initial values', () => {
        const numberKey = 'numberKey';
        const numberInitialValue = 42;
        const { result } = renderHook(() => useStateWithStorage(numberKey, numberInitialValue));
        expect(result.current[0]).toBe(numberInitialValue);

        act(() => {
            result.current[1](100);
        });
        expect(result.current[0]).toBe(100);
        expect(localStorage.getItem(numberKey)).toBe(JSON.stringify(100));
    });

    it('should handle complex objects as initial values', () => {
        const objectKey = 'objectKey';
        const objectInitialValue = { a: 1, b: 2 };
        const { result } = renderHook(() => useStateWithStorage(objectKey, objectInitialValue));
        expect(result.current[0]).toEqual(objectInitialValue);

        const newValue = { a: 3, b: 4 };
        act(() => {
            result.current[1](newValue);
        });
        expect(result.current[0]).toEqual(newValue);
        expect(localStorage.getItem(objectKey)).toBe(JSON.stringify(newValue));
    });
});