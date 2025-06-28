class ApiResponse{
    //this is unique respnse for every api call that it will return 
    //a status coed ,message and data 
    constructor(statusCode,data,message = "Success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode<400

        //status code are the measures to give the reesponse that what type of there is error and it can be 
        //used for many purpose like 
        //information response it will be between  to 100-199
        //for successful response it will be between 200 to 299
        //for client error it will be 400-499
        //server error it could be 500-599
        if (!this.success) {
            this.error = error || message;
        }
    }
}
export {ApiResponse}