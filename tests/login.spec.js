import { test, expect } from '@playwright/test';

test.describe('Sistema de Login', () => {
  
  test('debería mostrar la página de login correctamente', async ({ page }) => {
    await page.goto('/login');
    
    // Verificar que la página se carga correctamente
    await expect(page).toHaveTitle(/Login - CopilotMcp Demo/);
    await expect(page.locator('h1')).toContainText('Iniciar Sesión');
    
    // Verificar que los campos están presentes
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#loginBtn')).toBeVisible();
    
    // Verificar que las credenciales de demo se muestran
    await expect(page.locator('.demo-credentials')).toContainText('admin / 123456');
    await expect(page.locator('.demo-credentials')).toContainText('user / password');
  });

  test('debería realizar login exitoso con credenciales válidas (admin)', async ({ page }) => {
    await page.goto('/login');
    
    // Llenar el formulario con credenciales válidas
    await page.fill('#username', 'admin');
    await page.fill('#password', '123456');
    
    // Hacer click en el botón de login
    await page.click('#loginBtn');
    
    // Verificar mensaje de éxito
    await expect(page.locator('#message')).toContainText('¡Bienvenido, admin!');
    await expect(page.locator('#message')).toHaveClass(/success/);
    
    // Verificar redirección a la página principal
    await page.waitForURL('/');
    await expect(page).toHaveURL('/');
  });

  test('debería realizar login exitoso con credenciales válidas (user)', async ({ page }) => {
    await page.goto('/login');
    
    // Llenar el formulario con credenciales válidas
    await page.fill('#username', 'user');
    await page.fill('#password', 'password');
    
    // Hacer click en el botón de login
    await page.click('#loginBtn');
    
    // Verificar mensaje de éxito
    await expect(page.locator('#message')).toContainText('¡Bienvenido, user!');
    await expect(page.locator('#message')).toHaveClass(/success/);
    
    // Verificar redirección a la página principal
    await page.waitForURL('/');
    await expect(page).toHaveURL('/');
  });

  test('debería mostrar error con credenciales inválidas', async ({ page }) => {
    await page.goto('/login');
    
    // Llenar el formulario con credenciales inválidas
    await page.fill('#username', 'admin');
    await page.fill('#password', 'wrongpassword');
    
    // Hacer click en el botón de login
    await page.click('#loginBtn');
    
    // Verificar mensaje de error
    await expect(page.locator('#message')).toContainText('Credenciales inválidas');
    await expect(page.locator('#message')).toHaveClass(/error/);
    
    // Verificar que permanece en la página de login
    await expect(page).toHaveURL('/login');
  });

  test('debería mostrar error con usuario inexistente', async ({ page }) => {
    await page.goto('/login');
    
    // Llenar el formulario con usuario inexistente
    await page.fill('#username', 'noexiste');
    await page.fill('#password', 'password');
    
    // Hacer click en el botón de login
    await page.click('#loginBtn');
    
    // Verificar mensaje de error
    await expect(page.locator('#message')).toContainText('Credenciales inválidas');
    await expect(page.locator('#message')).toHaveClass(/error/);
    
    // Verificar que permanece en la página de login
    await expect(page).toHaveURL('/login');
  });

  test('debería mostrar error con campos vacíos', async ({ page }) => {
    await page.goto('/login');
    
    // Hacer click en el botón sin llenar campos
    await page.click('#loginBtn');
    
    // Verificar mensaje de error
    await expect(page.locator('#message')).toContainText('Por favor, completa todos los campos');
    await expect(page.locator('#message')).toHaveClass(/error/);
    
    // Verificar que permanece en la página de login
    await expect(page).toHaveURL('/login');
  });

  test('debería mostrar error con solo usuario vacío', async ({ page }) => {
    await page.goto('/login');
    
    // Llenar solo la contraseña
    await page.fill('#password', 'password');
    
    // Hacer click en el botón de login
    await page.click('#loginBtn');
    
    // Verificar mensaje de error
    await expect(page.locator('#message')).toContainText('Por favor, completa todos los campos');
    await expect(page.locator('#message')).toHaveClass(/error/);
  });

  test('debería mostrar error con solo contraseña vacía', async ({ page }) => {
    await page.goto('/login');
    
    // Llenar solo el usuario
    await page.fill('#username', 'admin');
    
    // Hacer click en el botón de login
    await page.click('#loginBtn');
    
    // Verificar mensaje de error
    await expect(page.locator('#message')).toContainText('Por favor, completa todos los campos');
    await expect(page.locator('#message')).toHaveClass(/error/);
  });

  test('debería deshabilitar el botón durante el login', async ({ page }) => {
    await page.goto('/login');
    
    // Llenar el formulario
    await page.fill('#username', 'admin');
    await page.fill('#password', '123456');
    
    // Hacer click en el botón de login
    await page.click('#loginBtn');
    
    // Verificar que el botón se deshabilita y cambia el texto
    await expect(page.locator('#loginBtn')).toBeDisabled();
    await expect(page.locator('#loginBtn')).toContainText('Iniciando sesión...');
  });

  test('debería funcionar el enlace para volver al inicio', async ({ page }) => {
    await page.goto('/login');
    
    // Hacer click en el enlace de volver
    await page.click('text=Volver al inicio');
    
    // Verificar redirección a la página principal
    await expect(page).toHaveURL('/');
  });
});