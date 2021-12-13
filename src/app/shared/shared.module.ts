import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {LoaderDirective} from './directives/loader.directive';


@NgModule({
  declarations: [LoaderDirective],
  imports: [
    CommonModule
  ],
  exports: [LoaderDirective]
})
export class SharedModule { }
