import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  users$: any;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.users$ = this.http.get('https://jsonplaceholder.typicode.com/users');
  }

}
