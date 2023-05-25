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
  const recipe_special_reg = /(\S+)--(\S+)-->([\S^¥n]+)/

  let product: string
  let material: string

  if (recipe_special_reg.test(recipe_mermaid)){
    recipe_mermaid.replace(recipe_special_reg, "a")
    material = RegExp.$1
    product = RegExp.$3

  }else if(recipe_reg.test(recipe_mermaid)){
    recipe_mermaid.replace(recipe_reg, "a")
    material = RegExp.$1
    product = RegExp.$2

  }else{
    throw new Error(`⚠️想定外の形式で書かれています: ${recipe_mermaid}`)
  }

  if(recipes[product]){
    recipes[product][material] = 1
  }else{
    recipes[product] = {
      [material]: 1
    }
  }
})

console.log(recipes);
Deno.writeTextFileSync("./recipe_maker/dist/index.json", JSON.stringify(recipes));