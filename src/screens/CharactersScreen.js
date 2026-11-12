import { useEffect, useRef, useState } from 'react';
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

// Paso 7: separador definido fuera del componente para que no se recree en cada render.
function ItemSeparator() {
  return <View style={styles.separator} />;
}

export default function CharactersScreen() {
  // Paso 3: estados de la pantalla.
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Paso 6: contador que sube con cada "Reintentar" para volver a correr el efecto.
  const [reloadKey, setReloadKey] = useState(0);

  // Paso 8: estados de la paginación.
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Paso 8: bloqueo inmediato para que "cargar más" no se dispare dos veces seguidas.
  const loadingMoreRef = useRef(false);

  // Paso 4, 6 y 8: carga inicial (se repite cuando cambia reloadKey).
  useEffect(() => {
    async function loadCharacters() {
      setLoading(true);
      setError(null);
      try {
        const { results, hasNextPage: more } = await getCharacters({ page: 1 });
        setCharacters(results);
        setPage(1);
        setHasNextPage(more);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    loadCharacters();
  }, [reloadKey]);

  // Paso 8: cargar la página siguiente.
  async function loadMore() {
    // No tiene sentido si ya se está cargando, o si la API dice que no hay más páginas.
    if (loading || loadingMoreRef.current || !hasNextPage) return;

    loadingMoreRef.current = true;
    setLoadingMore(true);
    setError(null);
    try {
      const nextPage = page + 1;
      const { results, hasNextPage: more } = await getCharacters({ page: nextPage });
      // Arreglo nuevo: los personajes anteriores + los nuevos.
      setCharacters((previous) => [...previous, ...results]);
      setPage(nextPage);
      setHasNextPage(more);
    } catch (e) {
      // Solo se guarda el error; los personajes ya cargados se conservan.
      setError(e.message);
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }

  // TODO Paso 9: pull to refresh.
  // TODO Paso 10: búsqueda con debounce.

  // Paso 8: indicador o error al final de la lista.
  function renderFooter() {
    if (loadingMore) {
      return <ActivityIndicator style={styles.footer} color={COLORS.primary} />;
    }
    if (error && characters.length > 0) {
      return <Text style={styles.footerError}>{error}</Text>;
    }
    return null;
  }

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
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={<StateMessage message="No characters to show." />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter()}
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