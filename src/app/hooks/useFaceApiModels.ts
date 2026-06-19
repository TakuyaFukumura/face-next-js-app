'use client';

import {useEffect, useState} from 'react';
import {loadFaceApiModels} from '@/app/lib/face-recognition/faceApiLoader';

interface UseFaceApiModelsReturn {
    /** モデルのロードが完了しているかどうか */
    modelsLoaded: boolean;
    /** モデルロード中かどうか */
    modelsLoading: boolean;
    /** モデルロード時のエラーメッセージ。エラーなしの場合は null */
    modelError: string | null;
}

/**
 * face-api.js のモデルロードを管理するフック。
 * マウント時に自動でモデルをロードする。
 */
export function useFaceApiModels(): UseFaceApiModelsReturn {
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [modelsLoading, setModelsLoading] = useState(true);
    const [modelError, setModelError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                await loadFaceApiModels();
                if (!cancelled) {
                    setModelsLoaded(true);
                }
            } catch (err) {
                if (!cancelled) {
                    setModelError(
                        `顔解析モデルの読み込みに失敗しました: ${
                            err instanceof Error ? err.message : String(err)
                        }`,
                    );
                }
            } finally {
                if (!cancelled) {
                    setModelsLoading(false);
                }
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, []);

    return {modelsLoaded, modelsLoading, modelError};
}
