import { facilityNames } from "../../model/Facility";
import { floorNames } from "../../model/Floor";
import { materialNames } from "../../model/Material";
import { toolNames } from "../../model/Tool";

export function getItemType(name: any){
    if( facilityNames.includes(name) ){
        return "facility"
    }else if(floorNames.includes(name)){
        return "floor"
    }else if(materialNames.includes(name)){
        return "material"
    }else if(toolNames.includes(name)){
        return "tool"
    }else{
        throw new Error("Itemの名前がいずれの型にも一致しません")
    }
}