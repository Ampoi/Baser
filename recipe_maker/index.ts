const recipes_mermaid = await Deno.readTextFile("./recipe_maker/assets/index.md")

const recipes_reg = /(\S+)-->([\S^¥n]+)/g
const recipe_mermaid_list = recipes_mermaid.match(recipes_reg)

let recipes : {
  [key: string]: {
    [key: string]: number
  }
} = {}

recipe_mermaid_list?.forEach((recipe_mermaid) => {
  const recipe_reg = /(\S+)-->([\S^¥n]+)/
  const recipe_special_reg = /(\S+)-->([\S^¥n]+)/

  if(recipe_reg.test(recipe_mermaid)){
    recipe_mermaid.replace(recipe_reg, '$2')
    const material: string = RegExp.$1
    const product: string = RegExp.$2
    if(recipes[product]){
      recipes[product][material] = 1
    }else{
      recipes[product] = {
        [material]: 1
      }
    }
    console.log(`${material} => ${product}`);
  }else{
    console.log("aa");
  }
})

console.log(recipes);
Deno.writeTextFileSync("./recipe_maker/dist/index.json", JSON.stringify(recipes));