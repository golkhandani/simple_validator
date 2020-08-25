//console.time("VALIDATOR")
enum SchemaType {
    string,
    object,
    array
}
const Required = (value:any) => {
    if(value) {
        return {
            isValid:true,
            message:"yay"
        }
    } else {
        return {
            isValid:false,
            message:"Is Required"
        }
    }
}
const Alphabet = (value:any) => {
    if(typeof value == "string") {
        return {
            isValid:true,
            message:"yay"
        }
    }
    else {
        return {
            isValid:false,
            message:"Must be Alphabet"
        }
    }
}
const Min = (value:string, min:number) =>{
    if(value.length > min) {
        return {
            isValid:true,
            message:"yay"
        }
    } else {
        return {
            isValid:false,
            message:"Is NOT MIN"
        }
    }
}
const Max = (value:string, max:number) =>{
    if(value.length < max) {
        return {
            isValid:true,
            message:"yay"
        }
    } else {
        return {
            isValid:false,
            message:"Is NOT MAX"
        }
    }
}
const In = (value:string, myEnum:string) =>{
    const MyEnum = myEnum.split(",")
    if(MyEnum.indexOf(value) !== -1) {
        return {
            isValid:true,
            message:"yay"
        }
    } else {
        return {
            isValid:false,
            message:"Is NOT " + MyEnum.join(",")
        }
    }
}
const URL = (value:string) =>{
    if(new RegExp("^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$").test(value)) {
        return {
            isValid:true,
            message:"yay"
        }
    } else {
        return {
            isValid:false,
            message:"Is NOT URL" 
        }
    }
}

export class Validator {
    private Errors:Map<string,string[]> = new Map();
    private Validators:Map<string,Function> = new Map();
    constructor() {
        this.Validators.set("Required",Required);
        this.Validators.set("Alphabet",Alphabet);
        this.Validators.set("Min", Min);
        this.Validators.set("Max", Max);
        this.Validators.set("In", In);
        this.Validators.set("URL", URL);
    }
    Validate(Schema:any, Data:any){
        this.Errors = new Map<string,string[]>();
        this.MainValidator(Schema, Data);
        return this.Errors;
    }
    private MainValidator(Schema:any, Data:any,Path?:string) {
        for (const key in Schema) {
            const Rule = Schema[key];
            const Node = (Path ? Path + "." : "") + key;
            const RuleData = Data ? Data[key] : {};
            const InputSchemaType:SchemaType | undefined = this.GetSchemaType(Rule);
            switch (InputSchemaType) {
                case SchemaType.object:
                    this.MainValidator(Rule, RuleData,key);
                    break;
                case SchemaType.array:
                    this.ArrayValidator(Rule[0],RuleData,key);
                    break;
                default:
                    this.InnerValidator(Rule, RuleData,Node);
                    break;
            }
        }
    }
    private ArrayValidator(Rule:any, Data:any, key?:string) {
        let index = 0;
        do {
            this.MainValidator(Rule, Data[index] , key+"."+index);
            index++
        } while ((Data || []).length > index);
       
    }
    private GetSchemaType(Rule:any):SchemaType | undefined {
        if (typeof Rule === "string") {
            return SchemaType.string;
        }
        else if (typeof Rule === "object" && !Array.isArray(Rule)) {
            return SchemaType.object;
        }
        else if (typeof Rule === "object" && Array.isArray(Rule)) {
            return SchemaType.array;
        }
        else {
            return;
        }
    }
    private InnerValidator(rules:any,value:any,Node:string) {
        const FnNameAndArgs = this.GetFnNameAndArgs(rules);
        for (let index = 0; index < FnNameAndArgs.length; index++) {
            const FnNameAndArg = FnNameAndArgs[index];
            const Result = this.Validators.get(FnNameAndArg.name)?.call(this,value,...FnNameAndArg.args)
            if(Result && !Result.isValid) {
                this.Errors.has(Node) ? 
                this.Errors.get(Node)?.push(Result.message) :
                this.Errors.set(Node,[Result.message]); 
            }
        }   
    }   
    private GetFnNameAndArgs(rules: any) {
        return rules.split('|').map((item:any) => {
            const V = item.split(':');
            const name = V[0]; V.shift();
            return { name, args: V };
        });
    }
}

export const Rules1 = {
    'Username': 'Required|Alphabet|Min:3|Max:100',
    'Password': 'Required|Alphabet|Min:3|Max:100',
    'Profile': {
        'Age': 'Required|Numeric',
        'Sex': 'Required|In:Male,Female',
    },
    'Photos': [ {'Url':'Required|URL'}]
} 

export const User = {
    'Username': 'w',
    'Password': 'w',
    'Profile': {  
        'Age' : 41,
        'Sex': 'Males',
    },
    'Photos': [{
        'Url': '_URL',
    },{
        'Url': 'www.google.com',
    }]
}
const User2 = {
    'Username': 'golkhandani',
    'Password': 'mrzg',
    'Profile': {
        'Age' : 41,
        'Sex': 'male',
    },
    'Photos': [{
    }]
}
const Rules2 = {
    'Username': 'Required|Alphabet|Min:3|Max:10',
    'Password': 'Required|Alphabet|Min:3|Max:10',
    'Profile': {
        'Age': 'Required|Numeric|Min:17|Max:99',
        'Sex': 'Required|In:Male,Female',
    },
} 
// const ValidatorInstance = new Validator();

// const MV1 = ValidatorInstance.Validate(Rules1,User);
// console.log("1", MV1.size == 0 ? "NO VALIDATION ERROR" : "VALIDATION ERROR" , MV1);

// const MV2 = ValidatorInstance.Validate(Rules2,User);
// console.log("2", MV2.size == 0 ? "NO VALIDATION ERROR" : "VALIDATION ERROR" , MV2);

// const MV3 = ValidatorInstance.Validate(Rules1,User2);
// console.log("3", MV3.size == 0 ? "NO VALIDATION ERROR" : "VALIDATION ERROR" , MV3);


//console.timeEnd("VALIDATOR")
