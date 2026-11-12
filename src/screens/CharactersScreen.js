import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../config/constants';
import { getCharacters } from '../services/charactersService';
import CharacterCard from '../components/CharacterCard';
import StateMessage from '../components/StateMessage';

// ✍️ LO PROGRAMAS TÚ (Pasos 3 al 10)
//
// Sigue la GUIA_ALUMNO.md. Cada TODO indica en qué paso debes trabajar
// en ese punto. Puedes borrar los comentarios TODO conforme los resuelvas.
//
// Los estilos de abajo ya están listos. Nombres disponibles:
//   container, title, input, loader, separator, listContent, footer, footerError

export default function CharactersScreen() {
  // Paso 3: estados de la pantalla.
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Paso 6: contador que sube con cada "Reintentar" para volver a correr el efecto.
  const [reloadKey, setReloadKey] = useState(0);

  // Paso 4 y 6: carga inicial (se repite cuando cambia reloadKey).
  useEffect(() => {
    async function loadCharacters() {
      setLoading(true);
      setError(null);
      try {
        const { results } = await getCharacters({ page: 1 });
        setCharacters(results);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    loadCharacters();
  }, [reloadKey]);

  // TODO Paso 8: paginación (estado extra + función para cargar más).
  // TODO Paso 9: pull to refresh.
  // TODO Paso 10: búsqueda con debounce.

  function renderContent() {
    if (loading) {
      return <ActivityIndicator style={styles.loader} size="large" color={COLORS.primary} />;
    }

    if (error && characters.length === 0) {
      return (
        <StateMessage
          message={error}
          actionLabel="Reintentar"
          onAction={() => setReloadKey((key) => key + 1)}
        />
      );
    }

    return (
      <FlatList
        data={characters}
        renderItem={({ item }) => <CharacterCard character={item} />}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rick and Morty</Text>

      {/* TODO Paso 10: aquí va el campo de búsqueda. */}

      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 16 },
  title: {
    color: COLORS.primary,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 12,
  },
  input: {
    backgroundColor: COLORS.card,
    color: COLORS.text,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  loader: { marginTop: 40 },
  separator: { height: 10 },
  listContent: { paddingBottom: 24 },
  footer: { marginVertical: 16 },
  footerError: { color: COLORS.danger, textAlign: 'center', marginVertical: 16 },
  placeholder: { color: COLORS.textMuted, fontSize: 16, marginTop: 24 },
});