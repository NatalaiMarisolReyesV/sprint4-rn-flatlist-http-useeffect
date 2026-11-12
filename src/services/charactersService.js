import { API_BASE_URL } from '../config/constants';

// getCharacters({ page, name }) → Promise<{ results, hasNextPage }>
export async function getCharacters({ page = 1, name = '' } = {}) {
  // 1. Armar la URL con la página.
  let url = `${API_BASE_URL}/character?page=${page}`;

  // 2. Agregar el nombre solo si no está vacío, codificado para la URL.
  const search = name.trim();
  if (search !== '') {
    url += `&name=${encodeURIComponent(search)}`;
  }

  // 3. Pedir los datos. Si no hay red, fetch lanza el error y sigue de largo.
  const response = await fetch(url);

  // 4. 404 = "sin resultados", no es un error de la app.
  if (response.status === 404) {
    return { results: [], hasNextPage: false };
  }

  // 5. Cualquier otra respuesta no exitosa sí es un error.
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  // 6. Convertir a objeto y devolver el contrato.
  const data = await response.json();
  return {
    results: data.results,
    hasNextPage: data.info.next !== null,
  };
}