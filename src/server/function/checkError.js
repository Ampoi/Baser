//エラーを表示する関数
export function checkError(err){
  if(err != null){throw new Error(err);}
}