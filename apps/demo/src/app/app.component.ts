import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { catchError, map, of, throwError } from 'rxjs';

@Component({
  selector: 'hickorytechnology-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'demo';

  constructor(private http: HttpClient) { }

  public ngOnInit(): void {
    this.http.get('https://jsonplaceholder.typicode.com/posts').pipe(
      map((results) => console.log(results)),
      catchError((error) => throwError(() => new Error(error)))
    ).subscribe();
  }
}
