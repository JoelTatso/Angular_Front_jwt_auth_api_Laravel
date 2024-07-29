import { AbstractControl, ValidatorFn } from "@angular/forms";

export function samevalueValidator(value:string, confirmValue:string): ValidatorFn
{
  return (c:AbstractControl):{[key:string]: boolean} | null => {

    if(c.get(value)?.pristine || c.get(confirmValue)?.value){

      return null;

    }
    if(c.get(value)?.value === c.get(confirmValue)?.value){

      return null

    }else{

      return {samevalue:true}

    }
  }
}
