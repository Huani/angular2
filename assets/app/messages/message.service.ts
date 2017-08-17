import {Message} from "./message.model";
import {Http, Response, Headers} from "@angular/http";
import {EventEmitter, Injectable} from "@angular/core";
import 'rxjs';
import {Observable} from "rxjs/Observable";
import {ErrorService} from "../errors/error.service";

@Injectable() //import metaData
export class MessageService {
    private messages: Message[] = [];
    messageIsEdit = new EventEmitter<Message>();

    //injection
    constructor(private http: Http, private errorService :ErrorService) {
    }

    addMessage(message: Message) {
        const body = JSON.stringify(message);
        const headers = new Headers({'Content-Type': 'application/json'});
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        //return the observable
        //include the token for auther
        return this.http.post('https://angular2deploy.herokuapp.com/message' + token, body, {headers: headers}) //set the observable doesn't send the req yet.
            .map((response: Response) =>{
                const result= response.json(); //map --> transform the req data
                const message= new Message(
                    result.obj.content,
                    result.obj.user.firstName,  //got a User obj by the returning result
                    result.obj._id,
                    result.obj.user._id);
                this.messages.push(message);
                return message;
        })
            .catch((error: Response) =>{
                this.errorService.handleError(error.json()); //run own error message
                return Observable.throw(error.json());
                });
    }

    getMessages() {
        return this.http.get('https://angular2deploy.herokuapp.com/message')
            .map((response: Response) => {
                const messages = response.json().obj;
                let transformedMessages: Message[] = [];
                for (let message of messages) {
                    transformedMessages.push(new Message(
                        message.content,
                        message.user.firstName,  //firstName --> in the populate method(messages.js) back end
                        message._id,
                        message.user._id)
                    );

                }
                this.messages = transformedMessages;

                return transformedMessages; //return the observable
            })
            .catch((error: Response) =>{
                this.errorService.handleError(error.json()); //run own error message
                return Observable.throw(error.json());
            });
    }

    editMessage(message: Message) {
        this.messageIsEdit.emit(message);
    }

    updateMessage(message: Message) {
        this.messages.push(message);
        const body = JSON.stringify(message);
        const headers = new Headers({'Content-Type': 'application/json'});
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';

        //return the observable
        return this.http.patch('https://angular2deploy.herokuapp.com/message/' + message.messageId + token, body, {headers: headers}) //set the observable doesn't send the req yet.
            .map((response: Response) => response.json()) //map --> transform the req data
            .catch((error: Response) =>{
                this.errorService.handleError(error.json()); //run own error message
                return Observable.throw(error.json());
            });
    }

    deleteMessage(message: Message) {
        this.messages.splice(this.messages.indexOf(message), 1);
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        //call the delete route in the back-end
        return this.http.delete('https://angular2deploy.herokuapp.com/message/' + message.messageId + token) //set the observable doesn't send the req yet.
            .map((response: Response) => response.json()) //map --> transform the req data
            .catch((error: Response) =>{
                this.errorService.handleError(error.json()); //run own error message
                return Observable.throw(error.json());
            });
    }
}