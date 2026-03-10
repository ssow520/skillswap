import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { Home } from './components/home/home';
import { Jobs } from './components/jobs/jobs';
import { JobDetail } from './components/job-detail/job-detail';
import { JobForm } from './components/job-form/job-form';
import { MyPostings } from './components/my-postings/my-postings';
import { MyBids } from './components/my-bids/my-bids';
import { Profile } from './components/profile/profile';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'jobs', component: Jobs },
  { path: 'jobs/new', component: JobForm, canActivate: [authGuard] },
  { path: 'jobs/:id', component: JobDetail, canActivate: [authGuard] },
  { path: 'my-postings', component: MyPostings, canActivate: [authGuard] },
  { path: 'my-bids', component: MyBids, canActivate: [authGuard] },
  { path: 'profile/:username', component: Profile },
  { path: '**', redirectTo: '' }
];