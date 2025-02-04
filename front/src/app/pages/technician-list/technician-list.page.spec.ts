import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TechnicianListPage } from './technician-list.page';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('TechnicianListPage', () => {
    let component: TechnicianListPage;
    let fixture: ComponentFixture<TechnicianListPage>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TechnicianListPage],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TechnicianListPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});