import * as faceapi from 'face-api.js';
import {MODEL_URL} from '@/app/constants/faceRecognition';

/**
 * face-api.js が必要とする 3 つのモデルをロードする。
 * 既にロード済みの場合は何もしない。
 */
export async function loadFaceApiModels(): Promise<void> {
    await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
    ]);
}
