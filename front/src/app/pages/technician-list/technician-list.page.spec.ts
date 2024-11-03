import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TechnicianListPage } from './technician-list.page';

describe('TechnicianPage', () => {
    let component: TechnicianListPage;
    let fixture: ComponentFixture<TechnicianListPage>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TechnicianListPage],
        }).compileComponents();

        fixture = TestBed.createComponent(TechnicianListPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});