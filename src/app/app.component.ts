import { Component, OnInit, isDevMode } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'ms-dynamic-qrcode-gui';

  ngOnInit() {

  	if(isDevMode()) {
  		console.log('Development environment');
  	} else {
  		console.log('Production environment');
  	}

  }
 

}
