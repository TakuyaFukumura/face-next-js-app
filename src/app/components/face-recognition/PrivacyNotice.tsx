'use client';

import React from 'react';

/**
 * プライバシーに関する注意書きを表示するコンポーネント。
 * 映像・推論結果が保存・送信されないことと、推定値であることを明示する。
 */
export default function PrivacyNotice() {
    return (
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg text-xs text-yellow-800 dark:text-yellow-300 space-y-1">
            <p className="font-semibold">⚠️ ご注意</p>
            <ul className="list-disc list-inside space-y-1">
                <li>映像・推論結果はサーバーへ送信されず、保存もされません。すべての処理はブラウザ上で完結します。</li>
                <li>表情・年齢・性別はAIによる<strong>推定値</strong>であり、誤差を含みます。</li>
                <li>本アプリは個人の識別（本人特定）を行いません。</li>
                <li>採用・医療・本人確認などのセンシティブな用途には使用しないでください。</li>
                <li>カメラ利用にはHTTPS環境が必要です（開発時のlocalhostは除く）。</li>
            </ul>
        </div>
    );
}
