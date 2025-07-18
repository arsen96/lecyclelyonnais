import { ChangeDetectorRef, Component, NgZone, OnInit, ViewEncapsulation, ElementRef, ViewChild, Input, AfterViewInit, provideExperimentalZonelessChangeDetection, inject } from '@angular/core';
import { tileLayer, latLng, map, FeatureGroup, Control, Map, LatLng, circleMarker, Layer, Polygon, geoJSON } from 'leaflet';
import 'leaflet-draw'; // Importer le plugin leaflet-draw
import * as turf from '@turf/turf';  // Importer Turf.js
import { HttpClient } from '@angular/common/http'; // Ajoutez cet import
import { AlertController } from '@ionic/angular'; 
import { ZoneService } from 'src/app/services/zone.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Zones } from 'src/app/models/zones';
import { async } from 'rxjs';
import { Message, MessageService } from 'src/app/services/message.service';
import { ModalController } from '@ionic/angular';
import { TechnicianModalComponent } from './technician-modal/technician-modal.component';
import { Technician } from 'src/app/models/technicians';
import { TechnicianService } from 'src/app/services/technician.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ZoneModalComponent } from './zone-modal/zone-modal.component';
import { CompanyService } from 'src/app/services/company.service';

declare var google: any;

@Component({
  selector: 'app-leaflet',
  templateUrl: './leaflet.page.html',
  styleUrls: ['./leaflet.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LeafletPage {
  public newMapAdded = true;
  zoneName: string;
  map;

  zoneSelected: Zones;
  drawnItems = new FeatureGroup();
  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 7,
    center: latLng(46.603354, 1.888334)
  };
  addressValidated = false;

  zoneIdSelected: number;
  drawControl;

  mapReady: Promise<boolean>;
  private mapReadyResolver: (value: boolean | PromiseLike<boolean>) => void;

  searchTerm: string = '';
  filteredTechnicians = [];
  zoneAdded = false;
  public loaderService = inject(LoadingService);
  selectedInterventionType: string;
  public companyService = inject(CompanyService)

  constructor(private cd: ChangeDetectorRef, private technicianService: TechnicianService, private route: ActivatedRoute, public messageService: MessageService, private zoneService: ZoneService, public alertController: AlertController, public router: Router, private modalController: ModalController) {
    this.route.params.subscribe(params => {
      this.zoneIdSelected = Number(params['id']) ? Number(params['id']) : null;
      console.log(" this.zoneIdSelected this.zoneIdSelected", this.zoneIdSelected);
    });

    this.mapReady = new Promise<boolean>((resolve) => {
      this.mapReadyResolver = resolve;
    });
  }

 

  ngOnInit() {
    this.filteredTechnicians = this.zoneSelected?.technicians || [];
  }

  filterTechnicians() {
    console.log("this.searchTerm", this.searchTerm);
    if (this.searchTerm.trim() === '') {
      this.filteredTechnicians = this.zoneSelected?.technicians || [];
    } else {
      const normalizeString = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '');
      this.filteredTechnicians = this.zoneSelected?.technicians.filter(technician =>
        normalizeString(`${technician.first_name} ${technician.last_name}`).toLowerCase().includes(normalizeString(this.searchTerm).toLowerCase())
      );
    }
  }

  onMapReady(map: Map) {
    this.map = map;
    this.map.whenReady(() => {
      setTimeout(() => {
        this.map.invalidateSize();
        this.mapReadyResolver(true);
      }, 1500);
      this.configLeafletDraw();
    });
  }

  async configLeafletDraw() {
    if (this.zoneIdSelected) {
      await this.editeMap();
    }
    this.map.addLayer(this.drawnItems);

    const drawOptions = {
      edit: {
        featureGroup: this.drawnItems,
        edit: false,
        remove: !this.zoneSelected
      },
      draw: {
        polygon: !this.zoneSelected,
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
      }
    };

    this.drawControl = new (Control as any).Draw(drawOptions);

    if (!this.zoneSelected) {
      this.map.addControl(this.drawControl);
    }

    this.map.on('draw:created', async (event: any) => {
      if (this.zoneSelected) return;
      const layer = event.layer;
      this.drawnItems.addLayer(layer);
      const latLngs = layer.getLatLngs();
      const coordinates = latLngs[0].map((latlng: any) => [latlng.lng, latlng.lat]);
      coordinates.push(coordinates[0]);
      const polygon = turf.polygon([coordinates]);

      const areaInSquareKilometers = turf.area(polygon) / 1000000;
      if (areaInSquareKilometers > 200) {
        this.messageService.showToast("La zone que vous avez dessinée est trop grande.", Message.danger); 
        this.resetDrawing();
      } else {
        const wkt = this.convertToWKT(layer);
        try {
          const modalData = await this.openZoneModal();
          if (wkt && modalData) {
            this.loaderService.setLoading(true);
            this.zoneService.create(wkt, {...modalData,...this.companyService.subdomainREQ}).subscribe({
              next: (res: { success: boolean, message: string, zoneId: number }) => {
                this.zoneService.allZones = new Array();
                this.zoneService.get().then(() => {
                  this.zoneAdded = true;
                  this.zoneIdSelected = res.zoneId;
                  this.zoneSelected = this.zoneService.allZones.find(zone => zone.id === this.zoneIdSelected);
                  this.loaderService.setLoading(false);
                });
                this.drawControl.remove();
              },
              error: (error) => {
                this.loaderService.setLoading(false);
              }
            });
          }
          this.detectChange();
        } catch (err) {
          console.log("dismissed modal", err);
          this.resetDrawing();
        }
      }
      this.detectChange();
    });
  }

  async openZoneModal(edition = false): Promise<any> {
    const modal = await this.modalController.create({
      component: ZoneModalComponent,
      componentProps: {
        zoneSelected: this.zoneSelected,
        edition
      }
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();
     if (!data) {
      this.resetDrawing();
    } else if(data.zoneTitle.length > 0 && data.zoneTypeInterventionMaintenance && data.zoneTypeInterventionRepair){
    }else{
      this.resetDrawing();
    }

    return data;
  }

  public convertToWKT(layer: Layer): string {
    const coords = [];
    if (layer instanceof Polygon) {
      const latlngs = layer.getLatLngs()[0] as Array<any>;
      for (let i = 0; i < latlngs.length; i++) {
        coords.push(latlngs[i].lng + " " + latlngs[i].lat);
      };
      return "POLYGON((" + coords.join(",") + "," + latlngs[0].lng + " " + latlngs[0].lat + "))";
    }
    return null;
  }

  public detectChange() {
    this.cd.detectChanges();
  }

  resetDrawing() {
    this.drawnItems.clearLayers();
    this.zoneName = null;
  }

  public handleAddressChange(place: any) {
    if (place.geometry) {
      this.map.setView(new LatLng(place.geometry.location.lat(), place.geometry.location.lng()), 15);
      this.addressValidated = true; // Valider l'adresse
    }
  }

  setResult(ev) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
  }

  onCancel() {
    console.log("Ajout annulé !");
    this.resetDrawing();
  }

  async editeMap() {
    try {
      await this.zoneService.get();
      this.zoneSelected = this.zoneService.allZones.find(zone => zone.id === this.zoneIdSelected);

      if (this.zoneSelected) {
        const geoJsonData = {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: this.zoneSelected.geojson.coordinates
          }
        } as any;

        console.log("geoJsonData", geoJsonData);
        await this.mapReady;
        const layer = geoJSON(geoJsonData).addTo(this.map);
        this.map.fitBounds(layer.getBounds());
      }
    } catch (err) {
      console.log("err", err);
    }
  }

  async addTechnicians() {
    this.technicianService.technicians = new Array();
    await this.technicianService.get();
    const modal = await this.modalController.create({
      component: TechnicianModalComponent,
      componentProps: {
        zoneId: this.zoneIdSelected,
        currentZone: this.zoneSelected,
        technicians: this.technicianService.technicians.filter(t => !t.address)
      }
    });

    modal.onDidDismiss().then((data) => {
      this.technicianService.technicians = new Array();
      console.log("data", data);
    });

    return await modal.present();
  }

  removeTechnician(technicianId: number) {
    this.zoneService.removeTechnicianFromZone(this.zoneIdSelected, technicianId).subscribe({
      next: (res: any) => {
        this.zoneSelected.technicians = this.zoneSelected.technicians.filter(t => t.id !== technicianId);
        this.filterTechnicians();
        this.messageService.showToast(res.message, 'success');
      },
      error: (error) => {
        console.error("Erreur lors de la suppression du technicien", error);
      }
    });
  }

  onSidenavClose() {
    this.technicianService.technicians = new Array();
  }

  async setModelPlanification(){
    const modalData = await this.openZoneModal(true)
    console.log("modalData", modalData);
    if(modalData){
      this.zoneService.update(this.zoneIdSelected, modalData.zoneTitle, modalData.zoneTypeInterventionMaintenance, modalData.zoneTypeInterventionRepair).subscribe({
        next: (res: any) => {
          console.log("resresres", res);
          this.zoneSelected.model_planification.maintenance.id = modalData.zoneTypeInterventionMaintenance;
          this.zoneSelected.model_planification.repair.id = modalData.zoneTypeInterventionRepair;
          this.zoneSelected.zone_name = modalData.zoneTitle;
          this.messageService.showToast(res.message, 'success');
        },
        error: (error) => {
          this.messageService.showToast(error.message, 'danger');
        }
      });
    }
  }
}

