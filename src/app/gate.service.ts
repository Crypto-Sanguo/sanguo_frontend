import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../environments/environment'


@Injectable({ providedIn: 'root' })
export class GateService {

  constructor(private http: HttpClient) {
  }

  _iost: any = null;

  setIOST(iost: any) {
    this._iost = iost;
  }

  loadUrl(url): Observable<string> {
    const options: Object = {
      responseType: 'text'
    };
    return this.http.get<any>(url, options)
      .pipe(
        catchError(this.handleError('loadUrl', []))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error && error.error && error.error.message) {
        return throwError(error.error.message);
      } else {
        return throwError('Unknow error.');
      }
    };
  }

  getHTTP(url: string): Observable<any> {
    return this.http.get<any>(url)
      .pipe(
        catchError(this.handleError('getHTTP', []))
      );
  }

  async myRequest(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getHTTP(url).subscribe(obj => {
        resolve(obj);
      });
    });
  }

  async getUnits(sortByPrice: number, seller: string, unitId: number, limit: number, offset: number): Promise<Array<any>> {
    const url = 'http://154.197.26.233:10000/get_units?' +
        'sortByPrice=' + sortByPrice +
        '&seller=' + seller +
        '&unitId=' + unitId +
        '&limit=' + limit +
        '&offset=' + offset;
    return await this.myRequest(url);
  }

  async getItems(sortByPrice: number, seller: string, itemId: number, limit: number, offset: number): Promise<Array<any>> {
    const url = 'http://154.197.26.233:10000/get_items?' +
        'sortByPrice=' + sortByPrice +
        '&seller=' + seller +
        '&itemId=' + itemId +
        '&limit=' + limit +
        '&offset=' + offset;
    return await this.myRequest(url);
  }

  async getLandRents(sortByPrice: number, limit: number, offset: number): Promise<Array<any>> {
    const url = 'http://154.197.26.233:10000/get_land_rents?' +
        'sortByPrice=' + sortByPrice +
        '&limit=' + limit +
        '&offset=' + offset;
    return await this.myRequest(url);
  }

  async getLandSells(sortByPrice: number, limit: number, offset: number): Promise<Array<any>> {
    const url = 'http://154.197.26.233:10000/get_land_sells?' +
        'sortByPrice=' + sortByPrice +
        '&limit=' + limit +
        '&offset=' + offset;
    return await this.myRequest(url);
  }

  async getRankData(type: string, limit: number, offset: number, who: string): Promise<Array<any>> {
    const url = 'http://154.197.26.233:10000/get_rank_data?' +
        'type=' + type +
        '&limit=' + limit +
        '&offset=' + offset +
        '&who=' + who;
    return await this.myRequest(url);
  }

  async getUsersWithNoFarms(limit: number, offset: number): Promise<Array<any>> {
    const url = 'http://154.197.26.233:10000/get_users_with_no_farms?' +
        '&limit=' + limit +
        '&offset=' + offset;
    return await this.myRequest(url);
  }
}
