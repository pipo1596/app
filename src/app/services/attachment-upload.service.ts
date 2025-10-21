import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AttachmentUploadService {
  private baseUrl = environment.apiurl+'/cgi/APPFLUPL';

  constructor(private http: HttpClient) {}

  upload(file: File, mode: string, iofkey: string, iofile: string, desc: string): Observable<HttpEvent<any>> {

    this.baseUrl = environment.apiurl+'/cgi/APPFLUPL';

    if(mode){
      this.baseUrl += `?MODE=${mode}`
    }

    if(iofkey){
      this.baseUrl += `&FKEY=${iofkey}`
    }

    if(iofile){
      this.baseUrl += `&FILE=${iofile}`
    }

    if(desc){
      this.baseUrl += `&DESC=${desc}`
    }

    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.baseUrl}`, formData, {
      reportProgress: true,
      responseType: 'json',
    });

    return this.http.request(req);
  }
 
  uploadWyzywig(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    // Replace with your actual API endpoint
    return this.http.post<any>(`${this.baseUrl}`, formData, {
      headers: new HttpHeaders()
    });
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }
}