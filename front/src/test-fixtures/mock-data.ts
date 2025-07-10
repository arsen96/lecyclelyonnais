export const MOCK_COMPANIES = {
    COMPANY_A: {
      id: 1,
      name: 'Company A',
      email: 'contact@company-a.com',
      subdomain: 'company-a',
      theme_color: '#ff0000',
      phone: '0123456789',
    },
    COMPANY_B: {
      id: 2,
      name: 'Company B',
      email: 'contact@company-b.com',
      subdomain: 'company-b',
      theme_color: '#00ff00',
      phone: '0987654321',
    },
    COMPANY_WITHOUT_SUBDOMAIN: {
      id: 3,
      name: 'Company Without Subdomain',
      email: 'contact@no-subdomain.com',
      subdomain: null,
      theme_color: '#0000ff',
      phone: '0555123456',
      created_at: '2023-03-01'
    }
  } as const;
  

  export const MOCK_ADMINS = {
    BASIC_ADMIN: {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'admin' as const,
      company_id: 1
    },
    SUPER_ADMIN: {
      id: 2,
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane@example.com',
      password: 'password123',
      role: 'superadmin' as const,
      company_id: 1
    },
    ADMIN_COMPANY_B: {
      id: 3,
      first_name: 'Bob',
      last_name: 'Wilson',
      email: 'bob@company-b.com',
      password: 'password123',
      role: 'admin' as const,
      company_id: 2
    }
  } as const;
  

  export const MOCK_TECHNICIANS = {
    BASIC_TECHNICIAN: {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone: '0123456789',
      address: '123 Main St',
      created_at: '2023-01-01',
      is_available: true,
      geographical_zone_id: 1
    },
    TECHNICIAN_ZONE_2: {
      id: 2,
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane@example.com',
      phone: '0987654321',
      address: '456 Oak Ave',
      created_at: '2023-02-01',
      is_available: true,
      geographical_zone_id: 2
    },
    TECHNICIAN_NO_ZONE: {
      id: 3,
      first_name: 'Bob',
      last_name: 'Johnson',
      email: 'bob@example.com',
      phone: '0555123456',
      address: '789 Pine St',
      created_at: '2023-03-01',
      is_available: true,
      geographical_zone_id: null
    }
  } as const;
  

  export const MOCK_BICYCLES = {
    BASIC_BIKE: {
      id: 1,
      brand: 'Trek',
      model: 'Domane',
      year: 2023,
      type: 'Vélo classique'
    },
    ELECTRIC_BIKE: {
      id: 2,
      brand: 'Giant',
      model: 'Escape',
      year: 2022,
      type: 'Vélo électrique (VAE)'
    },
    MOUNTAIN_BIKE: {
      id: 3,
      brand: 'Specialized',
      model: 'Rockhopper',
      year: 2024,
      type: 'VTT'
    }
  } as const;
  

  export const MOCK_USERS = {
    BASIC_USER: {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone: '0123456789',
      address: '123 Main St',
      role: 'client' as const
    },
    USER_B: {
      id: 2,
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane@example.com',
      phone: '0987654321',
      address: '456 Oak Ave',
      role: 'client' as const
    }
  } as const;
  

  export const MOCK_PLANNING_MODELS = {
    MAINTENANCE_MODEL: {
      id: 1,
      name: 'Maintenance Standard',
      intervention_type: 'Maintenance',
      start_time: '08:00',
      end_time: '17:00',
      slot_duration: { hours: 2, minutes: 0 },
      available_days: {
        monday: true,
        tuesday: true,
        wednesday: false,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false
      }
    },
    REPAIR_MODEL: {
      id: 2,
      name: 'Réparation Express',
      intervention_type: 'Réparation',
      start_time: '09:00',
      end_time: '18:00',
      slot_duration: { hours: 1, minutes: 30 },
      available_days: {
        monday: false,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: false,
        saturday: true,
        sunday: false
      }
    }
  } as const;
  
 
  export const MOCK_ZONES = {
    BASIC_ZONE: {
      id: 1,
      zone_name: 'Zone A',
      created_at: '2023-01-01',
      geojson: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]
            }
          }
        ]
      },
      model_planification: {
        maintenance: {
          id: 1,
          available_days: '{"monday":true,"tuesday":true}',
          start_time: '09:00',
          end_time: '17:00',
          slot_duration: '2:00'
        },
        repair: {
          id: 2,
          available_days: '{"tuesday":true,"wednesday":true}',
          start_time: '10:00',
          end_time: '18:00',
          slot_duration: '1:30'
        }
      },
      technicians: [
        { id: 1, first_name: 'John', last_name: 'Doe' },
        { id: 2, first_name: 'Jane', last_name: 'Smith' }
      ]
    },
    ZONE_B: {
      id: 2,
      zone_name: 'Zone B',
      created_at: '2023-02-01',
      geojson: {
        type: 'FeatureCollection',
        features: []
      },
      model_planification: {
        maintenance: {},
        repair: {}
      },
      technicians: []
    }
  } as const;
  

  export const MOCK_INTERVENTIONS = {
    PAST_MAINTENANCE: {
      id: 1,
      type: 'Maintenance',
      description: 'Maintenance complète du vélo',
      status: 'completed',
      appointment_start: new Date('2023-01-15T09:00:00'),
      appointment_end: new Date('2023-01-15T11:00:00'),
      client_id: 1,
      created_at: new Date('2023-01-10'),
      technician: MOCK_TECHNICIANS.BASIC_TECHNICIAN,
      bicycle: MOCK_BICYCLES.BASIC_BIKE,
      client_info: MOCK_USERS.BASIC_USER,
      photos: ['photo1.jpg', 'photo2.jpg'],
      technician_photos: ['tech_photo1.jpg'],
      uploadedPhotos: [],
      comments: ['Travail effectué correctement']
    },
    UPCOMING_REPAIR: {
      id: 2,
      type: 'Reparation',
      description: 'Réparation de la chaîne',
      status: 'scheduled',
      appointment_start: new Date('2024-02-15T14:00:00'),
      appointment_end: new Date('2024-02-15T15:30:00'),
      client_id: 1,
      created_at: new Date(),
      technician: MOCK_TECHNICIANS.TECHNICIAN_ZONE_2,
      bicycle: MOCK_BICYCLES.ELECTRIC_BIKE,
      client_info: MOCK_USERS.BASIC_USER,
      photos: [],
      technician_photos: [],
      uploadedPhotos: [],
      comments: []
    },
    ONGOING_INTERVENTION: {
      id: 3,
      type: 'Maintenance',
      description: 'Maintenance en cours',
      status: 'in_progress',
      appointment_start: new Date(),
      appointment_end: new Date(Date.now() + 2 * 60 * 60 * 1000), // +2h
      client_id: 2,
      created_at: new Date(),
      technician: MOCK_TECHNICIANS.BASIC_TECHNICIAN,
      bicycle: MOCK_BICYCLES.MOUNTAIN_BIKE,
      client_info: MOCK_USERS.USER_B,
      photos: ['model_photo.jpg'],
      technician_photos: [],
      uploadedPhotos: ['uploaded1.jpg', 'uploaded2.jpg'],
      comments: []
    }
  } as const;
  

  export const TEST_CONFIG = {
    PAGINATION: {
      PAGE_SIZES: [3, 6, 10, 15],
      DEFAULT_PAGE_SIZE: 10
    },
    MESSAGES: {
      DELETE_SUCCESS: 'Item deleted successfully',
      CREATE_SUCCESS: 'Item created successfully', 
      UPDATE_SUCCESS: 'Item updated successfully',
      FORM_INVALID: 'Veuillez remplir tous les champs requis.',
      ADDRESS_INVALID: 'Veuillez sélectionner une adresse valide.',
      PASSWORD_RESET: 'Veuillez entrer un nouveau mot de passe.'
    },
    BIKE_TYPES: [
      'Vélo classique',
      'Vélo électrique (VAE)',
      'VTT (Vélo tout-terrain)'
    ],
    USER_ROLES: {
      CLIENT: 'client',
      TECHNICIAN: 'technician', 
      ADMIN: 'admin',
      SUPERADMIN: 'superadmin'
    },
    INTERVENTION_TYPES: {
      MAINTENANCE: 'Maintenance',
      REPAIR: 'Reparation'
    },
    INTERVENTION_STATUS: {
      SCHEDULED: 'scheduled',
      IN_PROGRESS: 'in_progress',
      COMPLETED: 'completed',
      CANCELED: 'canceled'
    }
  } as const;
  

  export const MOCK_API_RESPONSES = {
    DELETE_SUCCESS: { message: 'Deleted successfully' },
    CREATE_SUCCESS: { message: 'Created successfully' },
    UPDATE_SUCCESS: { message: 'Updated successfully' },
    LOGIN_SUCCESS: { 
      token: 'fake-jwt-token',
      data: { user: MOCK_ADMINS.BASIC_ADMIN }
    },
    ADDRESS_IN_ZONE: { 
      success: 1, 
      message: 'Address is in zone' 
    },
    ADDRESS_NOT_IN_ZONE: { 
      success: false, 
      message: 'Address not in zone' 
    },
    VALIDATION_ERROR: {
      error: 'Validation failed',
      message: 'Please check your input'
    }
  } as const;
  

  export const SORTING_TEST_DATA = {
    ADMINS: [
      { id: 2, first_name: 'Zebra', last_name: 'Last' },
      { id: 1, first_name: 'Alpha', last_name: 'First' }
    ],
    TECHNICIANS: [
      { id: 2, first_name: 'Zebra', last_name: 'Last', created_at: '2023-02-01' },
      { id: 1, first_name: 'Alpha', last_name: 'First', created_at: '2023-01-01' }
    ],
    COMPANIES: [
      { id: 2, name: 'Zebra Company', subdomain: 'zebra', created_at: '2023-02-01' },
      { id: 1, name: 'Alpha Company', subdomain: 'alpha', created_at: '2023-01-01' }
    ],
    BIKES: [
      { id: 2, brand: 'Zebra', model: 'Z-Model', created_at: '2023-02-01' },
      { id: 1, brand: 'Alpha', model: 'A-Model', created_at: '2023-01-01' }
    ]
  } as const;
  
  
  export const MOCK_PLACES = {
    VALID_PLACE: {
      geometry: { location: {} },
      formatted_address: '123 Test Street, Paris, France'
    },
    INVALID_PLACE: {
      formatted_address: '123 Invalid Street'
    }
  } as const;
  

  export const FORM_TEST_DATA = {
    VALID_ADMIN_FORM: {
      first_name: 'Test',
      last_name: 'Admin',
      email: 'test@example.com',
      password: 'password123',
      company_id: 1
    },
    INVALID_ADMIN_FORM: {
      first_name: '',
      last_name: '',
      email: 'invalid-email',
      password: '123', 
      company_id: ''
    },
    VALID_BIKE_FORM: {
      brand: 'Test Brand',
      model: 'Test Model',
      year: '2023',
      type: 'Vélo classique'
    },
    VALID_COMPANY_FORM: {
      name: 'Test Company',
      email: 'test@company.com',
      subdomain: 'test',
      theme_color: '#ff0000',
      phone: '0123456789'
    }
  } as const;