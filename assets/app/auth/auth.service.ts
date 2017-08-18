import{User} from "./user.model";
import{Injectable} from "@angular/core";
import{Http, Headers, Response} from "@angular/http";
import 'rxjs/Rx';
import {Observable} from 'rxjs';
import {ErrorService} from "../errors/error.service";





@Injectable() //can inject this service to other services
export class AuthService{
    constructor(private http: Http, private errorService : ErrorService){

    }
    signup(user:User){
        const body = JSON.stringify(user);

        //to let the back-end know it's a JSON data
        const headers = new Headers({'Content-Type' : 'application/json'});
        //return an observable
        return this.http.post('https://angular2applic.herokuapp.com/user',body, {headers:headers})
            .map((response:Response) => response.json())
            .catch((error: Response) =>{
                this.errorService.handleError(error.json()); //run own error message
                return Observable.throw(error.json());
            });
    }

    signin(user:User){
        const body = JSON.stringify(user);

        //to let the back-end know it's a JSON data
        const headers = new Headers({'Content-Type' : 'application/json'});
        //return an observable
        return this.http.post('https://angular2applic.herokuapp.com/user/signin',body, {headers:headers})
            .map((response:Response) => response.json())
            .catch((error: Response) =>{
                this.errorService.handleError(error.json()); //run own error message
                return Observable.throw(error.json());
            });
        }


    logout(){
        localStorage.clear(); //delete user id and token
    }

    isLoggedIn(){
        return localStorage.getItem('token') !==null;

    }
}