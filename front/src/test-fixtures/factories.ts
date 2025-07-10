
import { MOCK_ADMINS, MOCK_COMPANIES, MOCK_TECHNICIANS, MOCK_BICYCLES, MOCK_ZONES } from './mock-data';
export { MOCK_PLACES } from './mock-data';

export class AdminFactory {
  static create(overrides: Partial<any> = {}): any {
    return {
      ...MOCK_ADMINS.BASIC_ADMIN,
      ...overrides
    };
  }

  static createMultiple(count: number): any[] {
    return createMockArray(() => 
      this.create({ 
        id: Math.floor(Math.random() * 1000),
        email: `admin${Math.floor(Math.random() * 1000)}@example.com`
      }), 
      count
    );
  }

  static superAdmin(): any {
    return this.create({ role: 'superadmin' });
  }

  static withCompany(companyId: number): any {
    return this.create({ company_id: companyId });
  }
}

export class CompanyFactory {
  static create(overrides: Partial<any> = {}): any {
    return {
      ...MOCK_COMPANIES.COMPANY_A,
      ...overrides
    };
  }

  static createMultiple(count: number): any[] {
    return createMockArray(() => 
      this.create({ 
        id: Math.floor(Math.random() * 1000),
        name: `Company ${Math.floor(Math.random() * 1000)}`
      }), 
      count
    );
  }
}

export class TechnicianFactory {
  static create(overrides: Partial<any> = {}): any {
    return {
      ...MOCK_TECHNICIANS.BASIC_TECHNICIAN,
      ...overrides
    };
  }

  static createMultiple(count: number): any[] {
    return createMockArray(() => 
      this.create({ 
        id: Math.floor(Math.random() * 1000),
        email: `tech${Math.floor(Math.random() * 1000)}@example.com`
      }), 
      count
    );
  }

  // 🌟 NOUVELLES MÉTHODES spécialisées
  static forZone(zoneId: number): any {
    return this.create({ geographical_zone_id: zoneId });
  }

  static available(): any {
    return this.create({ is_available: true });
  }

  static unavailable(): any {
    return this.create({ is_available: false });
  }

  static formData(overrides: Partial<any> = {}): any {
    return {
      first_name: 'Test',
      last_name: 'Technician',
      email: 'test@tech.com',
      phone: '0123456789',
      address: '123 Test Street',
      geographical_zone_id: 1,
      ...overrides
    };
  }
}

export class BicycleFactory {
  static create(overrides: Partial<any> = {}): any {
    return {
      ...MOCK_BICYCLES.BASIC_BIKE,
      ...overrides
    };
  }

  static createMultiple(count: number): any[] {
    return createMockArray(() => 
      this.create({ 
        id: Math.floor(Math.random() * 1000),
        model: `Model ${Math.floor(Math.random() * 1000)}`
      }), 
      count
    );
  }
}
// Créateur de données multiples
export const createMockArray = <T>(factory: () => T, count: number): T[] => {
  return Array.from({ length: count }, factory);
};

// Créateur d'événements mock
export const createMockEvent = (value: string) => ({
  target: { value }
} as any);

// Créateur de pagination mock
export const createMockPageEvent = (pageIndex: number, pageSize: number) => ({
  pageIndex,
  pageSize
} as any);

// Créateur de tri mock
export const createMockSortEvent = (active: string, direction: 'asc' | 'desc' | '') => ({
  active,
  direction
} as any);



/**
 * Crée un spy jasmine pour un service avec des méthodes communes
 */
export const createServiceSpy = (serviceName: string, methods: string[] = []) => {
  const defaultMethods = ['get', 'create', 'update', 'delete'];
  const allMethods = [...new Set([...defaultMethods, ...methods])];
  return jasmine.createSpyObj(serviceName, allMethods);
};

/**
 * Crée un mock de LoadingService avec les méthodes communes
 */
export const createLoadingServiceSpy = () => 
  jasmine.createSpyObj('LoadingService', [
    'setLoading', 
    'showLoaderUntilCompleted'
  ]);

/**
 * Crée un mock de MessageService avec les méthodes communes
 */
export const createMessageServiceSpy = () => 
  jasmine.createSpyObj('MessageService', [
    'showToast', 
    'showMessage', 
    'clearMessage'
  ]);

/**
 * Crée un mock de Router avec les méthodes communes
 */
export const createRouterSpy = () => 
  jasmine.createSpyObj('Router', [
    'navigate', 
    'navigateByUrl'
  ]);

/**
 * Crée un mock d'ActivatedRoute
 */
export const createActivatedRouteSpy = (params: any = {}) => ({
  snapshot: { params },
  paramMap: { subscribe: jasmine.createSpy() }
});

/**
 * Crée un mock de ChangeDetectorRef
 */
export const createChangeDetectorRefSpy = () => 
  jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

// ========================================
// 📋 CONSTANTES UTILES
// ========================================

export const TEST_CONSTANTS = {
  // IDs de test communs
  IDS: {
    ADMIN: 1,
    COMPANY: 1,
    TECHNICIAN: 1,
    BIKE: 1,
    USER: 1,
    ZONE: 1
  },
  
  // Messages de test communs
  MESSAGES: {
    DELETE_SUCCESS: 'Item deleted successfully',
    CREATE_SUCCESS: 'Item created successfully',
    UPDATE_SUCCESS: 'Item updated successfully',
    FORM_INVALID: 'Veuillez remplir tous les champs requis.'
  },
  
  // Configuration de pagination
  PAGINATION: {
    PAGE_SIZES: [3, 6, 10, 15],
    DEFAULT_SIZE: 10
  },
  
  // Types d'intervention
  INTERVENTION_TYPES: ['Maintenance', 'Réparation'],
  
  // Statuts d'intervention
  INTERVENTION_STATUS: ['scheduled', 'in_progress', 'completed', 'canceled'],
  
  // Types de vélos
  BIKE_TYPES: ['Vélo classique', 'Vélo électrique (VAE)', 'VTT'],
  
  // Rôles d'utilisateur
  USER_ROLES: ['client', 'technician', 'admin', 'superadmin']
} as const;




import { MOCK_PLANNING_MODELS } from './mock-data';

export class PlanningModelFactory {
  static create(overrides: Partial<any> = {}): any {
    return {
      ...MOCK_PLANNING_MODELS.MAINTENANCE_MODEL,
      ...overrides
    };
  }

  static createMultiple(count: number): any[] {
    return createMockArray(() => 
      this.create({ 
        id: Math.floor(Math.random() * 1000),
        name: `Model ${Math.floor(Math.random() * 1000)}`
      }), 
      count
    );
  }

  static maintenance(): any {
    return this.create({ intervention_type: 'Maintenance' });
  }

  static repair(): any {
    return this.create({ intervention_type: 'Réparation' });
  }

  static weekdays(): any {
    return this.create({
      available_days: {
        monday: true, tuesday: true, wednesday: true, thursday: true, friday: true,
        saturday: false, sunday: false
      }
    });
  }

  static weekend(): any {
    return this.create({
      available_days: {
        monday: false, tuesday: false, wednesday: false, thursday: false, friday: false,
        saturday: true, sunday: true
      }
    });
  }

  static timeRange(startTime: string, endTime: string): any {
    return this.create({
      start_time: startTime,
      end_time: endTime
    });
  }

  static createAvailableDays(selectedDays: string[]): any {
    const allDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const availableDays: any = {};
    
    allDays.forEach(day => {
      availableDays[day] = selectedDays.includes(day);
    });
    
    return availableDays;
  }

  static formData(overrides: Partial<any> = {}): any {
    return {
      intervention_type: 'Maintenance',
      name: 'Test Model',
      start_time: 9,
      end_time: 17,
      slot_duration: 2,
      available_days: this.createAvailableDays(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']),
      ...overrides
    };
  }

}


export class ZoneFactory {
  static create(overrides: Partial<any> = {}): any {
    return {
      ...MOCK_ZONES.BASIC_ZONE,
      ...overrides
    };
  }

  static createMultiple(count: number): any[] {
    return createMockArray(() => 
      this.create({ 
        id: Math.floor(Math.random() * 1000),
        zone_name: `Zone ${Math.floor(Math.random() * 1000)}`
      }), 
      count
    );
  }

  static withTechnicians(technicianCount: number = 2): any {
    return this.create({
      technicians: TechnicianFactory.createMultiple(technicianCount)
    });
  }

  static empty(): any {
    return this.create({
      technicians: [],
      model_planification: { maintenance: {}, repair: {} }
    });
  }
}