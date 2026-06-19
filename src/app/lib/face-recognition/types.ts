/** 顔検出・属性推定アプリ全体で使用する型定義 */

/** アプリの動作状態 */
export type AppStatus =
    | 'idle'
    | 'loadingModels'
    | 'modelError'
    | 'startingCamera'
    | 'cameraError'
    | 'permissionDenied'
    | 'analyzing'
    | 'noFace';

/** 正規化された検出結果（1人分） */
export interface NormalizedDetection {
    /** 顔のバウンディングボックス (ピクセル座標, 映像の実サイズ基準) */
    box: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    /** 最も確率の高い表情ラベル */
    expression: string;
    /** 表情の確率スコア (0〜1) */
    expressionScore: number;
    /** 推定年齢 */
    age: number;
    /** 推定性別 ('male' | 'female') */
    gender: string;
    /** 性別推定の確率スコア (0〜1) */
    genderProbability: number;
}
