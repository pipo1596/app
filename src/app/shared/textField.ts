import { environment } from "../../environments/environment.development";

// text-field.ts
export class TextField {
    value: string = "";
    htmlid: string;
    error: string = "";
    rules: string[] = [];
  
    constructor(htmlid: string,rules:string[]) {
      this.htmlid = htmlid;
      this.rules = rules;
    }
  
    // Custom validation: checks if the field is not empty
    validate():boolean {
      this.error = ""; // Reset errors
      let valid = true;
      //minlenth20 i.e. will make sure the field is at least 20 characters long:
      let minlength = parseInt(this.includesStartsWith(this.rules,'minlength',9));
      if(this.value && minlength>0)
      if (this.value.length < minlength) {
        this.error= "(less than " +minlength+" characters)";valid = false;        
      }

      this.rules.includes("required")
      if (!this.value) {
        this.error = '(required)';valid = false;
      }
      return valid;
    }

    includesStartsWith(arr:string[], str:string, n:number) {
        for (let el of arr) {
          if (el.slice(0, n) === str.slice(0, n)) {
            return el.slice(n);
          }
        }
        return "";
      }
  }
  

  export class Page {
    data:any;
    title:string = '';
    fullname:string = '';
    imgprfx:string = environment.imgprfx;
    loading: boolean = true;
    rfno:string | null ="";
    entrymode: boolean = false;
    editmode: boolean = false;
    viewmode: boolean = false;
    topErrorID:string = "";
    
  }