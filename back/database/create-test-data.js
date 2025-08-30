
require('dotenv').config();

const MAIN_TEST_COMPANY_ID = 10;

const isTestEnvironment = process.env.NODE_ENV === 'test';

process.env.DB_HOST = 'localhost';
process.env.DB_PORT = 5434; 
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
    await cleanDatabase();
    await createTestCompanies();
    await createTestClients();
    await createTestAdmins();
    await createTestTechnicians();
    await createTestBicycles();
  } catch (error) {
    console.error('Erreur de requête :', error);
    throw error;
  }
}

async function cleanDatabase() {
  try {
    try {
      const testBikesResult = await pool.query(`
        SELECT b.id 
        FROM bicycle b 
        JOIN client c ON b.client_id = c.id 
        WHERE c.email LIKE '%@demo.com'
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
    
    await pool.query(`
      DELETE FROM bicycle 
      WHERE client_id IN (
        SELECT id FROM client WHERE email LIKE '%@demo.com'
      )
    `);
    await pool.query('DELETE FROM technician WHERE email LIKE \'%@demo.com\'');
    await pool.query('DELETE FROM administrator WHERE email LIKE \'%@demo.com\'');
    await pool.query('DELETE FROM client WHERE email LIKE \'%@demo.com\'');
    await pool.query(`
      DELETE FROM company 
      WHERE email LIKE '%@demo.com' 
         OR email LIKE '%.demo.com'
         OR subdomain IN ('gamma', 'delta', 'omega')
    `);
    
    console.log('Nettoyage terminé avec succès');
  } catch (error) {
    console.error('Erreur lors du nettoyage:', error.message);
    throw error;
  }
}

async function createTestCompanies() {
  const companies = [
    {
      name: 'VeloCity Corp',
      email: 'contact@gamma.demo.com',
      subdomain: 'gamma',
      theme_color: '#aa0000',
      phone: '0145000001'
    },
    {
      name: 'Delta Rides',
      email: 'hello@delta.demo.com',
      subdomain: 'delta',
      theme_color: '#00aa00',
      phone: '0145000002'
    },
    {
      name: 'Omega Cycles',
      email: 'info@omega.demo.com',
      subdomain: 'omega',
      theme_color: '#0000aa',
      phone: '0145000003'
    },
    {
      name: 'Speedy Wheels',
      email: 'contact@speedy.demo.com',
      subdomain: 'speedy',
      theme_color: '#ffaa00',
      phone: '0145000004'
    },
    {
      name: 'Urban Pedal',
      email: 'hello@urban.demo.com',
      subdomain: 'urban',
      theme_color: '#00aaff',
      phone: '0145000005'
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
    WHERE email LIKE '%@demo.com' 
       OR subdomain IN ('gamma', 'delta', 'omega')
    ORDER BY id
  `);
  const companyIds = companiesResult.rows.map(row => row.id);
  
  const clients = [];
  
  clients.push({
    first_name: 'Jean',
    last_name: 'Durand',
    email: 'jean.durand@demo.com',
    password: await bcrypt.hash('password123', 10),
    phone: '0100000100',
    address: '5 Rue de Lyon, Paris',
    company_id: MAIN_TEST_COMPANY_ID
  });

  clients.push({
    first_name: 'Claire',
    last_name: 'Petit',
    email: 'claire.petit@demo.com',
    password: await bcrypt.hash('password123', 10),
    phone: '0100000101',
    address: '8 Avenue République, Lyon',
    company_id: MAIN_TEST_COMPANY_ID
  });

  clients.push({
    first_name: 'Lucas',
    last_name: 'Bernard',
    email: 'lucas.bernard@demo.com',
    password: await bcrypt.hash('password123', 10),
    phone: '0100000102',
    address: '12 Boulevard Sud, Marseille',
    company_id: MAIN_TEST_COMPANY_ID
  });

  clients.push({
    first_name: 'Sophie',
    last_name: 'Roux',
    email: 'sophie.roux@demo.com',
    password: await bcrypt.hash('password123', 10),
    phone: '0100000103',
    address: '25 Rue Centrale, Toulouse',
    company_id: MAIN_TEST_COMPANY_ID
  });

  for (let i = 5; i <= 20; i++) {
    let assignedCompanyId = null;
    if (companyIds.length > 0 && Math.random() > 0.3) { 
      assignedCompanyId = companyIds[Math.floor(Math.random() * companyIds.length)];
    }
    clients.push({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: `client${i}@demo.com`,
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

  for (const client of clients) {
    await pool.query(
      `INSERT INTO client (first_name, last_name, email, password, phone, address, created_at, company_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        client.first_name,
        client.last_name, 
        client.email,
        client.password,
        client.phone,
        client.address,
        client.created_at || new Date().toISOString().split('T')[0],
        client.company_id
      ]
    );
  }
}

async function createTestAdmins() {
  const admins = [
    // Admins fixes
    {
      first_name: 'Paul',
      last_name: 'Vincent',
      email: 'paul.vincent@demo.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'superadmin',
      company_id: MAIN_TEST_COMPANY_ID
    },
    {
      first_name: 'Maxime',
      last_name: 'Guerin',
      email: 'maxime.guerin@demo.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'superadmin',
      company_id: MAIN_TEST_COMPANY_ID
    },
    {
      first_name: 'Julie',
      last_name: 'Gestion',
      email: 'julie.gestion@demo.com',
      password: await bcrypt.hash('password123', 10),
      role: 'admin',
      company_id: MAIN_TEST_COMPANY_ID
    },
    {
      first_name: 'Alice',
      last_name: 'Dupont',
      email: 'alice.dupont@demo.com',
      password: await bcrypt.hash('password123', 10),
      role: 'admin',
      company_id: MAIN_TEST_COMPANY_ID
    },
    {
      first_name: 'Marc',
      last_name: 'Leroy',
      email: 'marc.leroy@demo.com',
      password: await bcrypt.hash('password123', 10),
      role: 'admin',
      company_id: MAIN_TEST_COMPANY_ID
    },
    {
      first_name: 'Elise',
      last_name: 'Martin',
      email: 'elise.martin@demo.com',
      password: await bcrypt.hash('password123', 10),
      role: 'admin',
      company_id: MAIN_TEST_COMPANY_ID
    }
  ];

  //  2 superadmins supplémentaires
  for (let i = 1; i <= 2; i++) {
    admins.push({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: `superadmin${i}@demo.com`,
      password: await bcrypt.hash('superadmin123', 10),
      role: 'superadmin',
      company_id: MAIN_TEST_COMPANY_ID
    });
  }

  // 10 admins supplémentaires
  for (let i = 1; i <= 10; i++) {
    admins.push({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: `admin${i}@demo.com`,
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      company_id: MAIN_TEST_COMPANY_ID
    });
  }

  for (const admin of admins) {
    await pool.query(
      `INSERT INTO administrator (first_name, last_name, email, password, role, company_id) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [admin.first_name, admin.last_name, admin.email, admin.password, admin.role, admin.company_id]
    );
  }

  console.log(`${admins.length} administrateurs créés`);
}

async function createTestTechnicians() {
  const technicians = [
    // Techniciens fixes
    {
      first_name: 'Marc',
      last_name: 'Tech',
      email: 'marc.tech@demo.com',
      password: await bcrypt.hash('tech123', 10),
      phone: '0100000300',
      address: '45 Rue Technique, Nantes',
      company_id: MAIN_TEST_COMPANY_ID
    },
    {
      first_name: 'Elise',
      last_name: 'Support',
      email: 'elise.support@demo.com',
      password: await bcrypt.hash('password123', 10),
      phone: '0100000301',
      address: '99 Avenue Ingénieur, Bordeaux',
      company_id: MAIN_TEST_COMPANY_ID
    }
  ];

  // 20 techniciens supplémentaires
  for (let i = 1; i <= 20; i++) {
    technicians.push({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: `tech${i}@demo.com`,
      password: await bcrypt.hash('tech123', 10),
      phone: `01000003${10 + i}`,
      address: `${faker.location.streetAddress()}, ${faker.location.city()}`,
      company_id: MAIN_TEST_COMPANY_ID
    });
  }

  for (const tech of technicians) {
    await pool.query(
      `INSERT INTO technician (first_name, last_name, email, password, phone, company_id) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [tech.first_name, tech.last_name, tech.email, tech.password, tech.phone, tech.company_id]
    );
  }

  console.log(`${technicians.length} techniciens créés`);
}

async function createTestBicycles() {
  const bikeTypes = ['Vélo classique', 'Vélo électrique (VAE)', 'VTT'];
  const brands = ['Peugeot', 'Bianchi', 'Orbea', 'Cube', 'Merida'];
  const bicycles = [];
  
  const clientsResult = await pool.query('SELECT id FROM client WHERE email LIKE \'%@demo.com\' ORDER BY id LIMIT 20');
  const clientIds = clientsResult.rows.map(row => row.id);
  
  if (clientIds.length === 0) {
    console.log('Pas de client trouvé');
    return;
  }
  
  bicycles.push({
    brand: 'AAA_Brand',
    model: 'Alpha Model',
    c_year: 2024,
    type: 'Vélo classique',
    client_id: clientIds[0]
  });
  bicycles.push({
    brand: 'ZZZ_Brand', 
    model: 'Omega Model',
    c_year: 2024,
    type: 'VTT',
    client_id: clientIds[1] || clientIds[0] 
  });
  bicycles.push({
    brand: 'Peugeot',
    model: 'SpeedX',
    c_year: 2023,
    type: 'Vélo classique',
    client_id: clientIds[2] || clientIds[0]
  });
  
  const maxBikes = clientIds.length * 2;
  for (let i = 4; i <= maxBikes; i++) {
    bicycles.push({
      brand: faker.helpers.arrayElement(brands),
      model: faker.commerce.productName(),
      c_year: faker.number.int({ min: 2018, max: 2024 }),
      type: faker.helpers.arrayElement(bikeTypes),
      client_id: faker.helpers.arrayElement(clientIds)
    });
  }
  
  for (const bike of bicycles) {
    await pool.query(
      'INSERT INTO bicycle (brand, model, c_year, type, client_id) VALUES ($1, $2, $3, $4, $5)',
      [bike.brand, bike.model, bike.c_year, bike.type, bike.client_id]
    );
  }
}

if (require.main === module) {
  const onlyDelete = process.argv.includes('--onlyDelete');

  if (onlyDelete) {
    cleanDatabase()
      .then(() => console.log('Suppression terminée avec succès'))
      .catch(error => console.error('Erreur lors de la suppression :', error));
  } else {
    createTestData()
      .then(() => console.log('Terminé avec succès'))
      .catch(error => console.error('Script échoué :', error));
  }
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
