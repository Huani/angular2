var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Message } from "./message.model";
import { Http, Headers } from "@angular/http";
import { EventEmitter, Injectable } from "@angular/core";
import 'rxjs';
import { Observable } from "rxjs/Observable";
import { ErrorService } from "../errors/error.service";
var MessageService = (function () {
    //injection
    function MessageService(http, errorService) {
        this.http = http;
        this.errorService = errorService;
        this.messages = [];
        this.messageIsEdit = new EventEmitter();
    }
    MessageService.prototype.addMessage = function (message) {
        var _this = this;
        var body = JSON.stringify(message);
        var headers = new Headers({ 'Content-Type': 'application/json' });
        var token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        //return the observable
        //include the token for auther
        return this.http.post('https://angular2applic.herokuapp.com/message' + token, body, { headers: headers }) //set the observable doesn't send the req yet.
            .map(function (response) {
            var result = response.json(); //map --> transform the req data
            var message = new Message(result.obj.content, result.obj.user.firstName, //got a User obj by the returning result
            result.obj._id, result.obj.user._id);
            _this.messages.push(message);
            return message;
        })
            .catch(function (error) {
            _this.errorService.handleError(error.json()); //run own error message
            return Observable.throw(error.json());
        });
    };
    MessageService.prototype.getMessages = function () {
        var _this = this;
        return this.http.get('https://angular2applic.herokuapp.com/message')
            .map(function (response) {
            var messages = response.json().obj;
            var transformedMessages = [];
            for (var _i = 0, messages_1 = messages; _i < messages_1.length; _i++) {
                var message = messages_1[_i];
                transformedMessages.push(new Message(message.content, message.user.firstName, //firstName --> in the populate method(messages.js) back end
                message._id, message.user._id));
            }
            _this.messages = transformedMessages;
            return transformedMessages; //return the observable
        })
            .catch(function (error) {
            _this.errorService.handleError(error.json()); //run own error message
            return Observable.throw(error.json());
        });
    };
    MessageService.prototype.editMessage = function (message) {
        this.messageIsEdit.emit(message);
    };
    MessageService.prototype.updateMessage = function (message) {
        var _this = this;
        this.messages.push(message);
        var body = JSON.stringify(message);
        var headers = new Headers({ 'Content-Type': 'application/json' });
        var token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        //return the observable
        return this.http.patch('https://angular2applic.herokuapp.com/message/' + message.messageId + token, body, { headers: headers }) //set the observable doesn't send the req yet.
            .map(function (response) { return response.json(); }) //map --> transform the req data
            .catch(function (error) {
            _this.errorService.handleError(error.json()); //run own error message
            return Observable.throw(error.json());
        });
    };
    MessageService.prototype.deleteMessage = function (message) {
        var _this = this;
        this.messages.splice(this.messages.indexOf(message), 1);
        var token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        //call the delete route in the back-end
        return this.http.delete('https://angular2applic.herokuapp.com/message/' + message.messageId + token) //set the observable doesn't send the req yet.
            .map(function (response) { return response.json(); }) //map --> transform the req data
            .catch(function (error) {
            _this.errorService.handleError(error.json()); //run own error message
            return Observable.throw(error.json());
        });
    };
    MessageService = __decorate([
        Injectable() //import metaData
        ,
        __metadata("design:paramtypes", [Http, ErrorService])
    ], MessageService);
    return MessageService;
}());
export { MessageService };
