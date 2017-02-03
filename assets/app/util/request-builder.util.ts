import {Headers} from "@angular/http";
/**
 * Created by Thisum on 8/25/2016.
 */

export function getHeader(): Headers{

    var token = localStorage.getItem('token');
    return new Headers({'Content-Type': 'application/json', 'Auth-Token': token});
}