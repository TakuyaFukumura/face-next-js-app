'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import * as faceapi from 'face-api.js';
import {normalizeDetections} from '@/app/lib/face-recognition/normalizeDetections';
import {drawDetections} from '@/app/lib/face-recognition/drawDetections';
import type {NormalizedDetection} from '@/app/lib/face-recognition/types';
import {DETECTION_INTERVAL_MS, DETECTION_SCORE_THRESHOLD} from '@/app/constants/faceRecognition';

interface UseFaceDetectionOptions {
    /** 解析を実行するかどうか (モデルロード済み + カメラ再生中のとき true にする) */
    enabled: boolean;
    /** 映像を映す video 要素 */
    videoRef: React.RefObject<HTMLVideoElement | null>;
    /** 検出枠を描画する canvas 要素 */
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

interface UseFaceDetectionReturn {
    /** 直近の検出結果 */
    detections: NormalizedDetection[];
}

/**
 * 一定間隔で face-api.js の推論を実行し、結果を canvas に描画するフック。
 */
export function useFaceDetection({
    enabled,
    videoRef,
    canvasRef,
}: UseFaceDetectionOptions): UseFaceDetectionReturn {
    const [detections, setDetections] = useState<NormalizedDetection[]>([]);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const runningRef = useRef(false);

    const detect = useCallback(async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas || video.readyState < HTMLMediaElement.HAVE_ENOUGH_DATA) {
            return;
        }

        const results = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({scoreThreshold: DETECTION_SCORE_THRESHOLD}))
            .withFaceExpressions()
            .withAgeAndGender();

        const normalized = normalizeDetections(results);
        setDetections(normalized);

        // canvas サイズを CSS 表示サイズに同期
        if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        }

        // 前フレームを消去してから再描画
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        if (normalized.length > 0) {
            drawDetections(canvas, normalized, video.videoWidth, video.videoHeight);
        }
    }, [videoRef, canvasRef]);

    useEffect(() => {
        if (!enabled) {
            // 推論停止時にオーバーレイを消す
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx?.clearRect(0, 0, canvas.width, canvas.height);
            }
            return;
        }

        runningRef.current = true;

        const loop = async () => {
            if (!runningRef.current) return;
            await detect();
            if (runningRef.current) {
                timerRef.current = setTimeout(loop, DETECTION_INTERVAL_MS);
            }
        };

        loop();

        return () => {
            runningRef.current = false;
            if (timerRef.current !== null) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [enabled, detect, canvasRef]);

    return {detections: enabled ? detections : []};
}
