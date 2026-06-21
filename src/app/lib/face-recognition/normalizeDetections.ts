import * as faceapi from 'face-api.js';
import type {Gender, NormalizedDetection} from './types';

type FullDetection = faceapi.WithAge<
    faceapi.WithGender<
        faceapi.WithFaceExpressions<
            faceapi.WithFaceDetection<object>
        >
    >
>;

/**
 * face-api.js の検出結果を UI レンダリング用に正規化する。
 *
 * @param detections - face-api.js が返す生の検出結果配列
 * @returns 正規化された検出結果配列
 */
export function normalizeDetections(
    detections: FullDetection[],
): NormalizedDetection[] {
    return detections.map((d) => {
        const {x, y, width, height} = d.detection.box;

        // 表情: 最もスコアの高いエントリを選択
        const expressionEntries = Object.entries(d.expressions) as [string, number][];
        const [expression, expressionScore] = expressionEntries.reduce(
            (best, curr) => (curr[1] > best[1] ? curr : best),
            expressionEntries[0],
        );

        const gender: Gender = d.gender === 'male' ? 'male' : 'female';

        return {
            box: {x, y, width, height},
            expression,
            expressionScore,
            age: d.age,
            gender,
            genderProbability: d.genderProbability,
        };
    });
}
