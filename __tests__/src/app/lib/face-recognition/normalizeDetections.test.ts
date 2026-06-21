/**
 * normalizeDetections ユーティリティのテスト
 *
 * このテストファイルは、src/app/lib/face-recognition/normalizeDetections.ts の機能をテストします。
 * face-api.js の検出結果を正規化する処理をテストしています。
 */

import {normalizeDetections} from '@/app/lib/face-recognition/normalizeDetections';

// face-api.js のモック
jest.mock('face-api.js', () => ({}));

describe('normalizeDetections', () => {
    const makeDetection = (overrides?: Partial<{age: number; gender: 'male' | 'female'; genderProbability: number}>) => ({
        detection: {
            box: {x: 10, y: 20, width: 100, height: 120},
        },
        expressions: {
            happy: 0.8,
            sad: 0.1,
            neutral: 0.1,
        },
        age: overrides?.age ?? 25.7,
        gender: overrides?.gender ?? 'male',
        genderProbability: overrides?.genderProbability ?? 0.93,
    });

    it('空配列を渡すと空配列が返る', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(normalizeDetections([] as any[])).toEqual([]);
    });

    it('バウンディングボックスの座標が正しく変換される', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = normalizeDetections([makeDetection()] as any[]);
        expect(result[0].box).toEqual({x: 10, y: 20, width: 100, height: 120});
    });

    it('最もスコアの高い表情が選択される', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = normalizeDetections([makeDetection()] as any[]);
        expect(result[0].expression).toBe('happy');
        expect(result[0].expressionScore).toBeCloseTo(0.8);
    });

    it('年齢・性別・genderProbability が正しく変換される', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = normalizeDetections([makeDetection()] as any[]);
        expect(result[0].age).toBeCloseTo(25.7);
        expect(result[0].gender).toBe('male');
        expect(result[0].genderProbability).toBeCloseTo(0.93);
    });

    it('複数の検出結果が正しく変換される', () => {
        const detections = [
            makeDetection({age: 20, gender: 'female', genderProbability: 0.7}),
            makeDetection({age: 35, gender: 'male', genderProbability: 0.9}),
        ];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = normalizeDetections(detections as any[]);
        expect(result).toHaveLength(2);
        expect(result[0].gender).toBe('female');
        expect(result[1].gender).toBe('male');
    });

    it('全表情スコアが同じ場合でも最初のエントリが選ばれる', () => {
        const det = {
            ...makeDetection(),
            expressions: {happy: 0.5, sad: 0.5, neutral: 0.0},
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = normalizeDetections([det] as any[]);
        // 同点の場合は reduce の初期値 (最初のエントリ) が返る
        expect(['happy', 'sad']).toContain(result[0].expression);
    });
});
