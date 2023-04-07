import { fileURLToPath } from "url"
import path from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  // メインとなるJavaScriptファイル（エントリーポイント）
  entry: `./src/client/js/main.js`,
  mode: "development",

  // ファイルの出力設定
  output: {
    path: `${__dirname}/dist`, //  出力ファイルのディレクトリ名
    filename: "main.js" // 出力ファイル名
  }
};