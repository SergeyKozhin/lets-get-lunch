import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { of } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

class MockRouter {
  navigate =
    jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true));
}

class MockAuthService {
  loggedIn = of();

  logout = jasmine.createSpy('logout');

  isLoggedIn() { }
}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    authService = fixture.debugElement.injector.get(AuthService);
    router = fixture.debugElement.injector.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with a user who is logged in', () => {
    beforeEach(() => {
      authService.isLoggedIn = jasmine.createSpy('isLoggedIn').and.returnValue(true);
      fixture.detectChanges();
    });

    it('should initialize to see if a user is logged in', () => {
      expect(authService.isLoggedIn).toHaveBeenCalled();
      expect(component.isLoggedIn).toEqual(true);
    });

    it('should have a link to dashboard when clicking the brand name', () => {
      const liink = fixture.debugElement.query(By.css('.navbar-brand'));
      expect(liink.attributes.routerLink).toEqual('/dashboard');
    });

    it('should have a link to logout visible', () => {
      const link = fixture.debugElement.query(By.css('[data-test=logout]'));
      expect(link.nativeElement.innerText).toEqual('Logout');
    });

    it('should navigate to home page when logout is clicked', () => {
      component.logout();
      expect(authService.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('with a user who is not logged in', () => {
    beforeEach(() => {
      authService.isLoggedIn = jasmine.createSpy('isLoggedIn').and.returnValue(false);
      fixture.detectChanges();
    });

    it('should initialize to see if a user is logged in', () => {
      expect(authService.isLoggedIn).toHaveBeenCalled();
      expect(component.isLoggedIn).toEqual(false);
    });

    it('should have a link to home page when clicking the brand name', () => {
      const liink = fixture.debugElement.query(By.css('.navbar-brand'));
      expect(liink.attributes.routerLink).toEqual('');
    });

    it('should have a link to signup visible', () => {
      const link = fixture.debugElement.query(By.css('[data-test=signup]'));
      expect(link.nativeElement.innerText).toEqual('Signup');
    });
  });
});
