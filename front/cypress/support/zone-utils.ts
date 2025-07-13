// Données de test pour les zones
export const testZones = {
    validZones: [
        {
          id: 29,
          zone_name: "Université de Pau",
          created_at: "2025-01-09",
          geojson: "{\"type\":\"Polygon\",\"coordinates\":[[[-0.380450362,43.319950352],[-0.354825774,43.31901357],[-0.345897944,43.304991335],[-0.371951755,43.301399374],[-0.383798298,43.302117783],[-0.380450362,43.319950352]]]}",
          technicians: [
            {
              id: 74,
              first_name: "Jean",
              last_name: "Dupont"
            }
          ],
          model_planification: {
            maintenance: {
              id: 18,
              type: "Maintenance",
              available_days: "{\"monday\":true,\"tuesday\":true,\"wednesday\":true,\"thursday\":false,\"friday\":false,\"saturday\":false,\"sunday\":false}",
              slot_duration: "01:00:00",
              start_time: "09:00:00",
              end_time: "18:00:00"
            },
            repair: {
              id: 19,
              type: "Réparation",
              available_days: "{\"monday\":true,\"tuesday\":true,\"wednesday\":true,\"thursday\":true,\"friday\":true,\"saturday\":null,\"sunday\":null}",
              slot_duration: "01:36:00",
              start_time: "09:00:00",
              end_time: "18:00:00"
            }
          }
        },
        {
          id: 30,
          zone_name: "alsace lorraine",
          created_at: "2025-01-10",
          geojson: "{\"type\":\"Polygon\",\"coordinates\":[[[-0.389827487,43.315735748],[-0.349070018,43.314767651],[-0.341390428,43.296121377],[-0.392530486,43.296246329],[-0.389827487,43.315735748]]]}",
          technicians: [],
          model_planification: {
            maintenance: {
              id: 20,
              type: "Maintenance",
              available_days: "{\"monday\":true,\"tuesday\":false,\"wednesday\":false,\"thursday\":true,\"friday\":true,\"saturday\":false,\"sunday\":false}",
              slot_duration: "01:30:00",
              start_time: "09:00:00",
              end_time: "18:00:00"
            },
            repair: {
              id: 19,
              type: "Réparation",
              available_days: "{\"monday\":true,\"tuesday\":true,\"wednesday\":true,\"thursday\":true,\"friday\":true,\"saturday\":null,\"sunday\":null}",
              slot_duration: "01:36:00",
              start_time: "09:00:00",
              end_time: "18:00:00"
            }
          }
        },
        {
          id: 31,
          zone_name: "Billere",
          created_at: "2025-07-09",
          geojson: "{\"type\":\"Polygon\",\"coordinates\":[[[-0.397956066,43.30215531],[-0.396003284,43.308212799],[-0.383685736,43.30733856],[-0.388878849,43.298173899],[-0.397956066,43.30215531]]]}",
          technicians: [
            {
              id: 75,
              first_name: "Michel",
              last_name: "Durand"
            }
          ],
          model_planification: {
            maintenance: {
              id: 18,
              type: "Maintenance",
              available_days: "{\"monday\":true,\"tuesday\":true,\"wednesday\":true,\"thursday\":false,\"friday\":false,\"saturday\":false,\"sunday\":false}",
              slot_duration: "01:00:00",
              start_time: "09:00:00",
              end_time: "18:00:00"
            },
            repair: {
              id: 19,
              type: "Réparation",
              available_days: "{\"monday\":true,\"tuesday\":true,\"wednesday\":true,\"thursday\":true,\"friday\":true,\"saturday\":null,\"sunday\":null}",
              slot_duration: "01:36:00",
              start_time: "09:00:00",
              end_time: "18:00:00"
            }
          }
        }
      ]
  };
  
  // Configuration des mocks pour les APIs
  export const setupZoneMocks = () => {
    // Mock récupération des zones
    cy.intercept('GET', '**zones/get?domain=null', {
      statusCode: 200,
      body: {
        success: true,
        data: testZones.validZones
      }
    }).as('getZones');
  
  
    // Mock suppression de plusieurs zones
    cy.intercept('POST', '**/zones/delete', (req) => {
      const { ids } = req.body;
      const message = ids.length > 1 ? 'Les zones ont été supprimées' : 'Zone supprimée avec succès';
      
      req.reply({
        statusCode: 200,
        body: {
          success: true,
          message
        }
      });
    }).as('deleteZones');
  
  };
  
  // Configuration des mocks d'erreur
  export const setupErrorMocks = () => {
    cy.intercept('GET', '**/zones/get?domain=null', {
      statusCode: 500,
      body: {
        success: false,
        message: 'Erreur lors du chargement des zones'
      }
    }).as('getZonesError');
  
    cy.intercept('POST', '**/zones/delete?domain=null', {
      statusCode: 500,
      body: {
        success: false,
        message: 'Erreur lors de la suppression'
      }
    }).as('deleteZoneError');
  };
  
  // Vérifier que la liste des zones est chargée
  export const verifyZonesList = () => {
    cy.wait('@getZones');
    cy.get('table').should('be.visible');
    cy.get(".table-container").should('be.visible');
  };
  
  // Rechercher une zone par nom
  export const searchZone = (searchTerm: string) => {
    if (searchTerm) {
      cy.get('ion-input').type(searchTerm);
    }
    cy.wait(300);
  };
  
  
  export const selectZoneByName = (zoneName: string) => {
    cy.contains('tr[mat-row]', zoneName).find('mat-checkbox').click();
  };

  // Supprimer les zones sélectionnées
  export const deleteSelectedZones = () => {
    cy.get('ion-button[color="danger"]').contains('Supprimer').click();
  };
  

  // Vérifier le nombre de zones
  export const verifyZoneCount = (expectedCount: number) => {
    cy.get('tr[mat-row]').should('have.length', expectedCount);
  };

  // Vérifier que la zone n'est pas visible
  export const verifyZoneNotVisible = (zoneName: string) => {
  cy.contains('tr[mat-row]', zoneName).should('not.exist');
};

  // Vérifier que la zone est visible
export const verifyZoneVisible = (zoneName: string) => {
    cy.contains('tr[mat-row]', zoneName).should('be.visible');
  };

  // Supprimer une zone par son nom
  export const deleteZoneByName = (zoneName: string) => {
    cy.contains('tr[mat-row]', zoneName).find('ion-button[color="danger"]').click();
  };
  
  // Vérifier que la liste des zones est vide
  export const verifyEmptyState = () => {
    cy.contains('Aucune zone trouvée').should('be.visible');
  };
  
  // Vérifier qu'une zone a été supprimée avec succès
  export const verifyZoneDeleted = (message: string) => {
    cy.get('[data-cy="success-toast"]').should('be.visible');
    cy.contains(message).should('be.visible');
  };
  
  // Vérifier l'affichage d'un message d'erreur
  export const verifyErrorMessage = (message: string) => {
    cy.get('[data-cy="error-toast"]').should('be.visible');
    cy.contains(message).should('be.visible');
  };
  


  

  


  

