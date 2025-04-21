import axios from 'axios';

// Datos de prueba para el registro
const testUser = {
  code: 'TEST888',
  first_name: 'Usuario',
  last_name: 'Prueba',
  surname: 'Test',
  phone: '123456789',
  email: 'prueba888@ejemplo.com',
  password: 'password123'
};

// Función para probar el registro
async function testRegister() {
  try {
    console.log('Enviando datos de prueba desde el frontend:', testUser);
    
    const response = await axios.post('http://localhost:4000/api/register', testUser);
    
    console.log('Respuesta del servidor:');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    
    console.log('Prueba exitosa - Usuario registrado correctamente');
  } catch (error) {
    console.error('Error en la prueba:');
    if (axios.isAxiosError(error) && error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

// Ejecutar la prueba
testRegister(); 