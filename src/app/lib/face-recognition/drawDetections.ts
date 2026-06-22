import type {NormalizedDetection} from './types';
import {
    AGE_DECIMAL_DIGITS,
    BOX_COLOR,
    BOX_LINE_WIDTH,
    LABEL_BG_COLOR,
    LABEL_FONT_SIZE,
    LABEL_TEXT_COLOR,
} from '@/app/constants/faceRecognition';

/**
 * video の実サイズと canvas の CSS 表示サイズの差異を吸収するスケール係数を計算する。
 */
function getScale(
    canvas: HTMLCanvasElement,
    videoIntrinsicWidth: number,
    videoIntrinsicHeight: number,
): {scaleX: number; scaleY: number} {
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    return {
        scaleX: displayWidth / videoIntrinsicWidth,
        scaleY: displayHeight / videoIntrinsicHeight,
    };
}

/**
 * 検出結果を canvas に描画する。
 * 呼び出し前に前フレームを clearRect で消去すること。
 *
 * @param canvas - 描画先の canvas 要素
 * @param detections - 正規化された検出結果配列
 * @param videoIntrinsicWidth - video 要素の videoWidth (実解像度)
 * @param videoIntrinsicHeight - video 要素の videoHeight (実解像度)
 */
export function drawDetections(
    canvas: HTMLCanvasElement,
    detections: NormalizedDetection[],
    videoIntrinsicWidth: number,
    videoIntrinsicHeight: number,
): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const {scaleX, scaleY} = getScale(canvas, videoIntrinsicWidth, videoIntrinsicHeight);

    for (const det of detections) {
        const {x, y, width, height} = det.box;

        const dx = x * scaleX;
        const dy = y * scaleY;
        const dw = width * scaleX;
        const dh = height * scaleY;

        // バウンディングボックス
        ctx.strokeStyle = BOX_COLOR;
        ctx.lineWidth = BOX_LINE_WIDTH;
        ctx.strokeRect(dx, dy, dw, dh);

        // ラベル文字列の組み立て
        const ageText = det.age.toFixed(AGE_DECIMAL_DIGITS);
        const genderLabel = det.gender === 'male' ? '男性' : '女性';
        const lines = [
            `表情: ${det.expression} (${(det.expressionScore * 100).toFixed(0)}%)`,
            `年齢: 約${ageText}歳`,
            `性別: ${genderLabel} (${(det.genderProbability * 100).toFixed(0)}%)`,
        ];

        // ラベル背景の描画
        const padding = 4;
        const lineHeight = LABEL_FONT_SIZE + 4;
        const bgHeight = lines.length * lineHeight + padding * 2;

        ctx.font = `${LABEL_FONT_SIZE}px sans-serif`;
        const maxWidth = Math.max(...lines.map((l) => ctx.measureText(l).width));

        const bgY = dy - bgHeight;
        ctx.fillStyle = LABEL_BG_COLOR;
        ctx.fillRect(dx, bgY > 0 ? bgY : dy + dh, maxWidth + padding * 2, bgHeight);

        // テキスト描画
        ctx.fillStyle = LABEL_TEXT_COLOR;
        lines.forEach((line, i) => {
            const textY = (bgY > 0 ? bgY : dy + dh) + padding + (i + 1) * lineHeight - 4;
            ctx.fillText(line, dx + padding, textY);
        });
    }
}
