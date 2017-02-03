/**
 * Created by Thisum on 8/12/2016.
 */
export class User {
    
    constructor(public email: string, 
                public password: string, 
                public firstName?: string, 
                public lastName?: string
                ) {}
}