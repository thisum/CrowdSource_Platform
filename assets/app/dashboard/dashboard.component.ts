import {Component, OnInit} from '@angular/core';
import {Request} from "../obj/Request";
import {RequestService} from "../services/request.service";

@Component({
    moduleId: module.id,
    selector: 'fr-dashboard',
    templateUrl: 'html/dashboard.component.html'
})
export class DashboardComponent implements OnInit {

    loadedCount = 0;
    requests:Request[] = [];

    constructor(private _requestService:RequestService) {
    }

    ngOnInit():void {
        this.onLoad();
    }

    onLoad() {
        this._requestService.loadRequests(this.loadedCount)
            .then(
                requests => {
                    this.requests = requests,
                        this.loadedCount += this.requests.length
                },
                error => console.error(error)
            )
    }

    onSubmitAns(request:Request) {

        var ans = {requestId: request.requestId, response: request.response};
        this._requestService.submitAnswer(ans)
            .then(requests => {
                    this.onLoad();
                },
                error => console.error(error)
            )
    }

}
