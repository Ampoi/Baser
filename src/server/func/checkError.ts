//エラーを表示する関数
export function checkError(err: Error | string | null){
  if(err != null){
    if(typeof err == "string"){
      throw new Error(err)
    }else{
      throw err
    }
  }
}