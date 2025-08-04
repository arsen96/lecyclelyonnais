import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MessageService } from 'src/app/services/message.service';
import { LoadingService } from 'src/app/services/loading.service';
import { MatPaginator } from '@angular/material/paginator';
import { GlobalService, UserRole } from 'src/app/services/global.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-admins-list',
  templateUrl: './admins-list.page.html',
  styleUrls: ['./admins-list.page.scss'],
})
export class AdminsListPage implements OnInit {

  adminService: AdminService = inject(AdminService);

  displayedColumns: string[] = ['select', 'id', 'last_name', 'first_name', 'company_name', 'actions'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  public messageService = inject(MessageService);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public loaderService = inject(LoadingService);
  @ViewChild('paginator') paginator: MatPaginator;
  pageSizes = [3, 6, 10, 15];
  globalService = inject(GlobalService);
  adminsLoaded: Promise<boolean>;
  public companyService = inject(CompanyService)
  adminsLoadedResolver: (value: boolean) => void;

  constructor(public cd: ChangeDetectorRef) {
    this.adminsLoaded = new Promise((resolve) => {
      this.adminsLoadedResolver = resolve;
    });
  }

  /**
   * Charge et filtre les données des administrateurs selon le rôle utilisateur.
   */
  ionViewWillEnter() {
    this.loaderService.setLoading(true);
    this.adminService.get().then(() => {
      let admins;
      if (this.globalService.userRole?.getValue() === UserRole.ADMIN) {
        admins = this.adminService.allAdmins.filter((admin) => admin.company_id === this.companyService.currentCompany.id);
      } else {
        admins = this.adminService.allAdmins;
      }

      // Map company_id to company name
      admins = admins.map(admin => ({
        ...admin,
        company_name: this.companyService.getCompanyById(admin.company_id)?.name || 'Unknown'
      }));

      this.dataSource.data = admins;
      this.loaderService.setLoading(false);
      this.cd.detectChanges();
      this.adminsLoadedResolver(true);
    });
  }

  /**
   * Initialise le paginateur après chargement des données.
   */
  async ngAfterViewInit() {
    await this.adminsLoaded;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {}

  /**
   * Applique un filtre sur le tableau.
   * @param event - L'événement de saisie contenant la valeur du filtre
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Vérifie si tous les éléments sont sélectionnés.
   */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /**
   * Bascule la sélection de tous les éléments.
   */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /**
   * Supprime les administrateurs sélectionnés.
   * @param elementId - ID optionnel de l'élément à supprimer. Si non fourni, supprime tous les éléments sélectionnés
   */
  deleteSelected(elementId?: number) {
    const selectedIds = elementId ? [elementId] : this.selection.selected.map(item => item.id);
    const zoneRemoved$ = this.adminService.delete(selectedIds);
    const result = this.loaderService.showLoaderUntilCompleted(zoneRemoved$);
    result.subscribe({
      next: (response: any) => {
        this.dataSource.data = this.dataSource.data.filter(item => !selectedIds.includes(item.id));
        this.selection.clear();
        this.messageService.showToast(response.message, 'success');
      },
      error: message => {
        console.error('Delete error:', message);
        this.messageService.showToast(message, 'danger');
      }
    });
  }

  /**
   * Trie les données du tableau.
   * @param sort - L'objet de tri contenant la colonne active et la direction
   */
  sortData(sort: any) {
    if (!sort.active || sort.direction === '') {
      return;
    }

    const compare = (a: number | string, b: number | string, isAsc: boolean) => {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    this.dataSource.data = this.dataSource.data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'first_name':
          return compare(a.first_name, b.first_name, isAsc);
        case 'last_name':
          return compare(a.last_name, b.last_name, isAsc);
        case 'id':
          return compare(a.id, b.id, isAsc);
        default:
          return 0;
      }
    });
  }
}
