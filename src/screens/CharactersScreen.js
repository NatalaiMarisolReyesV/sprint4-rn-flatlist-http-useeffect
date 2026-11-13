import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { COLORS, DEBOUNCE_MS } from '../config/constants';
import { getCharacters } from '../services/charactersService';
import CharacterCard from '../components/CharacterCard';
import StateMessage from '../components/StateMessage';

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

  // Paso 9: estado propio para el gesto de jalar hacia abajo.
  const [refreshing, setRefreshing] = useState(false);

  // Paso 10: lo que el usuario escribe (cambia en cada tecla)...
  const [searchText, setSearchText] = useState('');
  // ...y el texto que realmente se usa para buscar (cambia al dejar de escribir).
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Paso 10: siempre guarda la búsqueda vigente, para descartar respuestas viejas.
  const searchRef = useRef('');
  searchRef.current = debouncedSearch;

  // Paso 10: debounce. Espera DEBOUNCE_MS después de la última tecla.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText.trim());
    }, DEBOUNCE_MS);

    // Limpieza: si el usuario sigue escribiendo, el temporizador anterior se cancela.
    return () => clearTimeout(timer);
  }, [searchText]);

  // Paso 4, 6, 8 y 10: carga inicial. Se repite con "Reintentar" o con una búsqueda nueva.
  useEffect(() => {
    // Paso 10: si esta petición queda vieja (cambió la búsqueda), se ignora su respuesta.
    let ignore = false;

    async function loadCharacters() {
      setLoading(true);
      setError(null);
      setCharacters([]);
      try {
        const { results, hasNextPage: more } = await getCharacters({
          page: 1,
          name: debouncedSearch,
        });
        if (ignore) return;
        setCharacters(results);
        setPage(1);
        setHasNextPage(more);
      } catch (e) {
        if (ignore) return;
        setError(e.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadCharacters();

    // Limpieza: se ejecuta antes del siguiente efecto y marca esta petición como vieja.
    return () => {
      ignore = true;
    };
  }, [reloadKey, debouncedSearch]);

  // Paso 8 y 10: cargar la página siguiente (con la búsqueda vigente).
  async function loadMore() {
    // No tiene sentido si ya se está cargando o actualizando, o si no hay más páginas.
    if (loading || refreshing || loadingMoreRef.current || !hasNextPage) return;

    const search = debouncedSearch;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    setError(null);
    try {
      const nextPage = page + 1;
      const { results, hasNextPage: more } = await getCharacters({
        page: nextPage,
        name: search,
      });
      // Si la búsqueda cambió mientras tanto, estos resultados ya no sirven.
      if (search !== searchRef.current) return;
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

  // Paso 9 y 10: volver a pedir la página 1 (con la búsqueda vigente) y reemplazar la lista.
  async function handleRefresh() {
    if (refreshing || loadingMoreRef.current) return;

    const search = debouncedSearch;
    setRefreshing(true);
    setError(null);
    try {
      const { results, hasNextPage: more } = await getCharacters({
        page: 1,
        name: search,
      });
      if (search !== searchRef.current) return;
      setCharacters(results);
      setPage(1);
      setHasNextPage(more);
    } catch (e) {
      setError(e.message);
    } finally {
      setRefreshing(false);
    }
  }

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
        refreshing={refreshing}
        onRefresh={handleRefresh}
        keyboardShouldPersistTaps="handled"
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rick and Morty</Text>

      {/* Paso 10: el campo va fuera de la parte que cambia (spinner / error / lista). */}
      <TextInput
        style={styles.input}
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search by name"
        placeholderTextColor={COLORS.textMuted}
        autoCorrect={false}
        autoCapitalize="none"
      />

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