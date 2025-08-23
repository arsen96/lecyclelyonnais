
require('dotenv').config();

const MAIN_TEST_COMPANY_ID = 10;

const isTestEnvironment = process.env.NODE_ENV === 'test';

process.env.DB_HOST = 'localhost';
process.env.DB_PORT = 5434;  // Port mappé sur l'hôte
process.env.DB_USER = 'lecycle_test_user';
process.env.DB_NAME = 'lecycle_test_db';
process.env.DB_PASSWORD = 'TestPassword123';

const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,    
  host: process.env.DB_HOST,
  database: process.env.DB_NAME, 
  password: process.env.DB_PASSWORD, 
  port: process.env.DB_PORT,     
});

const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');


async function createTestData() {

  console.log('DB_HOST:', process.env.DB_HOST);
  console.log('DB_USER:', process.env.DB_USER);
  console.log('DB_NAME:', process.env.DB_NAME);
  console.log('DB_PORT:', process.env.DB_PORT);
  
  try {
    // Nettoyer les tables
    await cleanDatabase();
    
    // Créer les entreprises
    await createTestCompanies();
    
    // Créer les clients
    await createTestClients();
    
    // Créer les admins
    await createTestAdmins();
    
    // Créer les technicians
    await createTestTechnicians();
    
    // Créer les vélos
    await createTestBicycles();
    
  } catch (error) {
    console.error('Erreur de requête :', error);
    throw error;
  }
}

/**
 * Supprimer les données de test
 */
async function cleanDatabase() {
  try {
    // Clés etrangere contrainte sur la table intervention donc supprimer les interventions liées aux vélos d'abord
    // un vélo qui est dans une table intervntion ne peut pas etre supprimé
    try {
      const testBikesResult = await pool.query(`
        SELECT b.id 
        FROM bicycle b 
        JOIN client c ON b.client_id = c.id 
        WHERE c.email LIKE '%@test.com'
      `);
      
      const testBikeIds = testBikesResult.rows.map(row => row.id);
      
      if (testBikeIds.length > 0) {
        try {
          await pool.query(
            'DELETE FROM intervention WHERE bicycle_id = ANY($1::int[])',
            [testBikeIds]
          );
        } catch (error) {
          console.error('Erreur avec interventions', error.message);
        }
      }
    } catch (error) {
      console.error('Erreur avec interventions', error.message);
    }
    
    // 2. Supprimer les vélos 
    try {
      await pool.query(`
        DELETE FROM bicycle 
        WHERE client_id IN (
          SELECT id FROM client WHERE email LIKE '%@test.com'
        )
      `);
    } catch (error) {
      console.error('Erreur avec vélos', error.message);
    }
    
    // 3. Supprimer les technicians 
    try {
      await pool.query('DELETE FROM technician WHERE email LIKE \'%@test.com\'');
    } catch (error) {
      console.error('Erreur avec technicien', error.message);
    }
    
    // 4. Supprimer les admins 
    try {
      await pool.query('DELETE FROM administrator WHERE email LIKE \'%@test.com\'');
    } catch (error) {
      console.error('Erreur avec admin', error.message);
    }
    
    // 5. Supprimer les clients 
    try {
      await pool.query('DELETE FROM client WHERE email LIKE \'%@test.com\'');
    } catch (error) {
      console.error('Erreur avec clients', error.message);
    }
    
    // 6. Supprimer les entreprises 
    try {
      await pool.query(`
        DELETE FROM company 
        WHERE email LIKE '%@test.com' 
           OR email LIKE '%.test.com'
           OR subdomain IN ('test', 'alpha', 'beta')
      `);
    } catch (error) {
      console.error('Erreur avec entreprises', error.message);
    }
    
    console.log('Nettoyage terminé avec succès');
    
  } catch (error) {
    console.error('Erreur lors du nettoyage:', error.message);
    throw error;
  }
}

async function createTestCompanies() {
  const companies = [
    {
      name: 'Test Company',
      email: 'contact@test.com',
      subdomain: 'test',
      theme_color: '#ff0000',
      phone: '0123456789'
    },
    {
      name: 'Alpha Company',
      email: 'contactalpha@test.com',
      subdomain: 'alpha',
      theme_color: '#00ff00',
      phone: '0123456788'
    },
    {
      name: 'Beta Company', 
      email: 'contactbeta@test.com',
      subdomain: 'beta',
      theme_color: '#0000ff',
      phone: '0123456787'
    }
  ];
  
  for (const company of companies) {
    await pool.query(
      'INSERT INTO company (name, email, subdomain, theme_color, phone) VALUES ($1, $2, $3, $4, $5)',
      [company.name, company.email, company.subdomain, company.theme_color, company.phone]
    );
  }
  
  console.log(`${companies.length} entreprises créées`);
}

async function createTestClients() {
  const companiesResult = await pool.query(`
    SELECT id FROM company 
    WHERE email LIKE '%@test.com' 
       OR subdomain IN ('test', 'alpha', 'beta')
    ORDER BY id
  `);
  const companyIds = companiesResult.rows.map(row => row.id);
  
  
  
  const clients = [];
  
  clients.push({
    first_name: 'Client',
    last_name: 'Test',
    email: 'client.test@test.com',
    password: await bcrypt.hash('password123', 10),
    phone: '0123456789',
    address: '123 Rue de Test, Paris',
    company_id: MAIN_TEST_COMPANY_ID
  });

  clients.push({
    first_name: 'AAA_Premier',
    last_name: 'AAAA',
    email: 'premier@test.com',
    password: await bcrypt.hash('password123', 10),
    phone: '0100000001',
    address: '1 Première Rue, Paris',
    company_id: MAIN_TEST_COMPANY_ID
  });
  
  clients.push({
    first_name: 'ZZZ_Dernier',
    last_name: 'ZZZZ',
    email: 'dernier@test.com',
    password: await bcrypt.hash('password123', 10),
    phone: '0100000002',
    address: '999 Dernière Rue, Paris',
    company_id: MAIN_TEST_COMPANY_ID
  });

  clients.push({
    first_name: 'Martin',
    last_name: 'Dupont',
    email: 'martin.dupont@test.com',
    password: await bcrypt.hash('password123', 10),
    phone: '0100000003',
    address: '10 Rue Martin, Paris',
    company_id: MAIN_TEST_COMPANY_ID
  });
  
  clients.push({
    first_name: 'Marie',
    last_name: 'Martin',
    email: 'marie.martin@test.com',
    password: await bcrypt.hash('password123', 10),
    phone: '0100000004',
    address: '20 Avenue Marie, Lyon',
    company_id: MAIN_TEST_COMPANY_ID
  });

  clients.push({
    first_name: 'Très',
    last_name: 'Ancien',
    email: 'ancien@test.com',
    password: await bcrypt.hash('password123', 10),
    phone: '0100000006',
    address: '40 Rue Ancienne, Nice',
    created_at: '2020-01-01',
    company_id: MAIN_TEST_COMPANY_ID
  });

  
  for (let i = 7; i <= 20; i++) {
    let assignedCompanyId = null;
    
    if (companyIds.length > 0 && Math.random() > 0.3) { 
      assignedCompanyId = companyIds[Math.floor(Math.random() * companyIds.length)];
    }
    
    clients.push({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: `client${i}@test.com`,
      password: await bcrypt.hash('password123', 10),
      phone: faker.phone.number('01########'),
      address: `${faker.location.streetAddress()}, ${faker.location.city()}`,
      created_at: faker.date.between({
        from: '2023-01-01',
        to: '2024-12-01'
      }).toISOString().split('T')[0],
      company_id: assignedCompanyId
    });
  }

 
  let clientsWithCompany = 0;
  let clientsWithoutCompany = 0;
  
  for (const client of clients) {
    const query = `
      INSERT INTO client (first_name, last_name, email, password, phone, address, created_at, company_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    
    const values = [
      client.first_name,
      client.last_name, 
      client.email,
      client.password,
      client.phone,
      client.address,
      client.created_at || new Date().toISOString().split('T')[0],
      client.company_id
    ];
    
    await pool.query(query, values);
    
    if (client.company_id) {
      clientsWithCompany++;
    } else {
      clientsWithoutCompany++;
    }
  }
  
  if (companyIds.length > 0) {
    console.log(` Companies utilisées: [${companyIds.join(', ')}]`);
  }
}

async function createTestAdmins() {
  await pool.query(`
    SELECT id FROM company 
    WHERE email LIKE '%@test.com' 
       OR subdomain IN ('test', 'alpha', 'beta')
    ORDER BY id
  `);
  
  const admins = [
    {
      first_name: 'Admin',
      last_name: 'Test',
      email: 'admin.test@test.com',
      password: await bcrypt.hash('admin123', 10),
      phone: '0123456788',
      role: 'superadmin',
      company_id: MAIN_TEST_COMPANY_ID
    },
    {
      first_name: 'Seul',
      last_name: 'Admin',
      email: 'seul.admin@test.com',
      password: await bcrypt.hash('password123', 10),
      phone: '0100000005',
      role: 'admin',
      company_id: MAIN_TEST_COMPANY_ID
    }
  ];
  
  for (const admin of admins) {
    const query = `
      INSERT INTO administrator (first_name, last_name, email, password,role,company_id) 
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    
    await pool.query(query, [
      admin.first_name,
      admin.last_name,
      admin.email,
      admin.password,
      admin.role,
      admin.company_id
    ]);
  }
  
}

async function createTestTechnicians() {
  const technicians = [
    {
      first_name: 'Technicien',
      last_name: 'Test',
      email: 'tech.test@test.com',
      password: await bcrypt.hash('tech123', 10),
      phone: '0123456787',
      address: '789 Boulevard Tech, Marseille',
      company_id: MAIN_TEST_COMPANY_ID
    },
    {
      first_name: 'AAA_Premier',
      last_name: 'Technicien',
      email: 'tech.premier@test.com',
      password: await bcrypt.hash('password123', 10),
      phone: '0100000010',
      address: '1 Rue Technique, Paris',
      company_id: MAIN_TEST_COMPANY_ID
    }
  ];
  
  for (const tech of technicians) {
    const query = `
      INSERT INTO technician (first_name, last_name, email, password, phone, address, company_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    
    await pool.query(query, [
      tech.first_name,
      tech.last_name,
      tech.email,
      tech.password,
      tech.phone,
      tech.address,
      tech.company_id
    ]);
  }
  
  console.log(`technicians créés`);
}

async function createTestBicycles() {
  
  const bikeTypes = ['Vélo classique', 'Vélo électrique (VAE)', 'VTT'];
  const brands = ['Trek', 'Giant', 'Specialized', 'Cannondale', 'Scott'];
  const bicycles = [];
  
  const clientsResult = await pool.query('SELECT id FROM client WHERE email LIKE \'%@test.com\' ORDER BY id LIMIT 20');
  const clientIds = clientsResult.rows.map(row => row.id);
  
  if (clientIds.length === 0) {
    console.log('Pas de client trouvé');
    return;
  }
  
  // ajout velo pour recherche ou tri
  bicycles.push({
    brand: 'AAA_Brand',
    model: 'Premier Modèle',
    c_year: 2024,
    type: 'Vélo classique',
    client_id: clientIds[0]
  });
  
  bicycles.push({
    brand: 'ZZZ_Brand', 
    model: 'Dernier Modèle',
    c_year: 2024,
    type: 'VTT',
    client_id: clientIds[1] || clientIds[0] 
  });
  
  bicycles.push({
    brand: 'Trek',
    model: 'Domane SL',
    c_year: 2023,
    type: 'Vélo classique',
    client_id: clientIds[2] || clientIds[0]
  });
  
  const maxBikes = clientIds.length * 2; // max 2 velos par client
  for (let i = 4; i <= maxBikes; i++) {
    bicycles.push({
      brand: faker.helpers.arrayElement(brands),
      model: faker.commerce.productName(),
      c_year: faker.number.int({ min: 2018, max: 2024 }),
      type: faker.helpers.arrayElement(bikeTypes),
      client_id: faker.helpers.arrayElement(clientIds)
    });
  }
  
  // Insertion en base
  for (const bike of bicycles) {
    await pool.query(
      'INSERT INTO bicycle (brand, model, c_year, type, client_id) VALUES ($1, $2, $3, $4, $5)',
      [bike.brand, bike.model, bike.c_year, bike.type, bike.client_id]
    );
  }
}

// exec
if (require.main === module) {
  createTestData()
    .then(() => {
      console.log('Terminé avec succès');
    })
    .catch(error => {
      console.error('Script échoué :', error);
    });
}

module.exports = { 
  createTestData,
  cleanDatabase,
  createTestCompanies,
  createTestClients,
  createTestAdmins,
  createTestTechnicians,
  createTestBicycles
};