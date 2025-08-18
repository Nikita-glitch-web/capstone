import { Routes } from "@angular/router";
import { ListComponent } from './components/list/list.component';
import { EditComponent } from './components/edit/edit.component';


const routes: Routes = [
  { path: '', component: ListComponent },
  { path: 'new', component: EditComponent },
  { path: ':id', component: EditComponent },
];
