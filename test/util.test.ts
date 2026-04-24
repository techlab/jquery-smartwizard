import { deepMerge } from '../src/ts/util';

describe('deepMerge', () => {
    test('should merge flat objects', () => {
        const base = { a: 1, b: 2 };
        const override = { b: 3, c: 4 };
        const result = deepMerge(base, override);
        expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    test('should merge nested objects', () => {
        const base = { a: 1, b: { x: 1, y: 2 } };
        const override = { b: { y: 3, z: 4 } };
        const result = deepMerge(base, override);
        expect(result).toEqual({ a: 1, b: { x: 1, y: 3, z: 4 } });
    });

    test('should replace arrays instead of merging them', () => {
        const base = { a: [1, 2] };
        const override = { a: [3] };
        const result = deepMerge(base, override);
        expect(result.a).toEqual([3]);
        expect(result.a).not.toBe(override.a); // Should be a copy if we want deep clone, but current impl doesn't deep clone override if not merging
    });

    test('should replace objects with primitives', () => {
        const base = { a: { b: 1 } };
        const override = { a: 2 };
        const result = deepMerge(base, override);
        expect(result.a).toBe(2);
    });

    test('should replace primitives with objects', () => {
        const base = { a: 1 };
        const override = { a: { b: 2 } };
        const result = deepMerge(base, override);
        expect(result.a).toEqual({ b: 2 });
    });

    test('should handle null values in override', () => {
        const base = { a: { b: 1 } };
        const override = { a: null };
        const result = deepMerge(base, override);
        expect(result.a).toBeNull();
    });

    test('should ignore undefined values in override', () => {
        const base = { a: 1 };
        const override = { a: undefined };
        const result = deepMerge(base, override);
        expect(result.a).toBe(1);
    });

    test('should handle null values in base', () => {
        const base = { a: null };
        const override = { a: { b: 1 } };
        const result = deepMerge(base, override);
        expect(result.a).toEqual({ b: 1 });
    });

    test('should ensure the result is a new object', () => {
        const base = { a: 1 };
        const override = { b: 2 };
        const result = deepMerge(base, override);
        expect(result).not.toBe(base);
        expect(result).not.toBe(override);
    });

    test('should deeply clone objects from base that are not in override', () => {
        const base = { a: { b: 1 } };
        const override = { c: 2 };
        const result = deepMerge(base, override);
        expect(result.a).toEqual(base.a);
        expect(result.a).not.toBe(base.a); // This might fail with current implementation
    });

    test('should deeply clone objects from override that are not in base', () => {
        const base = { a: 1 };
        const override = { b: { c: 2 } };
        const result = deepMerge(base, override);
        expect(result.b).toEqual(override.b);
        expect(result.b).not.toBe(override.b); // This might fail with current implementation
    });
});
